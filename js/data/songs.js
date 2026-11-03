// İngilizce şarkı örnekleri (yaş grubuna göre). Ebeveyn için: melodiyi dinle, kendin söyle.
// Aslan'a ekran gösterilmez (1 yaş altı için ekran önerilmez, WHO); bu yüzden gömme oynatıcı yok, yalnızca "YouTube'da aç" bağlantısı.
// Kanal: Super Simple Songs (çocuk şarkıları). Bu bir sağlık kuruluşu kaynağı değil, şarkı örneğidir.
// YouTube kimlikleri oEmbed ile doğrulandı (3 Kasım 2026).
const CH = 'Super Simple Songs';
const s = (id, title, note) => ({ id, title, note, channel: CH });

export const SONGS = {
  '0-3': [
    s('yCjJyiqpAuU', 'Twinkle Twinkle Little Star', 'Sakin tempo, uyku öncesi.'),
    s('f_raDpgx_3M', 'Hush Little Baby', 'Ninni; kucakta söylemek için.'),
    s('7otAJa3jui8', 'Row Row Row Your Boat (bedtime)', 'Ritmik, sallanarak söylenir.'),
  ],
  '4-6': [
    s('bne3Ix_tJL8', 'The Eensy Weensy Spider', 'Parmak hareketleriyle.'),
    s('jdg50KzCR9w', 'Pat-A-Cake', 'El çırpma oyunu.'),
    s('GzrjwOQpAl0', 'The Wheels On The Bus', 'Sesler ve hareketler eklenebilir.'),
  ],
  '7-9': [
    s('RuqvGiZi0qg', 'Head Shoulders Knees And Toes', 'Vücut bölümlerine dokunarak.'),
    s('l4WNrvVjiTw', 'If You’re Happy', 'Alkış ve jest oyunu.'),
    s('_6HzoUcx3eo', 'Old MacDonald Had A Farm', 'Hayvan sesleri.'),
  ],
  '10-12': [
    s('9UasekNr8KI', 'The Wheels On The Bus', 'Birlikte hareket ederek.'),
    s('M6LoRZsHMSs', 'If You’re Happy And You Know It', 'Taklit ve alkış.'),
    s('5oYKonYBujg', 'Old MacDonald Had A Farm', 'Hayvan sesleri; bebek taklit eder.'),
    s('fXFg5QsTcLQ', 'The Muffin Man', 'Basit, tekrarlı sözler.'),
  ],
};

export const songUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
