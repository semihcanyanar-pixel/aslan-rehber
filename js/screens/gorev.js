import { TASKS } from '../data/tasks.js';
import { PACKS } from '../data/phrases.js';
import { videoFor, watchUrl, embedUrl } from '../data/videos.js';
import { getProfile, getLevels, getDone, toggleDone, dateKey } from '../state.js';
import { pickDay } from '../logic/pick.js';
import { CATEGORY, IMAGES, IMAGE_ALT, categoryIcon } from '../categories.js';
import { openCoach, coachIcon, phraseListHtml, bindListen, stopSpeaking } from '../coach.js';

const BACK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F2B26" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
const CHECK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5E7E6B" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
const PLAY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>';

// Resimli (tummy time) görevler için "söyleyeceğin cümle": baba İngilizce, anne Türkçe.
const ANNE_PHRASE = '“Aferin oğluma, ne güçlüsün!”';

const SAFETY_TUMMY =
  'Tummy time yalnızca bebek uyanıkken ve yakın gözetim altındayken yapılır. Sen uykuya dalıyorsan hemen bitir. Uyku her zaman sırtüstüdür; karnüstü bir uyku pozisyonu değildir. Kaynak: AAP';

export function render(root, navigate, id) {
  const task = TASKS.find((t) => t.id === id);
  if (!task) return navigate('#/bugun');

  const me = getProfile() ?? 'baba';
  const cat = CATEGORY[task.category];
  const key = dateKey();
  const video = videoFor(id);
  const inToday = pickDay({ date: new Date(), parent: me, levels: getLevels() })
    .flatMap((s) => s.cards)
    .some((c) => c.task.id === id);
  let view = me;

  // Süre sayacı: ekran yeniden çizilse de sayaç durumu burada kalır; ekrandan çıkılınca kendini durdurur.
  let elapsed = 0;
  let startedAt = 0;
  let running = false;
  let ticker = null;
  const seconds = () => elapsed + (running ? (Date.now() - startedAt) / 1000 : 0);
  const paintTimer = () => {
    const el = root.querySelector('[data-time]');
    if (!el) {
      clearInterval(ticker);
      ticker = null;
      running = false;
      return;
    }
    const s = Math.floor(seconds());
    el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    root.querySelector('[data-fill]').style.width = `${Math.min(s / 300, 1) * 100}%`;
    root.querySelector('[data-timer-toggle]').textContent = running ? 'Duraklat' : s > 0 ? 'Devam' : 'Başlat';
  };
  const bindTimer = () => {
    paintTimer();
    root.querySelector('[data-timer-toggle]').addEventListener('click', () => {
      if (running) {
        elapsed = seconds();
        running = false;
      } else {
        startedAt = Date.now();
        running = true;
        ticker ??= setInterval(paintTimer, 250);
      }
      paintTimer();
    });
    root.querySelector('[data-timer-reset]').addEventListener('click', () => {
      elapsed = 0;
      running = false;
      paintTimer();
    });
  };

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
          ${
            image
              ? `<div class="hero-art"><img src="${image}" alt="${IMAGE_ALT[task.image][view]}"></div>`
              : `<span class="hero-icon">${categoryIcon(cat, 56)}</span>`
          }
          <a class="hero-back" href="#/bugun" aria-label="Geri">${BACK}</a>
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
            video
              ? `<section class="howto" aria-label="Nasıl yapılır">
                   <div class="howto-head"><span class="howto-title">Nasıl yapılır?</span><span class="chip">Video: ${video.org}</span></div>
                   <p class="howto-note">Videoyu önce sen izle, sonra Aslan'la yap. Aslan ekrana bakmasın; 1 yaşından küçüklere ekran önerilmez (WHO).</p>
                   <div class="howto-frame" data-video-frame>
                     <button class="howto-load" data-video-load>${PLAY}<span>Videoyu göster</span></button>
                   </div>
                   <p class="howto-small">${video.title}. Video YouTube'dan yüklenir, internet ister; örnek amaçlıdır. Aslan'ın hâli ve doktorunun önerisi önce gelir. <a href="${watchUrl(video.id)}" target="_blank" rel="noopener noreferrer">YouTube'da aç</a></p>
                 </section>`
              : ''
          }

          ${
            task.steps
              ? `<ol class="steps">${task.steps.map((s, i) => `<li><span class="step-n">${i + 1}</span><span>${s}</span></li>`).join('')}</ol>`
              : ''
          }

          ${
            task.timer
              ? `<section class="timer" aria-label="Süre sayacı">
                   <div class="timer-top"><span class="timer-time" data-time>0:00</span><span class="timer-ref">3–5 dakikayla başla (AAP)</span></div>
                   <div class="timer-bar"><div class="timer-fill" data-fill></div><span class="timer-mark" title="3 dakika"></span></div>
                   <div class="timer-actions"><button class="timer-btn" data-timer-toggle>Başlat</button><button class="timer-btn timer-btn--ghost" data-timer-reset>Sıfırla</button></div>
                   <p class="timer-note">Bu bir hedef değil: Aslan huysuzlanırsa süre dolmadan bırak.</p>
                 </section>`
              : ''
          }

          ${
            task.image
              ? `<div class="segment segment--2" role="tablist" aria-label="Kim yapıyor">
                   <button role="tab" data-view="baba" aria-selected="${view === 'baba'}">Baba</button>
                   <button role="tab" data-view="anne" aria-selected="${view === 'anne'}">Anne</button>
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

    if (task.timer) bindTimer();
    // Video, "Videoyu göster"e basılana kadar yüklenmez (Google'a istek gitmez); gizlilik modlu oynatıcı.
    root.querySelector('[data-video-load]')?.addEventListener('click', () => {
      root.querySelector('[data-video-frame]').innerHTML = `<iframe src="${embedUrl(video.id)}" title="${video.title}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
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
