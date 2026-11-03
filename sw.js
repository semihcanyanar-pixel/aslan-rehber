const CACHE = 'aslan-v2';
const SHELL = [
  './',
  'js/cloud.js',
  'js/firebase-config.js',
  'js/logic/sync.js',
  'js/screens/giris.js',
  'js/screens/kurulum.js',
  'index.html',
  'manifest.webmanifest',
  'css/tokens.css',
  'css/fonts.css',
  'fonts/nunito-latin.woff2',
  'fonts/nunito-latin-ext.woff2',
  'css/app.css',
  'js/app.js',
  'js/state.js',
  'js/screens/profil.js',
  'js/screens/bugun.js',
  'js/screens/ayarlar.js',
  'js/logic/period.js',
  'js/logic/pick.js',
  'js/data/tasks.js',
  'js/data/phrases.js',
  'js/coach.js',
  'js/nav.js',
  'js/sheet.js',
  'js/data/sources.js',
  'js/screens/kaynaklar.js',
  'js/data/milestones.js',
  'js/screens/gelisim.js',
  'js/categories.js',
  'js/screens/gorev.js',
  'js/data/audio-list.js',
  'js/screens/ingilizce.js',
  'js/audio.js',
  'assets/baba.jpg',
  'assets/koc.png',
  'assets/koc-dinleyen.png',
  'assets/koc-mutlu.png',
  'assets/koc-tesvik.png',
  'assets/anne.jpg',
  'assets/av_aslan.jpg',
  'assets/av_anne.jpg',
  'assets/av_baba.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Önce ağ, olmazsa önbellek: güncellemeler hemen görünür, çevrimdışı da açılır.
// Kendi dosyalarımız ve Firebase kitaplığı (sabit sürüm, gstatic) önbelleğe alınır; Firestore/Auth ağ istekleri geçer.
const cacheable = (url) => url.origin === location.origin || (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'));

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !cacheable(new URL(e.request.url))) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
