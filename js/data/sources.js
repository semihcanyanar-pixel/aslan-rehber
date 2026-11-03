// docs/plan-0-12-ay.md "Kaynaklar" bölümündeki bağlantılar, kuruma göre gruplanmış.
// Bağlantı eklerken/çıkarırken planla aynı tut (test/sources.test.mjs karşılaştırır).

export const SOURCE_GROUPS = [
  {
    badge: 'WHO',
    bg: '#DDE5F2',
    fg: '#2F4F80',
    name: 'Dünya Sağlık Örgütü',
    desc: '5 yaş altı fiziksel aktivite, hareketsizlik ve uyku kılavuzu → tummy time, hareket, ekran ve kısıtlayıcı oturma sınırları',
    links: [
      ['5 yaş altı fiziksel aktivite, hareketsizlik ve uyku kılavuzu', 'https://www.who.int/news/item/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more'],
    ],
  },
  {
    badge: 'CDC',
    bg: '#FBE1D6',
    fg: '#8F3520',
    name: 'ABD Hastalık Kontrol Merkezi',
    desc: 'Gelişim basamakları ve ebeveyn etkinlikleri → Gelişim sekmesindeki gözlem listeleri, birçok görev kartı',
    links: [
      ['2, 6, 9 ay ve 1 yaş basamak kontrol listeleri', 'https://www.cdc.gov/ncbddd/actearly/pdf/FULL-LIST-CDC_LTSAE-Checklists2021_Eng_FNL2_508.pdf'],
      ['2. ay basamakları ve ebeveyn etkinlikleri', 'https://www.cdc.gov/act-early/milestones/2-months.html'],
      ['4. ay basamakları ve ebeveyn etkinlikleri', 'https://www.cdc.gov/act-early/milestones/4-months.html'],
      ['6. ay basamakları ve ebeveyn etkinlikleri', 'https://www.cdc.gov/act-early/milestones/6-months.html'],
      ['9. ay basamakları ve ebeveyn etkinlikleri', 'https://www.cdc.gov/act-early/milestones/9-months.html'],
      ['1 yaş basamakları ve ebeveyn etkinlikleri', 'https://www.cdc.gov/act-early/milestones/1-year.html'],
    ],
  },
  {
    badge: 'AAP',
    bg: '#F3E7C9',
    fg: '#6B5112',
    name: 'Amerikan Pediatri Akademisi',
    desc: 'Sırtüstü uyku, karnüstü oyun ve bebekle kitap paylaşma → güvenlik notları, kitap görevleri',
    links: [
      ['Sırtüstü uyku, karnüstü oyun', 'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/back-to-sleep-tummy-to-play.aspx'],
      ['Bebeğinle kitap paylaşmak (0–11 ay)', 'https://www.healthychildren.org/English/ages-stages/baby/Pages/how-to-share-books-with-your-baby.aspx'],
      ['6–8 aylıkla kitap paylaşmak', 'https://www.healthychildren.org/English/ages-stages/baby/Pages/How-to-Share-Books-with-Your-6-to-8-Month-Old.aspx'],
      ['9–11 aylıkla kitap paylaşmak', 'https://www.healthychildren.org/English/ages-stages/baby/Pages/How-to-Share-Books-with-Your-9-to-11-Month-Old.aspx'],
    ],
  },
  {
    badge: 'HCDC',
    bg: '#F1E6D6',
    fg: '#2F5443',
    name: 'Harvard Center on the Developing Child',
    desc: '“Servis-dönüş”ün 5 adımı → servis-dönüş kartları, İngilizce koç ipuçları',
    links: [
      ['Servis-dönüşün 5 adımı', 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/HCDC_ServeReturn_for_Parents_Caregivers_2019.pdf'],
    ],
  },
  {
    badge: 'JSLHR',
    bg: '#E3E9F3',
    fg: '#33507F',
    name: 'Journal of Speech, Language, and Hearing Research (2023)',
    desc: 'Çift dilli girdide dilleri karıştırma → İngilizce ve Türkçeyi etkinliğe göre ayırma kuralı',
    links: [['Çift dilli girdide dilleri birleştirme', 'https://pubs.asha.org/doi/10.1044/2023_JSLHR-23-00181']],
  },
  {
    badge: 'FAU',
    bg: '#F1E6D6',
    fg: '#4C463D',
    name: 'Florida Atlantic University',
    desc: 'Çift dilli çocuklarda dil gelişimi çalışması → her dilin gelişimi o dilde duyulan girdiye bağlıdır',
    links: [['Çift dilli çocuklarda dil gelişimi çalışması', 'https://www.fau.edu/newsdesk/articles/bilingual-language-study.php']],
  },
];
