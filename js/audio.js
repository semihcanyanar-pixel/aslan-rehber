// Kadın sesi tercih edilir; bilinen erkek sesleri yedekte bile seçilmez (başka ses yoksa hariç).
const PREFERRED = ['Samantha', 'Ava', 'Allison', 'Nicky', 'Joelle', 'Zira', 'Aria', 'Jenny', 'Google US English'];
const MALE = /\b(David|Mark|Alex|Fred|Daniel|Evan|Tom|Aaron|Guy|Eric|Roger|Reed|Rocko|Grandpa)\b/i;
let current = null;

export const canSpeak = () => 'speechSynthesis' in window;

function usVoice() {
  const voices = speechSynthesis.getVoices().filter((v) => /^en[-_]US$/i.test(v.lang));
  for (const name of PREFERRED) {
    const v = voices.find((x) => x.name.includes(name));
    if (v) return v;
  }
  const rest = voices.filter((v) => !MALE.test(v.name));
  return rest.find((v) => v.localService) ?? rest[0] ?? voices[0] ?? null;
}

function speakTts(text) {
  if (!canSpeak()) return false;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  const v = usVoice();
  if (v) u.voice = v;
  u.rate = 0.85;
  u.pitch = 1.05;
  speechSynthesis.speak(u);
  return true;
}

export function stopSpeaking() {
  if (current) {
    current.pause();
    current = null;
  }
  if (canSpeak()) speechSynthesis.cancel();
}

// Dosyayı fetch ile alıp blob olarak çalar: iOS'ta servis çalışanı önbelleğindeki sesler
// doğrudan <audio src> ile (Range isteği yüzünden) bozulabilir.
async function playFile(src, fallbackText) {
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error(res.status);
    const url = URL.createObjectURL(await res.blob());
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    current = audio;
    await audio.play();
  } catch {
    speakTts(fallbackText);
  }
}

// Kendi sesini kaydet ve dinle. Kayıt yalnızca bellekte tutulur, hiçbir yere gönderilmez.
let recorder = null;
let recUrl = null;

export const canRecord = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
export const isRecording = () => recorder?.state === 'recording';

export async function startRecording(onDone, maxMs = 6000) {
  stopSpeaking();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const chunks = [];
  const rec = new MediaRecorder(stream);
  recorder = rec;
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  rec.onstop = () => {
    clearTimeout(rec.timer);
    stream.getTracks().forEach((t) => t.stop());
    onDone(new Blob(chunks, { type: rec.mimeType }));
  };
  rec.timer = setTimeout(stopRecording, maxMs);
  rec.start();
}

export function stopRecording() {
  if (isRecording()) recorder.stop();
}

export function playBlob(blob) {
  if (recUrl) URL.revokeObjectURL(recUrl);
  recUrl = URL.createObjectURL(blob);
  current = new Audio(recUrl);
  current.play().catch(() => {});
}

// Ses dosyası varsa onu, yoksa cihaz sesini kullanır. Çalamazsa false döner.
export function speak(phrase) {
  stopSpeaking();
  if (phrase.audio) {
    playFile(phrase.audio, phrase.en);
    return true;
  }
  return speakTts(phrase.en);
}
