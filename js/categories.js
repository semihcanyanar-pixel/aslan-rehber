export const CATEGORY = {
  duygusal: { label: 'Duygusal', bg: 'var(--tag-duygusal-bg)', fg: '#C46A44', stroke: false, path: 'M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z' },
  hareket: { label: 'Fiziksel', bg: 'var(--tag-hareket-bg)', fg: '#4C6A58', stroke: true, path: 'M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12' },
  dil: { label: 'Dil', bg: 'var(--tag-dil-bg)', fg: '#4E6A99', stroke: true, path: 'M4 5h16v11H9l-5 4z' },
  bilissel: { label: 'Bilişsel', bg: 'var(--tag-bilissel-bg)', fg: '#8C6A1E', stroke: true, path: 'M4 5c3-1 6 0 8 2 2-2 5-3 8-2v13c-3-1-6 0-8 2-2-2-5-3-8-2z' },
};

// gogus: ebeveynin göğsünde tummy time · yer: düz zeminde, mat üzerinde tummy time
export const IMAGES = {
  gogus: { baba: 'assets/baba.jpg', anne: 'assets/anne.jpg' },
  yer: { baba: 'assets/yer-baba.jpg', anne: 'assets/yer-anne.jpg' },
};
// Gerçek hareket için kare dizisi: aynı kadrajdan çekilmiş kareler gelince buraya yaz, ör.
//   gogus: { baba: ['assets/frames/gogus-baba-1.jpg', ...], anne: [...] }
// "Canlandır" kareleri yumuşak geçişle döngüye sokar; kare yoksa yalnızca yavaş yakınlaşma olur.
export const FRAMES = {};

export const IMAGE_ALT = {
  gogus: {
    baba: 'Baba kanepede yarı uzanmış, göğsündeki Aslan başını kaldırmış, yüz yüze bakışıyorlar',
    anne: 'Anne kanepede yarı uzanmış, göğsündeki Aslan başını kaldırmış, gülümseyerek bakışıyorlar',
  },
  yer: {
    baba: 'Baba yerde mat üzerinde yan yatmış, karnüstü yatan Aslan başını kaldırmış, babasına bakıyor; yanlarında oyuncaklar ve harf blokları var',
    anne: 'Anne yerde mat üzerinde diz çökmüş, karnüstü yatan Aslan başını kaldırmış, annesine bakıyor; arkada ayna ve ayıcık var',
  },
};

export function categoryIcon(cat, size = 16) {
  const attrs = cat.stroke ? `fill="none" stroke="${cat.fg}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"` : `fill="${cat.fg}"`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${attrs} aria-hidden="true"><path d="${cat.path}"/></svg>`;
}
