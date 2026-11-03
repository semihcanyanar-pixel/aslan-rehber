import { getProfile, setProfile } from '../state.js';

const CTA = {
  anne: 'Anne olarak devam et',
  baba: 'Baba olarak devam et',
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
          <span class="desc">Rutinler, ninniler ve bağ kurma aktiviteleri</span>
        </button>
        <button class="profil-card profil-card--baba" data-who="baba">
          <span class="avatar"><img src="assets/av_baba.jpg" alt=""></span>
          <span class="name">Baba</span>
          <span class="desc">Rutinler, fiziksel ve oyun aktiviteleri</span>
        </button>
      </div>

      <button class="btn-primary" data-cta></button>
    </main>`;

  const cards = root.querySelectorAll('.profil-card');
  const update = () => {
    cards.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.who === who)));
    root.querySelector('[data-cta]').textContent = CTA[who];
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
