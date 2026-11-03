// Görev kataloğu: docs/plan-0-12-ay.md maddelerinden alınmıştır, içerik uydurulmaz.
// source: planda parantez içinde kaynak etiketi olan maddelerde etiket; olmayanlarda boş dizi.
// babaNote: Türkçe maddenin yalnızca baba profilinde görünen İngilizce karşılığı (plandaki örnek).
// id'ler dönem + tier + sıra numarasıdır; sırayı değiştirme, yeni maddeyi sona ekle.

const CDC = ['CDC'];
const AAP = ['AAP'];
const WHO = ['WHO'];
const HARVARD = ['Harvard'];
const NONE = [];

// [slot, owner, lang, category, title, description, source, extra]
const RAW = {
  '0-3': {
    temel: [
      ['sabah', 'ikisi', 'yok', 'hareket', 'Kısa tummy time', 'Bez değişiminden ya da uykudan sonra, Aslan uyanıkken ve gözetim altındayken 3–5 dakikayla başla. Günde 2–3 kez; 7. haftaya kadar günde toplam 15–30 dakikaya çıkar.', AAP, {
        image: 'yer',
        timer: true,
        steps: [
          'Aslan uyanıkken ve gözetim altındayken yap; bez değişiminden ya da uykudan sonra uygun.',
          '3–5 dakikayla başla.',
          'Günde 2–3 kez tekrarla; 7. haftaya kadar günde toplam 15–30 dakikaya çıkar.',
          'Sen uykuya dalıyorsan ya da Aslan huysuzlanıyorsa hemen bitir.',
        ],
      }],
      ['ogle', 'ikisi', 'yok', 'hareket', 'Göğüste tummy time', 'En kolay yol: sırtüstü uzan, Aslan göğsünde. Sonra yerde battaniye, oyuncak tam uzanamayacağı mesafede.', NONE, {
        image: 'gogus',
        timer: true,
        steps: [
          'Sırtüstü uzan, Aslan göğsünde olsun.',
          'Aslan uyanık ve gözetim altında olsun; uykuya dalarsan hemen bitir.',
          'Alışınca yerde battaniye üzerinde dene.',
          'Oyuncağı tam uzanamayacağı mesafeye koy.',
        ],
      }],
      ['ogle', 'ikisi', 'yok', 'hareket', 'Şarkıyla kol-bacak hareketi', 'Şarkı söylerken kollarını ve bacaklarını nazikçe hareket ettir.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Görsel takip oyunu', 'Parlak bir oyuncağı yavaşça sağdan sola, yukarıdan aşağı gezdir; gözüyle takip ediyor mu bak.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Kontrastlı kartlar ve senin yüzün', 'Siyah-beyaz, yüksek kontrastlı kartlar ve en çok da senin yüzün.', NONE],
      ['sabah', 'ikisi', 'tr', 'dil', 'Seslerini taklit et', 'Seslerini taklit et, “sohbeti” ne kadar uzatabildiğine bak.', CDC],
      ['sabah', 'ikisi', 'tr', 'dil', 'Adını sık kullan', 'Adını sık kullan; bakım sırasında konuş, gülümse, şarkı söyle.', NONE],
      ['aksam', 'ikisi', 'tr', 'dil', 'Servis-dönüş', 'Ne yaptığını fark et, cevap ver, adını koy, sırasını bekle.', HARVARD],
      ['sabah', 'baba', 'en', 'dil', 'Rutinleri İngilizce anlat', 'Bez ve giyinme rutinini yavaş ve melodik bir sesle İngilizce anlat, sesine cevap ver. Örnek: “Let’s change your diaper.”', NONE],
      ['aksam', 'baba', 'en', 'dil', 'İngilizce kitap ve şarkı', 'Kısa bir İngilizce kitap ya da şarkı. Dilleri cümle ortasında karıştırma; etkinliğe göre ayır.', ['JSLHR']],
      ['aksam', 'ikisi', 'tr', 'dil', 'Kitap zamanı', 'Kucağında, sakin bir yerde; göz teması kur, farklı sesler kullan, basit tekerlemeli ve belirgin resimli kitap seç. Başını çevirir ya da huysuzlanırsa bırak.', AAP, { book: true }],
    ],
    zengin: [
      ['sabah', 'ikisi', 'tr', 'dil', 'Yaptığını sesli anlat', 'Beslenme, giyinme ve banyo gibi günlük işleri yaparken ne yaptığını sesli anlat.', CDC],
      ['ogle', 'ikisi', 'tr', 'dil', 'Sırayla ses çıkarın', 'Seslerini aynala ve sırayla ses çıkarın; karşılıklı “sohbeti” birkaç tur uzatmaya çalış.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Sese dönme oyunu', 'Başının bir yanında çıngırak salla, sese doğru dönüyor mu bak.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Resimlere birlikte bak', 'Renkli resimlere ya da yüzlere birlikte bak ve onları anlat.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Güvenli ayna', 'Yakınına bebek için güvenli bir ayna koy.', CDC],
      ['ogle', 'ikisi', 'yok', 'duygusal', 'Ce-ee oyunu', 'Ce-ee oyna, gülümsemesini ve keyfini izle.', CDC],
      ['aksam', 'ikisi', 'yok', 'duygusal', 'Neyi sevdiğini fark et', 'Neyi sevip neyi sevmediğini fark et ve not al.', CDC],
      ['aksam', 'ikisi', 'yok', 'duygusal', 'Servis-dönüşün beş adımı', 'Odağını fark et, cevap ver, adını koy, sırasını bekle, bitişi ve yeni başlangıcı ona bırak.', HARVARD],
    ],
  },
  '4-6': {
    temel: [
      ['sabah', 'ikisi', 'yok', 'hareket', 'Tummy time devam', 'Hareket etmeye başlamamış bebek için gün içine yayılmış en az 30 dakika.', WHO, { image: 'yer' }],
      ['ogle', 'ikisi', 'yok', 'hareket', 'Oyuncak çemberi', 'Oyuncakları etrafına daire şeklinde diz, farklı yönlere uzansın.', AAP],
      ['ogle', 'ikisi', 'yok', 'hareket', 'Yerde serbest oyun', 'Yerde her gün serbest oyun; yuvarlanmayı teşvik etmek için oyuncağı yan tarafa koy.', NONE],
      ['ogle', 'ikisi', 'yok', 'hareket', 'Zıplatma oyunu', 'Koltuk altından tutup ayaklarını kucağına bastırarak zıplat.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Kırılmaz ayna', 'Kırılmaz ayna: kendine bakmayı sever.', NONE],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Güvenle ağzıyla keşfetsin', 'Güvenli nesneleri ağzıyla keşfetmesine izin ver; keskin, sıcak ya da yutulabilecek kadar küçük olmasın.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Çıngırak ve kumaş kitap', 'Kolay tutulan çıngırak, parlak resimli kumaş kitap.', CDC],
      ['sabah', 'ikisi', 'tr', 'dil', 'Ses sohbeti', 'Sesine heyecanla karşılık ver, sırayla “konuşun”.', CDC],
      ['ogle', 'ikisi', 'tr', 'dil', 'Pırt ve ciyaklama', 'Dil çıkarıp “pırt” sesi yapınca taklit et; ciyaklamalara cevap ver.', NONE],
      ['aksam', 'ikisi', 'tr', 'dil', 'Konuş, oku, şarkı söyle', 'Her gün konuş, oku, şarkı söyle.', CDC],
      ['ogle', 'baba', 'en', 'dil', 'Nesnelere ad ver', 'Sırayla ses oyunları oyna, nesnelere İngilizce ad ver. Örnek: “Look! A duck. Quack quack!”', NONE],
      ['aksam', 'baba', 'en', 'dil', 'İngilizce kitap ve şarkı', 'Hareketli bir İngilizce şarkı ya da kalın sayfalı bir kitap. Dilleri cümle ortasında karıştırma; etkinliğe göre ayır.', ['JSLHR']],
      ['aksam', 'ikisi', 'tr', 'dil', 'Kitap zamanı', 'İlgisini çeken resmi göster ve adlandır, sayfayı birlikte çevirin, resmi yüzün, ellerin ve sesinle canlandır.', AAP, { book: true }],
    ],
    zengin: [
      ['ogle', 'ikisi', 'tr', 'dil', 'Baktığını adlandır', 'Yürüyüşte ya da ev içinde baktığı şeyi işaret et ve adlandır.', CDC],
      ['sabah', 'ikisi', 'tr', 'dil', 'Farklı sesler tanıt', 'Farklı sesler tanıt: fısıltı, el çırpma, komik sesler.', CDC],
      ['aksam', 'ikisi', 'tr', 'dil', 'Şarkı ve müzik', 'Şarkı söyle, müzik çal.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Düşen oyuncağı geri ver', 'Düşürdüğü oyuncağı geri ver; sebep-sonuç ilişkisini öğrenir.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Kalın sayfalı ve kumaş kitaplar', 'Sağlam kalın sayfalı kitaplar ve farklı dokulu kumaş kitaplar ver.', AAP],
      ['sabah', 'ikisi', 'yok', 'duygusal', 'Gülümse, seslerini kopyala', 'Gülümsediğinde gülümse, seslerini kopyala; karşılıklı oyunu sürdür.', CDC],
      ['ogle', 'ikisi', 'yok', 'duygusal', 'Taklit oyunu', 'Kitapla ya da oyuncakla nasıl oynuyorsa sen de öyle oyna.', AAP],
      ['aksam', 'ikisi', 'yok', 'duygusal', 'Ruh halini izle', 'Ruh halini izle: mutluysa devam, üzgünse mola verip teselli et.', CDC],
    ],
  },
  '7-9': {
    temel: [
      ['ogle', 'ikisi', 'yok', 'hareket', 'Oturarak oyun', 'Oyuncakları biraz uzağa koy, uzanıp dengesini kursun.', NONE],
      ['sabah', 'ikisi', 'yok', 'hareket', 'Yerde bol zaman', 'Emeklemeye hazırlık için yerde bol zaman; puset ve mama sandalyesinde tek seferde 1 saati geçme.', WHO],
      ['ogle', 'ikisi', 'yok', 'hareket', 'Elden ele aktarma', 'İki eli arasında nesne aktarma: büyük, güvenli bloklar.', NONE],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Saklambaç oyuncağı', 'Oyuncağı bezle yarı ört, sonra tamamen; arıyor mu bak.', NONE],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Vurma oyunu', 'İki nesneyi birbirine vurmak: tahta kaşık ve tencere kapağı gibi.', NONE],
      ['aksam', 'ikisi', 'yok', 'bilissel', 'Ce-ee oyunu', 'Ce-ee oyunu: güler ya da kıkırdar.', NONE],
      ['sabah', 'ikisi', 'tr', 'dil', 'Adıyla seslen', 'Adıyla seslen; döndüğünde gülümse ve konuş.', NONE],
      ['ogle', 'ikisi', 'tr', 'dil', 'Sesi kelimeye bağla', '“Mamama, bababa” zincirlerine cevap ver, sesi kelimeye bağla.', NONE],
      ['sabah', 'ikisi', 'tr', 'dil', 'Jest ve kelime eşleşsin', 'Kollarını kaldırınca “Kucağa!” de; jest ve kelime eşleşsin.', NONE, { babaNote: 'İngilizce karşılığı: “Up!”' }],
      ['aksam', 'ikisi', 'yok', 'duygusal', 'Kısa ve sakin vedalaş', 'Yabancılardan çekinme ve ayrılık tepkisi bu dönemde normal; ayrılırken kısa ve sakin vedalaş.', NONE],
      ['ogle', 'baba', 'en', 'dil', 'Jestle kelimeyi eşleştir', 'Jestle kelimeyi eşleştir, tekrar eden rutin kelimeleri sabitle. Örnek: “Up!”, “More?”, “All done!”, “Bye-bye!”', NONE],
      ['aksam', 'baba', 'en', 'dil', 'İngilizce kitap ve şarkı', 'Kısa bir İngilizce kitap ya da şarkı. Dilleri cümle ortasında karıştırma; etkinliğe göre ayır.', ['JSLHR']],
      ['aksam', 'ikisi', 'tr', 'dil', 'Kitap zamanı', 'Dokunduğu ya da baktığı resmi adlandır, istediği sayfaya geçmesine izin ver, aynı kitabı tekrar isterse oku; “Kuş nerede?” gibi sorular sor.', AAP, { book: true }],
    ],
    zengin: [
      ['ogle', 'ikisi', 'tr', 'dil', 'Sesten kelimeye', 'Çıkardığı sesleri tekrar et ve o seslerle başlayan basit kelimeler ekle: “ba-ba” → “balon”.', CDC, { babaNote: 'İngilizce karşılığı: “ba-ba” → “ball”' }],
      ['sabah', 'ikisi', 'tr', 'dil', 'Jestleri öğret', 'El sallama, “hayır” için baş sallama gibi jestleri öğret; basit bebek işaretleri de kullanılabilir.', CDC],
      ['ogle', 'ikisi', 'tr', 'dil', 'Neye baktığını anlat', 'Neye baktığını anlat; hissettiği şeyi kelimeyle, yüz ifadesiyle ve ses tonunla göster.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Blokları dök, geri koy', 'Kaptaki blokları dökün ve birlikte geri koyun.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Düşeni geri ver', 'Bir şeyi düşürdüğünde geri vererek oyuna çevir.', CDC],
      ['ogle', 'ikisi', 'yok', 'duygusal', 'Sıra bende, sıra sende', 'Bir oyuncağı karşılıklı ver-al.', CDC],
      ['ogle', 'ikisi', 'yok', 'duygusal', 'Yanında ol', 'Keşfederken yakınında dur, yanında olduğunu bilsin.', CDC],
      ['aksam', 'ikisi', 'yok', 'duygusal', 'İstediğini olumlu söyle', 'İstediğin davranışı söyle: “Kalkma” yerine “Oturma zamanı”.', CDC],
    ],
  },
  '10-12': {
    temel: [
      ['ogle', 'ikisi', 'yok', 'hareket', 'Tutunarak yürüme', 'Sağlam mobilya kenarında tutunarak yürüme; köşe koruyucu ve sabitlenmiş mobilya şart.', NONE],
      ['ogle', 'ikisi', 'yok', 'hareket', 'İki parmakla kavrama', 'Başparmak-işaret parmağı kavrama: mama sırasında küçük, yumuşak lokmalar (doktorunun onayladığı gıdalarla).', NONE],
      ['sabah', 'ikisi', 'yok', 'hareket', 'Bardaktan içme', 'Kapaksız bardaktan içme: sen tutarken.', NONE],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Koy ve çıkar', 'Kaba nesne koyup çıkarma: blok ve bardak.', NONE],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Battaniye altında sakla', 'Battaniye altına sakla, bulsun.', NONE],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Sebep-sonuç oyuncağı', 'Basit sebep-sonuç oyuncakları: bas, ses çıksın.', NONE],
      ['aksam', 'ikisi', 'tr', 'dil', 'El çırpma ve el sallama', 'El çırpma oyunları ve “bay bay” el sallama.', NONE, { babaNote: 'İngilizce karşılığı: “bye-bye”' }],
      ['sabah', 'ikisi', 'tr', 'dil', 'Adlandır ve genişlet', 'Gösterdiği her şeye ad ver ve bir adım genişlet: “Top! Kırmızı top.”', NONE, { babaNote: 'İngilizce karşılığı: “Ball! A red ball.”' }],
      ['ogle', 'ikisi', 'tr', 'dil', 'Cevap için bekle', 'Cevap için bekle: sorudan sonra birkaç saniye sus.', NONE],
      ['aksam', 'ikisi', 'tr', 'dil', 'Kısa ve tutarlı “hayır”', '“Hayır”ı kısa ve tutarlı kullan; anlayınca durur.', NONE],
      ['ogle', 'baba', 'en', 'dil', 'Gösterdiğine ad ver', 'Gösterdiğine ad ver ve genişlet, cevap için bekle. Örnek: “Ball! A red ball. Throw the ball!”', NONE],
      ['aksam', 'baba', 'en', 'dil', 'İngilizce kitap', 'Her gün bir İngilizce kitap. Dilleri cümle ortasında karıştırma; etkinliğe göre ayır.', ['JSLHR']],
      ['aksam', 'ikisi', 'tr', 'dil', 'Kitap zamanı', 'Dokulu ya da kapaklı kitaplar, top ve blok gibi gündelik nesneleri gösteren kitaplar; yalnızca resimleri anlatmak bile yeter.', ['CDC', 'AAP'], { book: true }],
    ],
    zengin: [
      ['ogle', 'ikisi', 'tr', 'dil', 'Kelimeyi genişlet', 'Söylemeye çalıştığı kelimeyi daha ayrıntılı tekrar et: “Da!” → “Evet, köpek!”', CDC, { babaNote: 'İngilizce karşılığı: “Da!” → “Yes, a dog!”' }],
      ['sabah', 'ikisi', 'tr', 'dil', 'Günlük işleri anlat', 'El yıkama gibi günlük işleri konuşarak ya da şarkıyla anlat.', CDC],
      ['ogle', 'ikisi', 'tr', 'dil', 'İşarete kelimeyle karşılık ver', 'İşaret ettiğinde kelimeyle karşılık ver ve söyleme denemesini kutla.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Gösterdiğin yere baksın', 'Kamyon, hayvan gibi ilginç şeyleri göster; gösterdiğin yere bakmayı öğrensin.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Bloklar ve el oyuncakları', 'Bloklar ve elleri kullandıran oyuncaklarla oyna.', CDC],
      ['ogle', 'ikisi', 'yok', 'bilissel', 'Ses çıkarsın', 'Tencere, tava ya da küçük bir davulla ses çıkarmasına izin ver.', CDC],
      ['ogle', 'ikisi', 'yok', 'duygusal', 'Göstererek öğret', 'İstenen davranışı göstererek öğret ve öv: hayvanın kuyruğunu çekmek yerine onu nazikçe sevmek gibi.', CDC],
      ['aksam', 'ikisi', 'yok', 'duygusal', 'Dikkatini yönlendir', 'Başka bir oyuncakla ya da yerini değiştirerek dikkatini yönlendir; sert “hayır”ı tehlikeli durumlara sakla.', CDC],
    ],
  },
};

