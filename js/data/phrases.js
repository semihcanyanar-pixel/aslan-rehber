// İngilizce koç cümleleri (Amerikan aksanı). TASLAK: cümleler ve IPA henüz doğrulanmadı.
// Ses dosyası: audio/<cümle-id>.mp3 (cümle id'si <paket>-<sıra>, örn. bez-1).
// Dosyaları scripts/ses-uret.mjs üretir ve audio-list.js'i günceller; elle koyarsan id'yi oraya yaz.
import { AUDIO_IDS } from './audio-list.js';

export const AUDIO = new Set(AUDIO_IDS);

const TIP = 'Yavaş ve melodik konuş. Söyledikten sonra dur, Aslan’ın sırasını bekle; ses çıkarırsa cevap ver.';

// [en, ipa, tr]
const RAW = {
  bez: ['Bez ve giyinme', [
    ['Let’s change your diaper.', '/lets tʃeɪndʒ jʊr ˈdaɪpɚ/', 'Hadi bezini değiştirelim.'],
    ['Up go your legs!', '/ʌp ɡoʊ jʊr leɡz/', 'Bacaklar yukarı!'],
    ['All clean now!', '/ɔːl kliːn naʊ/', 'Tertemiz oldun!'],
    ['Let’s get you dressed.', '/lets ɡet juː drest/', 'Hadi seni giydirelim.'],
  ]],
  banyo: ['Banyo', [
    ['Time for your bath.', '/taɪm fɔːr jʊr bæθ/', 'Banyo zamanı.'],
    ['The water is warm.', '/ðə ˈwɔːtɚ ɪz wɔːrm/', 'Su ılık.'],
    ['Splash, splash!', '/splæʃ splæʃ/', 'Şap şap!'],
  ]],
  uyku: ['Uyku', [
    ['Are you sleepy?', '/ɑːr juː ˈsliːpi/', 'Uykun mu geldi?'],
    ['Close your eyes.', '/kloʊz jʊr aɪz/', 'Gözlerini kapat.'],
    ['Night night, sweetheart.', '/naɪt naɪt ˈswiːthɑːrt/', 'İyi geceler, tatlım.'],
  ]],
  beslenme: ['Beslenme', [
    ['Are you hungry?', '/ɑːr juː ˈhʌŋɡri/', 'Acıktın mı?'],
    ['Here’s your milk.', '/hɪrz jʊr mɪlk/', 'İşte sütün.'],
    ['Good burp!', '/ɡʊd bɝːp/', 'Güzel geğirdin!'],
  ]],
  oyun: ['Oyun', [
    ['Look at the picture.', '/lʊk æt ðə ˈpɪktʃɚ/', 'Resme bak.'],
    ['You’re so strong!', '/jʊr soʊ strɔːŋ/', 'Ne kadar güçlüsün!'],
    ['Again? OK, again!', '/əˈɡen oʊˈkeɪ əˈɡen/', 'Yine mi? Tamam, yine!'],
  ]],
  tummy: ['Tummy time', [
    ['Tummy time!', '/ˈtʌmi taɪm/', 'Karın üstü zamanı!'],
    ['Look at you!', '/lʊk æt juː/', 'Bak sen neler yapıyorsun!'],
    ['You’re getting so strong!', '/jʊr ˈɡetɪŋ soʊ strɔːŋ/', 'Ne kadar güçleniyorsun!'],
    ['Good job!', '/ɡʊd dʒɑːb/', 'Aferin!'],
  ]],
  takip: ['Görsel takip', [
    ['Look at the toy.', '/lʊk æt ðə tɔɪ/', 'Oyuncağa bak.'],
    ['Can you see it?', '/kæn juː siː ɪt/', 'Görebiliyor musun?'],
    ['Here it comes!', '/hɪr ɪt kʌmz/', 'İşte geliyor!'],
    ['Up and down.', '/ʌp ænd daʊn/', 'Yukarı ve aşağı.'],
  ]],
  sohbet: ['Ses sohbeti', [
    ['Ooh, you said something!', '/uː juː sed ˈsʌmθɪŋ/', 'Vay, bir şey söyledin!'],
    ['Tell me more!', '/tel miː mɔːr/', 'Daha anlat!'],
    ['Your turn!', '/jʊr tɝːn/', 'Sıra sende!'],
  ]],
  cee: ['Ce-ee', [
    ['Where did Daddy go?', '/wer dɪd ˈdædi ɡoʊ/', 'Baba nereye gitti?'],
    ['Peekaboo!', '/ˈpiːkəbuː/', 'Ce-ee!'],
    ['There you are!', '/ðer juː ɑːr/', 'İşte buradasın!'],
  ]],
  kitap: ['Kitap zamanı', [
    ['Let’s read a book.', '/lets riːd ə bʊk/', 'Hadi kitap okuyalım.'],
    ['What do you see?', '/wʌt duː juː siː/', 'Ne görüyorsun?'],
    ['Turn the page.', '/tɝːn ðə peɪdʒ/', 'Sayfayı çevir.'],
    ['The end!', '/ði end/', 'Son!'],
  ]],
  ayna: ['Ayna', [
    ['Who’s that in the mirror?', '/huːz ðæt ɪn ðə ˈmɪrɚ/', 'Aynadaki kim?'],
    ['It’s you!', '/ɪts juː/', 'Sensin!'],
    ['Hello, baby!', '/həˈloʊ ˈbeɪbi/', 'Merhaba bebek!'],
  ]],
  sarki: ['Şarkı', [
    ['Twinkle, twinkle, little star.', '/ˈtwɪŋkəl ˈtwɪŋkəl ˈlɪtəl stɑːr/', 'Parla parla küçük yıldız.'],
    ['Let’s sing a song.', '/lets sɪŋ ə sɔːŋ/', 'Hadi şarkı söyleyelim.'],
    ['Arms up, arms down.', '/ɑːrmz ʌp ɑːrmz daʊn/', 'Kollar yukarı, kollar aşağı.'],
  ]],
  hareket: ['Hareket', [
    ['You can do it!', '/juː kæn duː ɪt/', 'Yapabilirsin!'],
    ['Nice and easy.', '/naɪs ænd ˈiːzi/', 'Yavaş ve rahat.'],
    ['Good job!', '/ɡʊd dʒɑːb/', 'Aferin!'],
  ]],
  kesif: ['Keşif', [
    ['What’s this?', '/wʌts ðɪs/', 'Bu ne?'],
    ['Touch it. Soft!', '/tʌtʃ ɪt sɔːft/', 'Dokun. Yumuşak!'],
    ['You found it!', '/juː faʊnd ɪt/', 'Buldun!'],
  ]],
  konusma: ['Konuşma', [
    ['I hear you!', '/aɪ hɪr juː/', 'Seni duyuyorum!'],
    ['Tell me more!', '/tel miː mɔːr/', 'Daha anlat!'],
    ['Your turn!', '/jʊr tɝːn/', 'Sıra sende!'],
  ]],
  sevgi: ['Sevgi', [
    ['I love you.', '/aɪ lʌv juː/', 'Seni seviyorum.'],
    ['Big smile!', '/bɪɡ smaɪl/', 'Kocaman gülümseme!'],
    ['You make me so happy.', '/juː meɪk miː soʊ ˈhæpi/', 'Beni çok mutlu ediyorsun.'],
  ]],
  // 4–12 ay: plandaki İngilizce örnekler ve onların basit uzantıları.
  nesne: ['Nesnelere ad ver', [
    ['Look! A duck.', '/lʊk ə dʌk/', 'Bak! Bir ördek.'],
    ['Quack, quack!', '/kwæk kwæk/', 'Vak vak!'],
    ['Can you see the duck?', '/kæn juː siː ðə dʌk/', 'Ördeği görebiliyor musun?'],
  ]],
  jest: ['Jest ve kelime', [
    ['Up!', '/ʌp/', 'Yukarı! (Kucağa!)'],
    ['More?', '/mɔːr/', 'Biraz daha?'],
    ['All done!', '/ɔːl dʌn/', 'Bitti!'],
    ['Bye-bye!', '/baɪ baɪ/', 'Bay bay!'],
  ]],
  sesten: ['Sesten kelimeye', [
    ['Ba-ba… ball!', '/bɑː bɑː bɔːl/', 'Ba-ba… top!'],
    ['Ball!', '/bɔːl/', 'Top!'],
    ['You said ball!', '/juː sed bɔːl/', 'Top dedin!'],
  ]],
  top: ['Top ve nesneler', [
    ['Ball! A red ball.', '/bɔːl ə red bɔːl/', 'Top! Kırmızı bir top.'],
    ['Throw the ball!', '/θroʊ ðə bɔːl/', 'Topu at!'],
    ['Where is the ball?', '/wer ɪz ðə bɔːl/', 'Top nerede?'],
  ]],
  elsallama: ['El çırpma ve el sallama', [
    ['Bye-bye!', '/baɪ baɪ/', 'Bay bay!'],
    ['Wave bye-bye.', '/weɪv baɪ baɪ/', 'Bay bay yap.'],
    ['Clap, clap, clap!', '/klæp klæp klæp/', 'Çırp çırp çırp!'],
  ]],
  kelime: ['Kelimeyi genişlet', [
    ['Da!', '/dɑː/', 'Da!'],
    ['Yes, a dog!', '/jes ə dɔːɡ/', 'Evet, bir köpek!'],
    ['Good try!', '/ɡʊd traɪ/', 'Güzel denedin!'],
  ]],
};

