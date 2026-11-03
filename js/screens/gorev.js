import { TASKS } from '../data/tasks.js';
import { PACKS } from '../data/phrases.js';
import { getProfile, getLevels, getDone, toggleDone, dateKey } from '../state.js';
import { pickDay } from '../logic/pick.js';
import { CATEGORY, IMAGES, IMAGE_ALT, categoryIcon } from '../categories.js';
import { openCoach, coachIcon, phraseListHtml, bindListen, stopSpeaking } from '../coach.js';

const HEART = 'M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z';
const BACK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F2B26" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
const CHECK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5E7E6B" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';

// Resimli (göğüste) görevler için balon ve cümle; baba İngilizce, anne Türkçe.
const BUBBLE = { baba: 'Look at you!', anne: 'Aferin oğluma!' };
const ANNE_PHRASE = '“Aferin oğluma, ne güçlüsün!”';

const SAFETY_TUMMY =
  'Tummy time yalnızca bebek uyanıkken ve yakın gözetim altındayken yapılır. Sen uykuya dalıyorsan hemen bitir. Uyku her zaman sırtüstüdür; karnüstü bir uyku pozisyonu değildir. Kaynak: AAP';

export function render(root, navigate, id) {
  const task = TASKS.find((t) => t.id === id);
  if (!task) return navigate('#/bugun');

  const me = getProfile() ?? 'baba';
  const cat = CATEGORY[task.category];
  const key = dateKey();
  const inToday = pickDay({ date: new Date(), parent: me, levels: getLevels() })
    .flatMap((s) => s.cards)
    .some((c) => c.task.id === id);
  let view = me;
  let playing = false;

  const draw = () => {
    stopSpeaking();
    const done = getDone(key).includes(id);
    const image = task.image && IMAGES[task.image]?.[view];
    const sources = task.source.length ? task.source : ['Plan'];
    const babaNote = me === 'baba' && task.babaNote ? `<p class="task-note">${task.babaNote}</p>` : '';
    const phrase = PACKS.tummy.phrases[1];

    root.innerHTML = `
      <main class="screen gorev">
        <div class="hero${image ? '' : ' hero--plain'}" style="${image ? '' : `background:${cat.bg}`}">
          ${image ? `<img src="${image}" alt="${IMAGE_ALT[view]}" class="${playing ? 'live' : 'still'}">` : `<span class="hero-icon">${categoryIcon(cat, 56)}</span>`}
          ${
            image && playing
              ? `<span class="pop">${BUBBLE[view]}</span>
                 <svg class="h1" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="${HEART}" fill="#E07B57"/></svg>
                 <svg class="h2" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="${HEART}" fill="#E3A774"/></svg>`
              : ''
          }
          <a class="hero-back" href="#/bugun" aria-label="Geri">${BACK}</a>
          ${image ? `<button class="play-btn" data-play aria-pressed="${playing}">${playing ? 'Durdur' : 'Canlandır'}</button>` : ''}
        </div>

        <div class="panel">
          <div class="panel-head">
            <h1>${task.title}</h1>
            <div class="chips">
              <span class="chip" style="background:${cat.bg}">${cat.label}${task.lang === 'en' ? ' · EN' : ''}</span>
              ${sources.map((s) => `<span class="chip">${s}</span>`).join('')}
            </div>
            <p class="panel-desc">${task.description}</p>
            ${babaNote}
          </div>

          ${
            task.image
              ? `<div class="segment segment--2" role="tablist" aria-label="Kim yapıyor">
                   <button role="tab" data-view="baba" aria-selected="${view === 'baba'}">Baba · English</button>
                   <button role="tab" data-view="anne" aria-selected="${view === 'anne'}">Anne · Türkçe</button>
                 </div>
                 <section class="say-box">
                   <span class="say-label">Söyleyeceğin cümle</span>
                   ${view === 'baba' ? phraseListHtml([phrase]) : `<span class="say-text">${ANNE_PHRASE}</span>`}
                 </section>`
              : ''
          }

          <button class="coach-link" data-coach><span class="coach-avatar">${coachIcon()}</span>Ellie ile İngilizce anlat</button>

          ${
            inToday
              ? `<button class="btn-primary done-btn${done ? ' is-done' : ''}" data-done>${done ? 'Tamamlandı · geri al' : 'Tamamla'}<span>${CHECK}</span></button>`
              : ''
          }

          ${/tummy/i.test(task.title) ? `<div class="safety-note"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A4512C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg><span>${SAFETY_TUMMY}</span></div>` : ''}
        </div>
      </main>`;

    root.querySelector('[data-play]')?.addEventListener('click', () => {
      playing = !playing;
      draw();
    });
    root.querySelectorAll('[data-view]').forEach((b) =>
      b.addEventListener('click', () => {
        view = b.dataset.view;
        draw();
      })
    );
    root.querySelector('[data-coach]').addEventListener('click', (e) => openCoach(task, e.currentTarget));
    root.querySelector('[data-done]')?.addEventListener('click', () => {
      const nowDone = toggleDone(key, id).includes(id);
      if (nowDone) navigate('#/bugun');
      else draw();
    });
    if (view === 'baba' && task.image) bindListen(root, [phrase]);
  };

  draw();
}
