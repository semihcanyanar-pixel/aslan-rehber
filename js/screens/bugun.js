import { getProfile, getLevels, getDone, toggleDone, dateKey } from '../state.js';
import { pickDay } from '../logic/pick.js';
import { ageInMonths, getBirthISO } from '../logic/period.js';
import { openCoach, coachIcon } from '../coach.js';
import { tabbar } from '../nav.js';
import { CATEGORY, IMAGES, IMAGE_ALT, categoryIcon } from '../categories.js';

const SLOT_LABEL = { sabah: 'Sabah', ogle: 'Öğle ve ikindi', aksam: 'Akşam' };

const GEAR =
  'M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z';

function currentSlot(now) {
  const h = now.getHours();
  return h < 12 ? 'sabah' : h < 18 ? 'ogle' : 'aksam';
}

function ageText(now) {
  const birth = new Date(getBirthISO() + 'T00:00:00');
  const days = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - birth) / 86400000);
  const m = ageInMonths(now);
  return m === 0 ? `${days} günlük` : `${m}. ay · ${days} günlük`;
}

export function render(root) {
  const who = getProfile() ?? 'baba';
  const now = new Date();
  const date = new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  let day = 'today';

  const draw = () => {
    const scroll = window.scrollY;
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (day === 'today' ? 0 : 1));
    const key = dateKey(target);
    const plan = pickDay({ date: target, parent: who, levels: getLevels() });
    const done = day === 'today' ? getDone(key) : [];
    const all = plan.flatMap((s) => s.cards);
    const slotNow = day === 'today' ? currentSlot(now) : null;
    const nowCard = slotNow ? plan.find((s) => s.slot === slotNow).cards.find((c) => !done.includes(c.task.id)) : null;
    const doneCount = all.filter((c) => done.includes(c.task.id)).length;
    const frac = all.length ? doneCount / all.length : 0;

    const card = ({ task, stretch }) => {
      const cat = CATEGORY[task.category];
      const isDone = done.includes(task.id);
      const isNow = nowCard && nowCard.task.id === task.id;
      const image = task.image && IMAGES[task.image]?.[who];
      const sources = task.source.length ? task.source : ['Plan'];
      const babaNote = who === 'baba' && task.babaNote ? `<p class="task-note">${task.babaNote}</p>` : '';
      const marker = isDone ? 'is-done' : isNow ? 'is-now' : '';
      return `
        <div class="tl-row">
          <div class="tl-rail"><span class="tl-node ${marker}">${isDone ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>' : ''}</span><span class="tl-line"></span></div>
          <article class="task${isNow ? ' task--now' : ''}${isDone ? ' task--done' : ''}">
            <div class="task-head">
              <div>
                ${isNow ? '<span class="now-tag">ŞİMDİ</span>' : ''}
                <h3><a class="task-link" href="#/gorev/${task.id}">${task.title}</a> <span class="cat">(${cat.label}${task.lang === 'en' ? ' · EN' : ''})</span></h3>
              </div>
              <span class="cat-badge" style="background:${cat.bg}"><svg width="16" height="16" viewBox="0 0 24 24" ${cat.stroke ? `fill="none" stroke="${cat.fg}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"` : `fill="${cat.fg}"`} aria-hidden="true"><path d="${cat.path}"/></svg></span>
            </div>
            ${image ? `<a class="task-img-link" href="#/gorev/${task.id}"><img class="task-img" src="${image}" alt="${IMAGE_ALT[who]}"><span class="open-pill">Rehberi aç</span></a>` : ''}
            <p class="task-desc">${task.description}</p>
            ${babaNote}
            <div class="task-foot">
              <div class="chips">${sources.map((s) => `<span class="chip">${s}</span>`).join('')}${stretch ? '<span class="chip chip--next">Bir üst dönemden</span>' : ''}</div>
              <div class="foot-actions">
              <button class="coach-btn" data-coach="${task.id}" aria-label="İngilizce koç: ${task.title}"><span>${coachIcon()}</span></button>
              ${day === 'today' ? `<button class="check${isDone ? ' is-done' : ''}" data-id="${task.id}" aria-pressed="${isDone}" aria-label="${isDone ? 'Tamamlandı, geri al' : 'Tamamla'}: ${task.title}"><span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></span></button>` : ''}
              </div>
            </div>
          </article>
        </div>`;
    };

    root.innerHTML = `
      <main class="screen bugun">
        <div class="bugun-band">
          <span class="date">${date}</span>
          <div class="band-actions">
            <a class="icon-btn" href="#/ayarlar" aria-label="Ayarlar"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="${GEAR}"/></svg></a>
            <a class="avatar" href="#/profil" aria-label="Profil: ${who === 'baba' ? 'Baba' : 'Anne'}"><img src="assets/av_${who}.jpg" alt=""></a>
          </div>
        </div>

        <div class="baby-card">
          <span class="avatar"><img src="assets/av_aslan.jpg" alt="Aslan"></span>
          <div><span class="baby-name">Aslan Bebek</span><span class="baby-age">${ageText(now)}</span></div>
        </div>

        <div class="bugun-content">
          <div class="segment segment--2" role="tablist">
            <button role="tab" data-day="today" aria-selected="${day === 'today'}">Bugün</button>
            <button role="tab" data-day="tomorrow" aria-selected="${day === 'tomorrow'}">Yarın</button>
          </div>

          <div class="timeline">
            ${plan
              .map(
                ({ slot, cards }) => `
              <section aria-label="${SLOT_LABEL[slot]}">
                <h2 class="slot-title${slot === slotNow ? ' is-now' : ''}">${SLOT_LABEL[slot]}</h2>
                ${cards.map(card).join('')}
              </section>`
              )
              .join('')}
          </div>

          <div class="ring-card">
            <svg width="52" height="52" viewBox="0 0 52 52" role="img" aria-label="Bugün ${all.length} görevden ${doneCount}'${doneCount === 1 ? 'i' : 'si'} tamamlandı">
              <circle cx="26" cy="26" r="21" fill="none" stroke="var(--track)" stroke-width="7"/>
              <circle cx="26" cy="26" r="21" fill="none" stroke="var(--peach-accent)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(frac * 131.95).toFixed(1)} 132" transform="rotate(-90 26 26)"/>
            </svg>
            <div><span class="ring-main">${day === 'today' ? 'Bugün' : 'Yarın'}: ${doneCount}/${all.length}</span><span class="ring-sub">${day === 'today' ? 'Tamamlandı' : 'Planlanan kart'}</span></div>
          </div>

          ${tabbar('#/bugun')}
        </div>
      </main>`;

    root.querySelectorAll('[data-day]').forEach((b) =>
      b.addEventListener('click', () => {
        day = b.dataset.day;
        draw();
      })
    );
    root.querySelectorAll('.check').forEach((b) =>
      b.addEventListener('click', () => {
        toggleDone(key, b.dataset.id);
        draw();
      })
    );
    const byId = new Map(all.map((c) => [c.task.id, c.task]));
    root.querySelectorAll('[data-coach]').forEach((b) =>
      b.addEventListener('click', () => openCoach(byId.get(b.dataset.coach), b))
    );
    window.scrollTo(0, scroll);
  };

  draw();
}
