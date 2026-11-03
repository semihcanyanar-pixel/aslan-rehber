// "Nasıl yapılır?" videoları: yalnızca EBEVEYN için, güvenilir bir kurumun YouTube videosu, YouTube'un resmî gömme oynatıcısıyla.
// Video indirilip yüklenmez. Aslan'a ekran gösterilmez (1 yaş altı için ekran önerilmez, WHO).
//
// approved: true olmayan kayıt uygulamada GÖRÜNMEZ. Kullanıcı videoyu izleyip plandaki maddeyle uyumunu onaylayınca true yapılır.
// check: onaylarken neye bakılacağı (arayüzde gösterilmez).
export const VIDEOS = {
  '0-3-t1': [
    { id: 'zQfuBFwVZ5E', org: 'Pathways.org', title: 'Yeni doğanla tummy time: nasıl, ne zaman, nerede', approved: false,
      check: 'Plan: uyanık, gözetimde, 3–5 dk ile başla, günde 2–3 kez (AAP). Videodaki süre ve pozisyonlar bununla çelişmemeli.' },
  ],
  '0-3-t2': [
    { id: 'I-Fhn7LPsEs', org: 'Pathways.org', title: '4 tummy time pozisyonu (göğüste dahil)', approved: false,
      check: 'Plan: sırtüstü uzan, bebek göğsünde (tummy to tummy). Videoda bu pozisyon var mı, eller bebeğin üzerinde mi?' },
  ],
  '0-3-t4': [
    { id: 'hbdcQAfPqbg', org: 'Pathways.org', title: 'Bebeğin nesneyi gözle takibine yardım', approved: false,
      check: 'Plan: oyuncağı yavaşça sağdan sola, yukarıdan aşağı gezdir (CDC). Videodaki yaş ve mesafe uygun mu?' },
  ],
  '4-6-t3': [
    { id: '9BTmjXGrNso', org: 'Pathways.org', title: 'Bebeğin yuvarlanmasına 8 uzman ipucu (4–6 ay)', approved: false,
      check: 'Plan: yerde serbest oyun, oyuncağı yan tarafa koy. Videoda bebeği zorla çevirme ya da güvensiz bir şey var mı?' },
  ],
  '7-9-t1': [
    { id: 'kQXQf3OW1_I', org: 'Pathways.org', title: 'Bebeğin oturmasına yardım', approved: false,
      check: 'Plan: oyuncakları biraz uzağa koy, uzanıp dengesini kursun. Videoda bebek oturtulup bırakılıyor mu (plan buna karşı)?' },
  ],
};

export const videoFor = (taskId) => (VIDEOS[taskId] ?? []).find((v) => v.approved) ?? null;
export const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
export const embedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`;
