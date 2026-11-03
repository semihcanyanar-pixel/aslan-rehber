import { PACKS, catalogFor } from '../data/phrases.js';
import { SONGS, songUrl } from '../data/songs.js';
import { phraseListHtml, bindListen, stopSpeaking, coachIcon, coachListeningImage, coachTitle } from '../coach.js';
import { tabbar } from '../nav.js';
import { currentPeriod } from '../logic/period.js';

const rhyme = PACKS.sarki.phrases[0];
const PERIODS = [
  ['0-3', '0–3 ay'],
  ['4-6', '4–6 ay'],
  ['7-9', '7–9 ay'],
  ['10-12', '10–12 ay'],
];
const OUT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';

export function render(root) {
  let period = currentPeriod();
  let index = 0; // kategori sırası

  const draw = () => {
    stopSpeaking();
    const packs = catalogFor(period);
    if (index >= packs.length) index = 0;
    const pack = packs[index];
    const isSong = pack.title.startsWith('Şarkı');
    root.innerHTML = `
      <main class="screen ingilizce">
        <header class="ing-head">
          <span class="coach-avatar">${coachIcon()}</span>
          <div>
            <span class="eyebrow">${coachTitle().toUpperCase()}</span>
            <h1>Gün boyu<br>ne söyleyebilirim?</h1>
          </div>
        </header>
        <p class="coach-intro">Görev değil, isteğe bağlı bir yardım. Bir aktiviteyi İngilizce yapmaya karar verirsen baştan sona tek dilde yap; dilleri cümle ortasında karıştırma.</p>

        <div class="chips-row" role="tablist" aria-label="Yaş grubu">
          ${PERIODS.map(([k, t]) => `<button role="tab" data-period="${k}" aria-selected="${k === period}">${t}${k === currentPeriod() ? ' · şimdi' : ''}</button>`).join('')}
        </div>
        <div class="chips-row" role="tablist" aria-label="Kategori">
          ${packs.map((p, i) => `<button role="tab" data-cat="${i}" aria-selected="${i === index}">${p.title}</button>`).join('')}
        </div>

        ${phraseListHtml(pack.phrases)}

        <div class="coach-tip"><img src="${coachListeningImage()}" alt=""><div><span class="eyebrow eyebrow--light">NASIL KONUŞMALI</span><p>${pack.tip}</p></div></div>
        ${
          isSong
            ? `<section class="songs">
          <span class="eyebrow">ŞARKI ÖRNEKLERİ · ${PERIODS.find(([k]) => k === period)[1].toUpperCase()}</span>
          <p class="songs-note">Melodiyi önce sen dinle, sonra kendin söyle. Aslan ekrana bakmasın; 1 yaşından küçüklere ekran önerilmez (WHO). Bu bağlantılar bir sağlık kuruluşu kaynağı değil, çocuk şarkısı kanalından örneklerdir.</p>
          <ul>
            ${SONGS[period]
              .map((s) => `<li><a href="${songUrl(s.id)}" target="_blank" rel="noopener noreferrer"><span><b>${s.title}</b><small>${s.note} · ${s.channel}</small></span>${OUT}<span class="sr-only"> (YouTube, yeni sekmede açılır)</span></a></li>`)
              .join('')}
          </ul>
        </section>`
            : ''
        }
        <section class="rhyme">
          <span class="eyebrow">TEKERLEME ÖNERİSİ</span>
          ${phraseListHtml([rhyme])}
          <p class="rhyme-note">Uyku öncesi, sakin tempoda söyle.</p>
        </section>
        <p class="coach-note">Kaynak: plan (Harvard, servis-dönüş). Cümleler ve telaffuz yazımı (IPA, Amerikan aksanı) taslaktır, henüz doğrulanmadı. Cümleler bebeğe söylenen kısa, yavaş ve tekrarlı konuşma içindir; bebeğin yaşına göre sadeleşir ya da genişler.</p>

        ${tabbar('#/ingilizce')}
      </main>`;

    root.querySelectorAll('[data-period]').forEach((b) =>
      b.addEventListener('click', () => {
        period = b.dataset.period;
        draw();
      })
    );
    root.querySelectorAll('[data-cat]').forEach((b) =>
      b.addEventListener('click', () => {
        index = Number(b.dataset.cat);
        draw();
      })
    );
    bindListen(root, [...pack.phrases, rhyme]);
  };

  draw();
}
