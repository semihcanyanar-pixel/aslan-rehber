// "Nasıl yapılır?" videoları: yalnızca EBEVEYN için, güvenilir bir kurumun YouTube videosu, YouTube'un resmî gömme oynatıcısıyla.
// Video indirilip yüklenmez. Aslan'a ekran gösterilmez (1 yaş altı için ekran önerilmez, WHO).
//
// approved: true olmayan kayıt uygulamada GÖRÜNMEZ. Kullanıcı 3 Kasım 2026'da tüm adayları izleyip onayladı;
// uygulamayı kullanırken beğenmediği videoyu söyleyecek, o zaman değiştirilir (approved: false ya da kayıt silinir).
// check: videoyu gözden geçirirken neye bakılacağı (arayüzde gösterilmez).
// Her kayıt Pathways.org'un (çocuk gelişimi uzmanları) videosudur; kimlikler YouTube oEmbed ile doğrulandı.
const P = 'Pathways.org';
const v = (id, title, check = 'Plandaki maddeyle çelişmemeli.') => ({ id, org: P, title, approved: true, check });

export const VIDEOS = {
  // 0–3 ay
  '0-3-t1': [
    v('zQfuBFwVZ5E', 'Yeni doğanla tummy time: nasıl, ne zaman, nerede', 'Plan: uyanık, gözetimde, 3–5 dk ile başla, günde 2–3 kez (AAP).'),
    v('SEA07ZvGfb8', 'Dizlerin üstünde tummy time (kucakta)', 'Kucakta tummy time; bebek uyanık ve gözetimde.'),
  ],
  '0-3-t2': [v('I-Fhn7LPsEs', '4 tummy time pozisyonu (göğüste dahil)', 'Plan: sırtüstü uzan, bebek göğsünde.')],
  '0-3-t3': [v('xigE5X7-CmI', 'Bebeğin bacaklarıyla nazik "bisiklet" hareketi', 'Plan: nazikçe kol-bacak hareketi; zorlama yok.')],
  '0-3-t4': [
    v('hbdcQAfPqbg', 'Bebeğin nesneyi gözle takibine yardım', 'Plan: oyuncağı yavaşça gezdir (CDC).'),
    v('CeYEDp1GWNk', 'Tut ve takip ettir (0–2 ay)'),
  ],
  '0-3-t5': [v('1pLDS9aj2So', 'Siyah, kırmızı ve beyaz oyuncaklar (0–2 ay)', 'Plan: yüksek kontrastlı kartlar ve senin yüzün.')],
  '0-3-t6': [v('QbbwOl7s5io', 'Seslerini taklit et, sohbeti sürdür (2–4 ay)', 'Plan: seslerini taklit et (CDC).')],
  '0-3-t7': [v('_j4Ja0pKFo0', 'Bez değiştirirken sohbet (0–2 ay)', 'Plan: bakım sırasında konuş, gülümse.')],
  '0-3-t8': [v('eyoRB9hkHD8', 'Yüz yüze iletişim (0–2 ay)', 'Plan: servis-dönüş, göz teması (Harvard).')],
  '0-3-z2': [v('uyBCel3r7VA', 'Agulama ve gurultu seslerine karşılık ver (2–4 ay)')],
  '0-3-z5': [v('kKbkfzEU-j0', 'Ayna oyunu (4–6 ay)', 'Plan: bebek için güvenli ayna.')],
  '0-3-z6': [v('H8v-SJhfWRM', 'Ce-ee oyunu', 'Plan: ce-ee oyna, gülümsemesini izle (CDC).')],

  // 4–6 ay
  '4-6-t1': [v('9ZHuKi9Y1Xo', 'Bebek şınavı: kollarla yükselme (tummy time)', 'Plan: tummy time devam (WHO).')],
  '4-6-t3': [
    v('9BTmjXGrNso', 'Bebeğin yuvarlanmasına 8 uzman ipucu (4–6 ay)', 'Plan: oyuncağı yan tarafa koy; bebeği zorla çevirme yok.'),
    v('3EdDmQV9or0', 'Yuvarlan bebeğim, yuvarlan'),
  ],
  '4-6-t5': [v('kKbkfzEU-j0', 'Ayna oyunu (4–6 ay)', 'Plan: kırılmaz ayna, kendine bakmayı sever.')],
  '4-6-t9': [v('Mp0QjPvE5ew', 'Pırt sesi çıkarma (2–4 ay)', 'Plan: pırt sesini taklit et.')],
  '4-6-t10': [v('NtZUo4Ril8g', 'Hareketli şarkılar (4–6 ay)', 'Plan: her gün konuş, oku, şarkı söyle (CDC).')],
  '4-6-t13': [v('EsZwtXWVVlg', 'Kalın sayfalı kitaplarla kitap zamanı (4–6 ay)', 'Plan: kalın sayfalı, belirgin resimli kitap (AAP).')],
  '4-6-z5': [v('VCS9ufAtLc8', 'Kalın sayfalı kitap oyunu (6–9 ay)')],

  // 7–9 ay
  '7-9-t1': [v('kQXQf3OW1_I', 'Bebeğin oturmasına yardım', 'Plan: oyuncakları biraz uzağa koy; bebek oturtulup bırakılmıyor.')],
  '7-9-t2': [
    v('o2reZuC5MEE', 'Emeklemeyi öğrenmesi için 6 basit ipucu (6–9 ay)', 'Plan: emeklemeye hazırlık için yerde bol zaman (WHO).'),
    v('gpYtWVJJQro', 'Sürünme ve emekleme (6–9 ay)'),
  ],
  '7-9-t6': [v('phJvUpvbVBU', 'Ce-ee oyununun aşamaları', 'Plan: ce-ee oyunu, güler ya da kıkırdar.')],
  '7-9-t7': [v('L4F17-zvZQk', 'İsim oyunu (6–9 ay)', 'Plan: adıyla seslen, döndüğünde gülümse.')],
  '7-9-t13': [v('VCS9ufAtLc8', 'Kalın sayfalı kitap oyunu (6–9 ay)', 'Plan: ilgisini çeken resmi adlandır, sayfayı birlikte çevirin (AAP).')],
  '7-9-z2': [v('aPL9ceXcdkE', 'Bebek işaret dili (6–9 ay)', 'Plan: basit jestler ve bebek işaretleri (CDC).')],

  // 10–12 ay
  '10-12-t1': [
    v('GZO8fYjrVak', 'Mobilyaya tutunarak ilerleme (9–12 ay)', 'Plan: sağlam mobilya; köşe koruyucu ve sabitlenmiş mobilya şart.'),
    v('H-Knx8v2ORo', 'Oturmaktan ayağa kalkma (9–12 ay)'),
    v('kqRd014DaZA', 'İtmeli oyuncaklarla yürüme (9–12 ay)'),
  ],
  '10-12-t2': [v('aTz0eXDua3o', 'Tepsideki yiyeceği parmaklarla tutma (9–12 ay)', 'Plan: küçük, yumuşak lokmalar, doktorunun onayladığı gıdalarla.')],
  '10-12-t4': [v('-9jijdeGcpk', 'Oyuncakları kutuya koy ve çıkar (9–12 ay)', 'Plan: kaba nesne koyup çıkarma.')],
  '10-12-t5': [v('iIn-HkVdufU', 'Saklan ve bul (9–12 ay)', 'Plan: battaniye altına sakla, bulsun.')],
  '10-12-t7': [
    v('9uO1IC_n5q4', 'El sallama: bay bay (9–12 ay)', 'Plan: el çırpma ve el sallama.'),
    v('nCZAtzwmEls', 'Pat-a-cake: el çırpma oyunu (9–12 ay)'),
  ],
  '10-12-t13': [
    v('cbLRThZkLxE', 'Her gün kitap (9–12 ay)', 'Plan: dokulu ya da kapaklı kitaplar, resimleri anlatmak bile yeter (CDC, AAP).'),
    v('TqVK93BGR_s', 'Hikâye zamanı (9–12 ay)'),
  ],
};

export const videosFor = (taskId) => (VIDEOS[taskId] ?? []).filter((x) => x.approved);
export const videoFor = (taskId) => videosFor(taskId)[0] ?? null;
export const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
export const thumbUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const embedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`;
