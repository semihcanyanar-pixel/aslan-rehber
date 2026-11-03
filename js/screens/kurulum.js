import { saveBirth } from '../state.js';
import { setBirth } from '../logic/period.js';

export function render(root, navigate) {
  const today = new Date().toISOString().slice(0, 10);
  root.innerHTML = `
    <main class="screen giris">
      <div class="giris-head">
        <span class="avatar"><img src="assets/av_aslan.jpg" alt="Aslan"></span>
        <h1>Aslan'ın doğum tarihi</h1>
        <p>Görevler Aslan'ın yaşına göre seçilir. Bu bilgi yalnızca aile verinde saklanır; bir kez girmen yeter.</p>
      </div>
      <form class="note-form giris-form" novalidate>
        <label>Doğum tarihi<input name="birth" type="date" max="${today}" required></label>
        <p class="form-error" role="alert" hidden></p>
        <button class="btn-primary" type="submit">Kaydet ve devam et</button>
      </form>
    </main>`;

  const form = root.querySelector('form');
  const error = root.querySelector('.form-error');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const iso = form.elements.birth.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || iso > today) {
      error.textContent = 'Geçerli bir doğum tarihi seç.';
      error.hidden = false;
      return;
    }
    saveBirth(iso);
    setBirth(iso);
    navigate('#/profil');
  });
}
