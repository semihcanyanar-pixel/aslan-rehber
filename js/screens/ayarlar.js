import { getLevels, setLevels } from '../state.js';
import { PERIODS, currentPeriod } from '../logic/period.js';
import { signOutUser, signedInEmail, changePassword, sendPasswordReset, describePasswordError } from '../cloud.js';
import { openSheet } from '../sheet.js';

const CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

function openPasswordSheet(opener) {
  if (!signedInEmail()) {
    window.alert('Şifreyi değiştirmek için internet bağlantısı ve giriş gerekir.');
    return;
  }
  const { el, close } = openSheet(
    `
    <header class="coach-head">
      <div><h2 id="pw-title">Şifreyi değiştir</h2></div>
      <button class="sheet-close" data-close aria-label="Kapat">${CLOSE}</button>
    </header>
    <form class="note-form" novalidate>
      <label>Mevcut şifre<input name="current" type="password" autocomplete="current-password" required data-autofocus></label>
      <label>Yeni şifre (en az 6 karakter)<input name="next" type="password" autocomplete="new-password" minlength="6" required></label>
      <label>Yeni şifre (tekrar)<input name="again" type="password" autocomplete="new-password" required></label>
      <p class="form-error" role="alert" hidden></p>
      <p class="form-ok" role="status" hidden></p>
      <button class="btn-primary" type="submit">Şifreyi kaydet</button>
      <button class="btn-link" type="button" data-forgot>Şifremi unuttum</button>
    </form>`,
    { opener, labelledBy: 'pw-title' }
  );
  const form = el.querySelector('form');
  const error = el.querySelector('.form-error');
  const ok = el.querySelector('.form-ok');
  const button = form.querySelector('button[type=submit]');
  const fail = (msg) => {
    error.textContent = msg;
    error.hidden = false;
  };

  const forgot = form.querySelector('[data-forgot]');
  forgot.addEventListener('click', async () => {
    error.hidden = true;
    ok.hidden = true;
    forgot.disabled = true;
    try {
      const email = signedInEmail();
      await sendPasswordReset(email);
      ok.textContent = `Sıfırlama bağlantısı ${email} adresine gönderildi. Gelen kutunu ve spam klasörünü kontrol et.`;
      ok.hidden = false;
    } catch (err) {
      fail(describePasswordError(err));
    }
    forgot.disabled = false;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    const { current, next, again } = form.elements;
    if (!current.value || !next.value) return fail('Mevcut ve yeni şifreyi yaz.');
    if (next.value.length < 6) return fail('Yeni şifre en az 6 karakter olmalı.');
    if (next.value !== again.value) return fail('İki yeni şifre aynı değil.');
    if (next.value === current.value) return fail('Yeni şifre mevcut şifreden farklı olmalı.');
    button.disabled = true;
    button.textContent = 'Kaydediliyor…';
    try {
      await changePassword(current.value, next.value);
      form.reset();
      ok.textContent = 'Şifren değişti. Bu cihazda oturum açık kalır.';
      ok.hidden = false;
      button.textContent = 'Tamam';
      button.type = 'button';
      button.disabled = false;
      button.addEventListener('click', close, { once: true });
    } catch (err) {
      fail(describePasswordError(err));
      button.disabled = false;
      button.textContent = 'Şifreyi kaydet';
    }
  });
}

const LEVELS = {
  rahat: {
    name: 'Rahat',
    headline: 'Dilim başına 1 kart',
    detail: 'Dönemin temel maddeleri. Yoğun ya da yorgun günler için; sabah, öğle-ikindi ve akşam dilimlerinde birer kart.',
  },
  dengeli: {
    name: 'Dengeli',
    headline: 'Dilim başına 1–2 kart',
    detail: 'Dönemin tüm maddeleri dönüşümlü gelir. Çoğu aile için önerilen seviye.',
  },
  zengin: {
    name: 'Zengin',
    headline: 'Dilim başına 2–3 kart',
    detail: 'Ek dil, bilişsel ve etkileşim kartları gelir. Aslan ilgiliyse bir üst dönemin dil ve bilişsel maddelerinden biri de karışır. Fiziksel kartlar artmaz.',
  },
};

const PERIOD_LABEL = (p) => p.replace('-', '–') + ' ay';