export const PACKS = Object.fromEntries(
  Object.entries(RAW).map(([key, [title, phrases]]) => [
    key,
    {
      key,
      title,
      tip: TIP,
      phrases: phrases.map(([en, ipa, tr], i) => {
        const id = `${key}-${i + 1}`;
        return { id, en, ipa, tr, ...(AUDIO.has(id) ? { audio: `audio/${id}.mp3` } : {}) };
      }),
    },
  ])
);

// Şu anki dönem (0–3 ay) için görev başına özel paket; diğerleri başlığa/kategoriye göre.
export const TASK_PACK = {
  '0-3-t1': 'tummy', '0-3-t2': 'tummy', '0-3-t3': 'sarki', '0-3-t4': 'takip', '0-3-t5': 'kesif',
  '0-3-t6': 'sohbet', '0-3-t7': 'konusma', '0-3-t8': 'konusma', '0-3-t9': 'bez', '0-3-t10': 'kitap',
  '0-3-z1': 'bez', '0-3-z2': 'sohbet', '0-3-z3': 'takip', '0-3-z4': 'kesif',
  '0-3-z5': 'ayna', '0-3-z6': 'cee', '0-3-z7': 'sevgi', '0-3-z8': 'konusma', '0-3-t11': 'kitap',
  '4-6-t11': 'nesne', '4-6-z1': 'nesne', '4-6-t5': 'ayna', '4-6-t8': 'sohbet', '4-6-z8': 'sevgi',
  '7-9-t6': 'cee', '7-9-t9': 'jest', '7-9-t11': 'jest', '7-9-z1': 'sesten', '7-9-z2': 'jest',
  '10-12-t7': 'elsallama', '10-12-t8': 'top', '10-12-t11': 'top', '10-12-z1': 'kelime',
};
const CATEGORY_PACK = { hareket: 'hareket', bilissel: 'kesif', dil: 'konusma', duygusal: 'sevgi' };

export function packFor(task) {
  const key = TASK_PACK[task.id] ?? (/kitap/i.test(task.title) ? 'kitap' : CATEGORY_PACK[task.category]);
  return PACKS[key];
}
