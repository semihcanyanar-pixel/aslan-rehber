import { getProfile, getStoredBirth, clearFamilyData, applyRemote, localSnapshot } from './state.js';
import { setBirth, hasBirth } from './logic/period.js';
import { watchAuth, startSync, stopSync } from './cloud.js';
import { render as renderProfil } from './screens/profil.js';
import { render as renderBugun } from './screens/bugun.js';
import { render as renderAyarlar } from './screens/ayarlar.js';
import { render as renderIngilizce } from './screens/ingilizce.js';
import { render as renderGorev } from './screens/gorev.js';
import { render as renderGelisim } from './screens/gelisim.js';
import { render as renderKaynaklar } from './screens/kaynaklar.js';
import { render as renderTakip } from './screens/takip.js';
import { render as renderGiris } from './screens/giris.js';
import { render as renderKurulum } from './screens/kurulum.js';

const routes = {
  '#/kaynaklar': renderKaynaklar,
  '#/takip': renderTakip,
  '#/gelisim': renderGelisim,
  '#/ingilizce': renderIngilizce,
  '#/profil': renderProfil,
  '#/ayarlar': renderAyarlar,
  '#/bugun': renderBugun,
  '#/giris': renderGiris,
  '#/kurulum': renderKurulum,
};

const SESSION_FLAG = 'aslan.session';
const root = document.getElementById('app');

// 'unknown': açılış, giriş durumu henüz bilinmiyor · 'out': giriş gerekli · 'in': giriş yapılmış (ya da çevrimdışı ve daha önce girilmiş)
let session = 'unknown';
export const status = { loginError: null };

function navigate(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

function resolve(hash) {
  if (session === 'unknown') return null;
  if (session === 'out') return '#/giris';
  if (!hasBirth()) return '#/kurulum';
  if (!getProfile()) return '#/profil';
  if (hash === '#/giris' || hash === '#/kurulum') return '#/bugun';
  if (!/^#\/gorev\/.+/.test(hash) && !routes[hash]) return '#/bugun';
  return hash;
}

// Açılış ekranı (index.html'deki .boot): harf animasyonu bitene kadar, giriş durumu belli olsa bile görünür kalır.
const BOOT_MS = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 600 : 2400;
let bootTimeUp = false;
let bootClosed = false;
setTimeout(() => {
  bootTimeUp = true;
  route();
}, BOOT_MS);

function route() {
  const hash = resolve(location.hash);
  if (hash === null) {
    if (!root.querySelector('.boot')) root.innerHTML = '<main class="screen splash"><span class="avatar"><img src="assets/av_aslan.jpg" alt=""></span><p>Yükleniyor…</p></main>';
    return;
  }
  if (!bootClosed) {
    if (!bootTimeUp) return;
    bootClosed = true;
    const boot = root.querySelector('.boot');
    if (boot) {
      boot.classList.add('is-out');
      setTimeout(route, 300);
      return;
    }
  }
  if (location.hash !== hash) history.replaceState(null, '', hash);
  const gorev = hash.match(/^#\/gorev\/(.+)$/);
  if (gorev) renderGorev(root, navigate, decodeURIComponent(gorev[1]));
  else routes[hash](root, navigate, status);
  window.scrollTo(0, 0);
}

const flag = {
  get: () => {
    try {
      return localStorage.getItem(SESSION_FLAG) === '1';
    } catch {
      return false;
    }
  },
  set: (on) => {
    try {
      if (on) localStorage.setItem(SESSION_FLAG, '1');
      else localStorage.removeItem(SESSION_FLAG);
    } catch {}
  },
};

async function onAuth(user) {
  if (!user) {
    stopSync();
    flag.set(false);
    clearFamilyData();
    setBirth(null);
    session = 'out';
    route();
    return;
  }
  flag.set(true);
  const synced = startSync({
    onData: applyRemote,
    seed: localSnapshot,
    onError: async (err) => {
      if (err.code === 'permission-denied') {
        status.loginError = 'Bu hesabın erişim izni yok.';
        const { signOutUser } = await import('./cloud.js');
        await signOutUser();
      }
    },
  });
  // İlk bulut yanıtını en fazla birkaç saniye bekle; gelmezse yerel veriyle devam et.
  await Promise.race([synced, new Promise((r) => setTimeout(r, 6000))]);
  setBirth(getStoredBirth());
  session = 'in';
  route();
}

// Bulut verisi değişince (başka telefon yazdı) açık ekranı tazele; yazarken/panel açıkken dokunma.
window.addEventListener('aslan:data', () => {
  const had = hasBirth();
  setBirth(getStoredBirth());
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
  const safe = !document.body.classList.contains('sheet-open') && !typing;
  if (!had && hasBirth()) route();
  else if (safe && ['#/bugun', '#/gelisim'].includes(location.hash)) route();
});

window.addEventListener('hashchange', route);

async function boot() {
  setBirth(getStoredBirth());
  route();
  try {
    await watchAuth(onAuth);
  } catch {
    // SDK yüklenemedi (çevrimdışı): daha önce giriş yapılmış ve veri varsa yerel verile devam et.
    session = flag.get() && hasBirth() ? 'in' : 'out';
    route();
  }
}
boot();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