export const PERIOD_ORDER = ['0-3', '4-6', '7-9', '10-12'];

export const TASKS = [];
for (const period of PERIOD_ORDER) {
  for (const tier of ['temel', 'zengin']) {
    RAW[period][tier].forEach(([slot, owner, lang, category, title, description, source, extra], i) => {
      TASKS.push({ id: `${period}-${tier[0]}${i + 1}`, period, tier, slot, owner, lang, category, title, description, source, ...extra });
    });
  }
}

const ENUMS = {
  period: PERIOD_ORDER,
  tier: ['temel', 'zengin'],
  slot: ['sabah', 'ogle', 'aksam'],
  owner: ['baba', 'anne', 'ikisi'],
  lang: ['en', 'tr', 'yok'],
  category: ['duygusal', 'dil', 'bilissel', 'hareket'],
};

export function validateCatalog(tasks = TASKS) {
  const ids = new Set();
  for (const t of tasks) {
    if (ids.has(t.id)) throw new Error(`Yinelenen görev id: ${t.id}`);
    ids.add(t.id);
    for (const [k, allowed] of Object.entries(ENUMS)) {
      if (!allowed.includes(t[k])) throw new Error(`${t.id}: geçersiz ${k} "${t[k]}"`);
    }
    if (t.lang === 'en' && t.owner !== 'baba') throw new Error(`${t.id}: İngilizce görev yalnızca babaya verilebilir`);
    if (t.lang === 'en' && t.tier !== 'temel') throw new Error(`${t.id}: İngilizce görev temel olmalı`);
    if (t.babaNote && t.owner === 'anne') throw new Error(`${t.id}: anne görevinde babaNote olamaz`);
  }
  return true;
}

validateCatalog();
