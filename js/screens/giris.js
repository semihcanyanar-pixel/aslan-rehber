import { signIn, describeAuthError, sendPasswordReset, describePasswordError } from '../cloud.js';

export function render(root, navigate, status = {}) {
  root.innerHTML = `
    <main class="screen giris">
      <div class="giris-head">
        <span class="avatar"><img src="assets/av_aslan.jpg" alt="Aslan"></span>
        <h1>Aslan Gelişim Rehberi</h1>
        <p>Anne ya da baba hesabınla giriş yap. Bir kez girdikten sonra bu cihazda hatırlanır.</p>
      </div>
      <form class="note-form giris-form" novalidate>
        <label>E-posta<input name="email" type="email" inputmode="email" autocomplete="username" autocapitalize="none" required></label>
        <label>Şifre<input name="password" type="password" autocomplete="current-password" required></label>
        <p class="form-error" role="alert" ${status.loginError ? '' : 'hidden'}>${status.loginError ?? ''}</p>
        <p class="form-ok" role="status" hidden></p>
        <button class="btn-primary" type="submit">Giriş yap</button>
        <button class="btn-link" type="button" data-forgot>Şifremi unuttum</button>
      </form>
    </main>`;
  status.loginError = null;

  const form = root.querySelector('form');
  const error = root.querySelector('.form-error');
  const button = root.querySelector('button[type=submit]');

  const ok = root.querySelector('.form-ok');
  const forgot = root.querySelector('[data-forgot]');
  forgot.addEventListener('click', async () => {
    const email = form.elements.email.value.trim();
    ok.hidden = true;
    if (!email) {
      error.textContent = 'Önce e-posta adresini yaz, sonra "Şifremi unuttum"a dokun.';
      error.hidden = false;
      return;
    }
    error.hidden = true;
    forgot.disabled = true;
    try {
      await sendPasswordReset(email);
      ok.textContent = 'Bu e-posta bir hesaba aitse sıfırlama bağlantısı gönderildi. Gelen kutunu ve spam klasörünü kontrol et.';
      ok.hidden = false;
    } catch (err) {
      error.textContent = describePasswordError(err);
      error.hidden = false;
    }
    forgot.disabled = false;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    if (!email || !password) {
      error.textContent = 'E-posta ve şifreyi yaz.';
      error.hidden = false;
      return;
    }
    button.disabled = true;
    button.textContent = 'Giriş yapılıyor…';
    error.hidden = true;
    try {
      await signIn(email, password);
      // Başarılıysa oturum değişimi uygulamayı otomatik yönlendirir.
    } catch (err) {
      error.textContent = describeAuthError(err);
      error.hidden = false;
      button.disabled = false;
      button.textContent = 'Giriş yap';
    }
  });
}
