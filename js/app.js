import { getProfile } from './state.js';
import { render as renderProfil } from './screens/profil.js';
import { render as renderBugun } from './screens/bugun.js';
import { render as renderAyarlar } from './screens/ayarlar.js';
import { render as renderIngilizce } from './screens/ingilizce.js';
import { render as renderGorev } from './screens/gorev.js';
import { render as renderGelisim } from './screens/gelisim.js';
import { render as renderKaynaklar } from './screens/kaynaklar.js';

const routes = {
  '#/kaynaklar': renderKaynaklar,
  '#/gelisim': renderGelisim,
  '#/ingilizce': renderIngilizce,
  '#/profil': renderProfil,
  '#/ayarlar': renderAyarlar,
  '#/bugun': renderBugun,
};

const root = document.getElementById('app');

function navigate(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

function route() {
  let hash = location.hash;
  const gorev = hash.match(/^#\/gorev\/(.+)$/);
  if (!gorev && !routes[hash]) hash = getProfile() ? '#/bugun' : '#/profil';
  if (location.hash !== hash) {
    history.replaceState(null, '', hash);
  }
  if (gorev) renderGorev(root, navigate, decodeURIComponent(gorev[1]));
  else routes[hash](root, navigate);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
