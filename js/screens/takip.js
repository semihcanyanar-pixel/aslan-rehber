import { getProfile, getDone, getLevels } from '../state.js';
import { getBirthISO } from '../logic/period.js';
import { daySeries, groupSeries, summary } from '../logic/stats.js';
import { CATEGORY } from '../categories.js';
import { tabbar } from '../nav.js';

const pct = (r) => `%${Math.round(r * 100)}`;
const fmt = (d, o) => d.toLocaleDateString('tr-TR', o);
const MODES = [
  ['gun', 'Günlük'],
  ['hafta', 'Haftalık'],
  ['ay', 'Aylık'],
];

export function render(root) {
  const me = getProfile() ?? 'baba';
  let scope = 'aile';
  let mode = 'gun';
  let picked = null;

  const draw = () => {
    const days = daySeries({ birthISO: getBirthISO(), scope, levels: getLevels(), getDone });
    const s = summary(days);
    const items = mode === 'gun' ? days : groupSeries(days, mode);
    if (picked === null || picked >= items.length) picked = items.length - 1;

    const label = (it) => (mode === 'gun' ? fmt(it.date, { day: 'numeric', month: 'short' }) : mode === 'hafta' ? fmt(it.start, { day: 'numeric', month: 'short' }) : fmt(it.start, { month: 'long', year: '2-digit' }));
    const short = (it) => (mode === 'gun' ? fmt(it.date, { day: 'numeric' }) : label(it));
    const isLast = (i) => i === items.length - 1;
    const detail = (it, i) => {
      const when = mode === 'gun' ? fmt(it.date, { day: 'numeric', month: 'long', weekday: 'long' }) : mode === 'hafta' ? `${fmt(it.start, { day: 'numeric', month: 'long' })} haftası` : fmt(it.start, { month: 'long', year: 'numeric' });
      const part = isLast(i) && mode !== 'gun' ? ' (süren dönem)' : isLast(i) ? ' (bugün, devam ediyor)' : '';
      return `${when}${part}: ${it.done}/${it.planned} görev, ${pct(it.rate)}`;
    };

    root.innerHTML = `
      <main class="screen takip" data-mode="${mode}">
        <header class="tk-head">
          <span class="eyebrow">TAKİP</span>
          <h1>Plana ne kadar<br>sadık kaldık?</h1>
        </header>

        ${
          s
            ? `
        <div class="seg" role="tablist" aria-label="Kimin planı">
          <button role="tab" data-scope="aile" aria-selected="${scope === 'aile'}">Aile</button>
          <button role="tab" data-scope="${me}" aria-selected="${scope === me}">Yalnızca ben</button>
        </div>

        <section class="tk-cards" aria-label="Özet">
          <div class="tk-card"><b>${pct(s.today.rate)}</b><span>Bugün · ${s.today.done}/${s.today.planned}</span></div>
          <div class="tk-card"><b>${pct(s.week.rate)}</b><span>Bu hafta · ${s.week.done}/${s.week.planned}</span></div>
          <div class="tk-card"><b>${pct(s.month.rate)}</b><span>Bu ay · ${s.month.done}/${s.month.planned}</span></div>
          <div class="tk-card"><b>${pct(s.total.rate)}</b><span>Başlangıçtan beri · ${s.total.done}/${s.total.planned}</span></div>
        </section>

        <div class="seg" role="tablist" aria-label="Grafik aralığı">
          ${MODES.map(([k, t]) => `<button role="tab" data-mode="${k}" aria-selected="${k === mode}">${t}</button>`).join('')}
        </div>

        <section class="tk-chart" aria-label="Tamamlama grafiği">
          <div class="tk-axis" aria-hidden="true"><span>%100</span><span>%50</span><span>%0</span></div>
          <div class="tk-scroll" id="tkScroll" tabindex="0">
            <div class="tk-bars">
              ${items
                .map((it, i) => {
                  const h = Math.max(it.rate * 100, it.planned ? 2 : 0);
                  return `<button class="tk-col${i === picked ? ' is-picked' : ''}${isLast(i) ? ' is-now' : ''}" data-i="${i}" aria-label="${detail(it, i)}">
                    <span class="tk-val">${it.planned && it.done ? Math.round(it.rate * 100) : ''}</span>
                    <span class="tk-track"><span class="tk-bar" style="height:${h}%"></span></span>
                    <span class="tk-lab">${short(it)}</span>
                  </button>`;
                })
                .join('')}
            </div>
          </div>
        </section>
        <p class="tk-detail" role="status">${detail(items[picked], picked)}</p>
        <p class="tk-hint">Grafiği sağa sola kaydır; bir sütuna dokununca ayrıntısı görünür.</p>

        <section class="tk-stats">
          <h2>Öne çıkanlar</h2>
          <ul>
            <li><b>${s.streak} gün</b> üst üste en az bir görev yapıldı.</li>
            <li><b>${s.faithfulDays}/${s.pastDays}</b> geçmiş günde plana %70 ve üzeri uyuldu.</li>
            ${s.best ? `<li>En iyi gün: <b>${fmt(s.best.date, { day: 'numeric', month: 'long' })}</b> (${pct(s.best.rate)}).</li>` : ''}
          </ul>
          <h2>Son 30 gün, kategori bazında</h2>
          <div class="tk-cats">
            ${['hareket', 'bilissel', 'dil', 'duygusal']
              .map((c) => {
                const v = s.categories[c];
                const cat = CATEGORY[c];
                return `<div class="tk-cat"><span class="chip" style="background:${cat.bg};color:${cat.fg}">${cat.label}</span><div class="tk-cat-bar"><span style="width:${Math.round(v.rate * 100)}%"></span></div><b>${v.planned ? pct(v.rate) : '-'}</b></div>`;
              })
              .join('')}
          </div>
        </section>
        <p class="tk-note">Oran = yapılan görev / planlanan görev. Plan, şu anki seviye ayarlarına göre hesaplanır; seviyeyi sonradan değiştirdiysen geçmiş günlerin oranı da buna göre yeniden hesaplanır. Bu bir not değil bir gözlemdir: hedef kovalamak için değil, ritmi görmek için.</p>`
            : '<p class="tk-note">Henüz veri yok.</p>'
        }

        ${tabbar('#/takip')}
      </main>`;

    root.querySelectorAll('[data-scope]').forEach((b) => b.addEventListener('click', () => ((scope = b.dataset.scope), (picked = null), draw())));
    root.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => ((mode = b.dataset.mode), (picked = null), draw())));
    root.querySelectorAll('[data-i]').forEach((b) =>
      b.addEventListener('click', () => {
        picked = Number(b.dataset.i);
        const keep = root.querySelector('#tkScroll').scrollLeft;
        draw();
        root.querySelector('#tkScroll').scrollLeft = keep;
      })
    );
    const sc = root.querySelector('#tkScroll');
    if (sc) sc.scrollLeft = sc.scrollWidth; // en yeni gün sağda
  };

  draw();
}