export function render(root, navigate) {
  const levels = getLevels();
  const now = currentPeriod();

  root.innerHTML = `
    <main class="screen ayarlar">
      <div class="ayarlar-band">
        <a class="back" href="#/bugun" aria-label="Geri">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
        </a>
        <h1>Ayarlar</h1>
      </div>

      <section class="ayarlar-intro">
        <span class="title">Günlük içerik seviyesi</span>
        <span class="text">Her dönem için gün başına kaç kart ve ne kadar çeşit geleceğini seç. Seviye bir hedef değil, öneri sayısıdır; Aslan ilgisizse ya da yorgunsa kartı geç.</span>
      </section>

      <div class="ayarlar-body">
        ${PERIODS.map(
          (p) => `
          <section class="period-card${p === now ? ' is-current' : ''}" data-period="${p}">
            <div class="period-head">
              <span class="period-label">${PERIOD_LABEL(p)}</span>
              ${p === now ? '<span class="pill pill--green">Aslan şu an burada</span>' : ''}
            </div>
            <div class="segment segment--3" role="radiogroup" aria-label="${PERIOD_LABEL(p)} seviyesi">
              ${Object.entries(LEVELS)
                .map(
                  ([key, l]) =>
                    `<button role="radio" data-level="${key}" aria-checked="false">${l.name}</button>`
                )
                .join('')}
            </div>
            <div class="level-info">
              <span class="headline"></span>
              <span class="detail"></span>
            </div>
          </section>`
        ).join('')}

        <section class="note note--sage">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3A5444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/></svg>
          <div>
            <span class="note-title">Fiziksel kartlar her seviyede aynı</span>
            <span class="note-text">Tummy time ve hareket miktarı AAP ve WHO önerisinde kalır: ilk haftalarda günde 2–3 kez 3–5 dakika, 7. haftaya doğru günde toplam 15–30 dakika; henüz hareket etmeyen bebekte gün içine yayılmış en az 30 dakika. Zengin seviye fiziksel gelişimi hızlandırmaz, yalnızca dil, bilişsel ve etkileşim kartlarını artırır.</span>
          </div>
        </section>

        <section class="note note--card">
          <span class="note-title">Bilmen gerekenler</span>
          <span class="note-text">Tüm kartlar kaynaklıdır (WHO, CDC, AAP, Harvard); uygulama içerik uydurmaz. Uygulama tanı koymaz. Gelişimle ilgili içini rahatsız eden bir şey olursa beklemeden çocuk doktoruna danış.</span>
          <span class="note-small">Ayarlar iki profilde ortaktır.</span>
        </section>

        <section class="note note--card">
          <span class="note-title">Hesap</span>
          <span class="note-text" data-email></span>
          <div class="btn-row">
            <button class="btn-ghost" data-password>Şifreyi değiştir</button>
            <button class="btn-ghost" data-logout>Çıkış yap</button>
          </div>
        </section>

        <button class="btn-primary" data-save>Kaydet</button>
      </div>
    </main>`;

  const update = (card) => {
    const level = levels[card.dataset.period];
    card.querySelectorAll('[data-level]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.level === level)));
    card.querySelector('.headline').textContent = LEVELS[level].headline;
    card.querySelector('.detail').textContent = LEVELS[level].detail;
  };

  root.querySelectorAll('.period-card').forEach((card) => {
    update(card);
    card.querySelectorAll('[data-level]').forEach((b) =>
      b.addEventListener('click', () => {
        levels[card.dataset.period] = b.dataset.level;
        update(card);
      })
    );
  });

  root.querySelector('[data-email]').textContent = signedInEmail() ?? 'Çevrimdışı mod: giriş bilgisi şu an doğrulanamıyor.';
  const passwordButton = root.querySelector('[data-password]');
  passwordButton.addEventListener('click', () => openPasswordSheet(passwordButton));
  root.querySelector('[data-logout]').addEventListener('click', async () => {
    if (!window.confirm('Bu cihazdan çıkış yapılsın mı? Verilerin hesabında durur, tekrar girince geri gelir.')) return;
    await signOutUser();
  });

  root.querySelector('[data-save]').addEventListener('click', () => {
    setLevels(levels);
    navigate('#/bugun');
  });
}
