// Firebase katmanı: giriş (e-posta/şifre) + Firestore eşleme. SDK tembel yüklenir; yüklenemezse (çevrimdışı) uygulama
// yerel verisiyle çalışmaya devam eder. Sürüm sabit: gstatic'ten, servis çalışanı bunları da önbelleğe alır.
import { firebaseConfig } from './firebase-config.js';

const CDN = 'https://www.gstatic.com/firebasejs/10.14.1';
let sdk = null;
let docRef = null;
let unsubscribe = null;

export async function loadCloud() {
  if (sdk) return sdk;
  const [appM, authM, fsM] = await Promise.all([
    import(`${CDN}/firebase-app.js`),
    import(`${CDN}/firebase-auth.js`),
    import(`${CDN}/firebase-firestore.js`),
  ]);
  const app = appM.initializeApp(firebaseConfig);
  let db;
  try {
    db = fsM.initializeFirestore(app, { localCache: fsM.persistentLocalCache({ tabManager: fsM.persistentSingleTabManager() }) });
  } catch {
    db = fsM.getFirestore(app);
  }
  sdk = { auth: authM, authInst: authM.getAuth(app), fs: fsM, db };
  docRef = fsM.doc(db, 'family', 'main');
  return sdk;
}

export async function watchAuth(callback) {
  const s = await loadCloud();
  return s.auth.onAuthStateChanged(s.authInst, callback);
}

export async function signIn(email, password) {
  const s = await loadCloud();
  await s.auth.signInWithEmailAndPassword(s.authInst, email, password);
}

export async function signOutUser() {
  stopSync();
  if (!sdk) return;
  await sdk.auth.signOut(sdk.authInst);
}

export const signedInEmail = () => sdk?.authInst.currentUser?.email ?? null;

// Mevcut şifreyle kimliği yeniden doğrular, sonra yeni şifreyi kaydeder. Oturum açık kalır.
export async function changePassword(current, next) {
  const s = await loadCloud();
  const user = s.authInst.currentUser;
  if (!user?.email) throw { code: 'auth/requires-recent-login' };
  await s.auth.reauthenticateWithCredential(user, s.auth.EmailAuthProvider.credential(user.email, current));
  await s.auth.updatePassword(user, next);
}

export async function sendPasswordReset(email) {
  const s = await loadCloud();
  await s.auth.sendPasswordResetEmail(s.authInst, email);
}

export function describePasswordError(err) {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Mevcut şifre hatalı.';
    case 'auth/weak-password':
      return 'Yeni şifre çok zayıf. En az 6 karakter olmalı.';
    case 'auth/too-many-requests':
      return 'Çok fazla deneme yapıldı. Biraz bekleyip tekrar dene.';
    case 'auth/requires-recent-login':
      return 'Güvenlik için çıkış yapıp yeniden girmen gerekiyor.';
    case 'auth/invalid-email':
      return 'E-posta adresi geçersiz.';
    case 'auth/network-request-failed':
      return 'Bağlantı kurulamadı. İnternetini kontrol et.';
    default:
      return err?.message?.includes('import') || err instanceof TypeError ? 'Bağlantı kurulamadı. İnternetini kontrol et.' : 'İşlem yapılamadı. Biraz sonra tekrar dene.';
  }
}

export function describeAuthError(err) {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'E-posta ya da şifre hatalı.';
    case 'auth/too-many-requests':
      return 'Çok fazla deneme yapıldı. Biraz bekleyip tekrar dene.';
    case 'auth/network-request-failed':
      return 'Bağlantı kurulamadı. İnternetini kontrol et.';
    default:
      return err?.message?.includes('import') || err instanceof TypeError ? 'Bağlantı kurulamadı. İnternetini kontrol et.' : 'Giriş yapılamadı.';
  }
}

// Belgeyi dinler. İlk yanıt gelince (ya da hata verince) çözülür. Sunucu "belge yok" derse yerel veriyle ilk kez doldurulur.
export function stopSync() {
  unsubscribe?.();
  unsubscribe = null;
}

export function startSync({ onData, seed, onError }) {
  stopSync();
  return new Promise((resolve) => {
    let first = true;
    const done = () => {
      if (first) {
        first = false;
        resolve();
      }
    };
    unsubscribe = sdk.fs.onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          // Önbellekten gelen "yok" cevabına güvenme: yalnızca sunucu doğrularsa tohumla.
          if (first && !snap.metadata.fromCache) {
            const partial = seed();
            if (partial) write(partial);
          }
        } else if (!snap.metadata.hasPendingWrites) {
          onData(snap.data());
        }
        done();
      },
      (err) => {
        console.warn('Bulut dinleme hatası', err.code);
        onError?.(err);
        done();
      }
    );
  });
}

function write(partial) {
  if (!sdk?.authInst.currentUser) return;
  sdk.fs.setDoc(docRef, partial, { merge: true }).catch((e) => console.warn('Bulut yazma hatası', e.code));
}

// Yerel değişikliği buluta yazar (giriş yoksa sessizce atlar; yerel kayıt zaten yapıldı).
export const cloud = {
  levels: (levels) => write({ settings: { levels } }),
  birth: (iso) => write({ baby: { birth: iso } }),
  done: (date, id, on) => write({ done: { [date]: on ? sdk.fs.arrayUnion(id) : sdk.fs.arrayRemove(id) } }),
  note: (n) => write({ notes: { [n.id]: n } }),
  removeNote: (id) => write({ notes: { [id]: sdk.fs.deleteField() } }),
  checked: (id, on) => write({ milestones: { [id]: on ? true : sdk.fs.deleteField() } }),
};
