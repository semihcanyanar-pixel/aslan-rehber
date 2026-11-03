import { getProfile, setProfile } from '../state.js';

const TEXT = {
  anne: {
    summary: 'Anne · yalnızca Türkçe görevler',
    cta: 'Anne olarak devam et',
  },
  baba: {
    summary: 'Baba · İngilizce ve Türkçe görevler',
    cta: 'Baba olarak devam et',
  },
};

export function render(root, navigate) {
  let who = getProfile() ?? 'baba';

  root.innerHTML = `
    <main class="screen profil">
      <div class="profil-head">
        <div class="avatar"><img src="assets/av_aslan.jpg" alt="Aslan"></div>
        <h1>Benimle kim<br>vakit geçirecek?</h1>
      </div>

      <div class="profil-cards">
        <button class="profil-card profil-card--anne" data-who="anne">
          <span class="avatar"><img src="assets/av_anne.jpg" alt=""></span>
          <span class="name">Anne</span>
          <span class="desc">Türkçe rutinler, ninniler ve bağ kurma aktiviteleri. İngilizce görev almaz.</span>
          <span class="pill">Türkçe</span>
        </button>
        <button class="profil-card profil-card--baba" data-who="baba">
          <span class="avatar"><img src="assets/av_baba.jpg" alt=""></span>
          <span class="name">Baba</span>
          <span class="desc">Tüm İngilizce görevler; Türkçe, fiziksel ve oyun aktiviteleri de</span>
          <span class="pill">English + Türkçe</span>
        </button>
      </div>

      <div class="profil-summary">
        <span class="label">Bu cihazda</span>
        <span class="value" data-summary></span>
        <span class="summary-note">Görev kartlarında ve görsellerde <span data-who-label></span> görünür.</span>
      </div>

      <button class="btn-primary" data-cta></button>
    </main>`;

  const cards = root.querySelectorAll('.profil-card');
  const update = () => {
    cards.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.who === who)));
    root.querySelector('[data-summary]').textContent = TEXT[who].summary;
    root.querySelector('[data-who-label]').textContent = who;
    root.querySelector('[data-cta]').textContent = TEXT[who].cta;
  };

  cards.forEach((c) =>
    c.addEventListener('click', () => {
      who = c.dataset.who;
      update();
    })
  );
  root.querySelector('[data-cta]').addEventListener('click', () => {
    setProfile(who);
    navigate('#/bugun');
  });

  update();
}
