import { packFor } from './data/phrases.js';
import { speak, stopSpeaking } from './audio.js';
import { openSheet } from './sheet.js';

const COACH_IMAGE = 'assets/koc.png';
const COACH_LISTENING_IMAGE = 'assets/koc-dinleyen.png';
export const COACH_NAME = 'Ellie';

const BUBBLE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/></svg>';
const SPEAKER = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F2B26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9z"/><path d="M17 9a4 4 0 0 1 0 6"/></svg>';
const CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

export const coachIcon = () => (COACH_IMAGE ? `<img src="${COACH_IMAGE}" alt="">` : BUBBLE);
export const coachListeningImage = () => COACH_LISTENING_IMAGE;
export const coachTitle = () => `${COACH_NAME ? COACH_NAME + ' · ' : ''}İngilizce koç`;

export function phraseListHtml(phrases) {
  return `<div class="phrases">${phrases
    .map(
      (p) => `
      <article class="phrase">
        <div>
          <span class="en">${p.en}</span>
          <span class="ipa">${p.ipa}</span>
          <span class="tr">${p.tr}</span>
        </div>
        <button class="listen" data-phrase="${p.id}" aria-label="Dinle: ${p.en}">${SPEAKER}</button>
      </article>`
    )
    .join('')}</div>
    <p class="coach-status" role="status" hidden>Bu cihazda sesli okuma kullanılamıyor.</p>`;
}

export function bindListen(container, phrases) {
  container.querySelectorAll('.listen').forEach((b) =>
    b.addEventListener('click', () => {
      const phrase = phrases.find((p) => p.id === b.dataset.phrase);
      container.querySelector('.coach-status').hidden = speak(phrase);
    })
  );
}

export { stopSpeaking };

export function openCoach(task, opener) {
  const pack = packFor(task);
  const html = `
      <header class="coach-head">
        <span class="coach-avatar">${coachIcon()}</span>
        <div><h2 id="coach-title">${coachTitle()}</h2><p>${task.title}</p></div>
        <button class="sheet-close" data-close aria-label="Kapat">${CLOSE}</button>
      </header>
      <p class="coach-intro">Bu bir görev değil, isteğe bağlı bir yardım. Bu aktiviteyi İngilizce anlatmak istersen şu cümleler işine yarar. Aktiviteyi baştan sona tek dilde yap; dilleri cümle ortasında karıştırma.</p>
      ${phraseListHtml(pack.phrases)}
      <div class="coach-tip"><img src="${COACH_LISTENING_IMAGE}" alt=""><p>${pack.tip}</p></div>
      <p class="coach-note">Kaynak: plan (Harvard, servis-dönüş). Cümleler ve telaffuz yazımı (IPA, Amerikan aksanı) taslaktır, henüz doğrulanmadı.</p>
  `;

  const { el } = openSheet(html, { opener, labelledBy: 'coach-title', onClose: stopSpeaking });
  bindListen(el, pack.phrases);
}
