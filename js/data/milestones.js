// CDC gelişim basamakları: docs/plan-0-12-ay.md "Gözlenecek basamaklar" tablolarından.
// Hedef değil, doktorla konuşmak için not tutma listesidir.

export const AREAS = [
  { key: 'sosyal', title: 'Sosyal · Duygusal', cat: 'duygusal' },
  { key: 'dil', title: 'Dil · İletişim', cat: 'dil' },
  { key: 'bilissel', title: 'Bilişsel', cat: 'bilissel' },
  { key: 'hareket', title: 'Hareket', cat: 'hareket' },
];

const RAW = {
  2: {
    sosyal: ['Konuşunca sakinleşir', 'Yüzüne bakar', 'Sana gülümser'],
    dil: ['Ağlama dışında sesler çıkarır', 'Yüksek seslere tepki verir'],
    bilissel: ['Seni gözüyle takip eder', 'Oyuncağa birkaç saniye bakar'],
    hareket: ['Karnüstü başını kaldırır', 'Kol ve bacaklarını oynatır'],
  },
  4: {
    sosyal: ['Dikkat çekmek için kendiliğinden gülümser, kıkırdar'],
    dil: ['“Aaa, ooo” diye agular', 'Sesine cevap verir', 'Başını sese çevirir'],
    bilissel: ['Ellerine ilgiyle bakar', 'Aç olunca ağzını açar'],
    hareket: ['Kucakta başını desteksiz tutar', 'Karnüstü dirseklere yaslanır', 'Oyuncağa kolunu sallar'],
  },
  6: {
    sosyal: ['Tanıdıkları tanır', 'Aynada kendine bakmayı sever', 'Güler'],
    dil: ['Seninle sırayla ses çıkarır', '“Pırt” yapar', 'Ciyaklar'],
    bilissel: ['Keşfetmek için ağzına götürür', 'İstediği oyuncağa uzanır', 'İstemeyince dudaklarını kapatır'],
    hareket: ['Karnüstünden sırtüstüne döner', 'Karnüstü kollarını düz iterek kalkar', 'Otururken ellerine yaslanır'],
  },
  9: {
    sosyal: ['Yabancılardan çekinir', 'Farklı yüz ifadeleri gösterir', 'Adını duyunca bakar', 'Ayrılınca tepki verir', 'Ce-ee ile güler'],
    dil: ['“Mamama, bababa” gibi sesler çıkarır', 'Kucağa alınmak için kollarını kaldırır'],
    bilissel: ['Düşürdüğü nesneyi arar', 'İki şeyi birbirine vurur'],
    hareket: ['Kendi kendine oturur', 'Nesneyi elden ele geçirir', 'Yiyeceği parmaklarıyla kendine çeker', 'Desteksiz oturur'],
  },
  12: {
    sosyal: ['El çırpma gibi oyunları seninle oynar'],
    dil: ['El sallar', 'Ebeveynine “mama/dada” ya da özel bir isimle seslenir', '“Hayır”ı anlar'],
    bilissel: ['Bir şeyi kaba koyar', 'Saklandığını gördüğü şeyi arar'],
    hareket: ['Tutunarak ayağa kalkar', 'Mobilyaya tutunarak yürür', 'Sen tutarken kapaksız bardaktan içer', 'Küçük şeyleri iki parmakla alır'],
  },
};

export const CHECKPOINT_MONTHS = Object.keys(RAW).map(Number);

export const CHECKPOINTS = Object.fromEntries(
  CHECKPOINT_MONTHS.map((m) => [
    m,
    AREAS.map((a) => ({ ...a, items: RAW[m][a.key].map((label, i) => ({ id: `${m}-${a.key}-${i + 1}`, label })) })),
  ])
);

// Yaşı (tamamlanmış ay) karşılayan, ona en yakın ileri kontrol noktası: 1 → 2, 3 → 4, 7 → 9.
export function checkpointFor(ageMonths) {
  return CHECKPOINT_MONTHS.find((m) => m >= ageMonths) ?? CHECKPOINT_MONTHS.at(-1);
}
