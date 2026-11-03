import { SOURCE_GROUPS } from '../data/sources.js';
import { tabbar } from '../nav.js';

const OUT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
const INFO = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B5112" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>';

export function render(root) {
  root.innerHTML = `
    <main class="screen kaynaklar">
      <header class="kay-head">
        <span class="eyebrow">KAYNAKLAR</span>
        <h1>Her öneri<br>nereden geliyor?</h1>
        <p>Görevler yapay zekânın hafızasından değil, bu kurumların yayınlarından seçilir ve kartın altında kaynağı yazar. Kaynak etiketi “Plan” olan kartlar bu uygulamanın planındaki maddelerdir; planda o madde için ayrı bir kurum etiketi yoktur.</p>
      </header>

      <section class="source-list">
        ${SOURCE_GROUPS.map(
          (g) => `
          <div class="source">
            <span class="badge" style="background:${g.bg};color:${g.fg}">${g.badge}</span>
            <div>
              <span class="source-name">${g.name}</span>
              <span class="source-desc">${g.desc}</span>
              <ul>
                ${g.links
                  .map(([title, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${title}${OUT}<span class="sr-only"> (yeni sekmede açılır)</span></a></li>`)
                  .join('')}
              </ul>
            </div>
          </div>`
        ).join('')}
      </section>

      <section class="honest">
        <span class="eyebrow eyebrow--light">ÇİFT DİL HAKKINDA DÜRÜST NOTLAR</span>
        <p>2023 tarihli bir deneysel çalışma, “bir kişi, bir dil” yönteminin öğrenmeye ek fayda sağladığına dair destek bulamadı. Asıl zarar, cümle ortasında öngörülemeyen dil değişimlerinden geliyor (JSLHR, 2023).</p>
        <p>İki dil birbirinden bağımsız gelişir ve her dilin gelişimi o dilde duyulan girdinin kalitesine bağlıdır (FAU).</p>
        <p>“Günde kesin şu kadar dakika” gibi bir formül yok; uygulamadaki süreler hedef değil, yön göstericidir.</p>
      </section>

      <section class="disclaimer">
        ${INFO}
        <span>Bu uygulama tanı koymaz ve tıbbi tavsiye yerine geçmez. Sağlık ve gelişimle ilgili kararlarda çocuk doktoruna danışın.</span>
      </section>

      ${tabbar('#/kaynaklar')}
    </main>`;
}
