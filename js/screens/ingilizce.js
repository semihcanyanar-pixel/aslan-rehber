import { PACKS } from '../data/phrases.js';
import { phraseListHtml, bindListen, stopSpeaking, coachIcon, coachListeningImage, coachTitle } from '../coach.js';
import { tabbar } from '../nav.js';

const rhyme = PACKS.sarki.phrases[0];
const CATEGORIES = ['bez', 'banyo', 'uyku', 'beslenme', 'oyun', 'tummy', 'kitap', 'sarki'];

export function render(root) {
  let cat = CATEGORIES[0];

  const draw = () => {
    stopSpeaking();
    const pack = PACKS[cat];
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

        <div class="chips-row" role="tablist" aria-label="Kategori">
          ${CATEGORIES.map((k) => `<button role="tab" data-cat="${k}" aria-selected="${k === cat}">${PACKS[k].title}</button>`).join('')}
        </div>

        ${phraseListHtml(pack.phrases)}

        <div class="coach-tip"><img src="${coachListeningImage()}" alt=""><div><span class="eyebrow eyebrow--light">NASIL KONUŞMALI</span><p>${pack.tip}</p></div></div>
        <section class="rhyme">
          <span class="eyebrow">TEKERLEME ÖNERİSİ</span>
          ${phraseListHtml([rhyme])}
          <p class="rhyme-note">Uyku öncesi, sakin tempoda söyle.</p>
        </section>
        <p class="coach-note">Kaynak: plan (Harvard, servis-dönüş). Cümleler ve telaffuz yazımı (IPA, Amerikan aksanı) taslaktır, henüz doğrulanmadı.</p>

        ${tabbar('#/ingilizce')}
      </main>`;

    root.querySelectorAll('[data-cat]').forEach((b) =>
      b.addEventListener('click', () => {
        cat = b.dataset.cat;
        draw();
      })
    );
    bindListen(root, [...pack.phrases, rhyme]);
  };

  draw();
}
