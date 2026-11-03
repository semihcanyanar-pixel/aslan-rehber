// Yerel veri deposu (localStorage) + buluta yazma. Her değişiklik önce yerele yazılır (arayüz hemen güncellenir),
// giriş yapılmışsa sonra Firestore'a gönderilir. Bulut verisi geldiğinde applyRemote yerelin üstüne yazar.
import { cloud } from './cloud.js';
import { remoteToLocal, localToRemote } from './logic/sync.js';

const PROFILE_KEY = 'aslan.profile';
const BIRTH_KEY = 'aslan.birth';
const LEVELS_KEY = 'aslan.levels';
const NOTES_KEY = 'aslan.notes';
const MILESTONES_KEY = 'aslan.milestones';
const DONE_PREFIX = 'aslan.done.';
const LEVEL_NAMES = ['rahat', 'dengeli', 'zengin'];
const DEFAULT_LEVELS = { '0-3': 'dengeli', '4-6': 'dengeli', '7-9': 'dengeli', '10-12': 'dengeli' };

function readJson(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? 'null');
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Bu cihazda kimin kullandığı (anne/baba): cihaza özel, buluta gitmez.
export function getProfile() {
  try {
    const v = localStorage.getItem(PROFILE_KEY);
    return v === 'anne' || v === 'baba' ? v : null;
  } catch {
    return null;
  }
}

export function setProfile(who) {
  try {
    localStorage.setItem(PROFILE_KEY, who);
  } catch {}
}

export function getStoredBirth() {
  try {
    return localStorage.getItem(BIRTH_KEY);
  } catch {
    return null;
  }
}

export function saveBirth(iso) {
  try {
    localStorage.setItem(BIRTH_KEY, iso);
  } catch {}
  cloud.birth(iso);
}

export function dateKey(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

export function getDone(key) {
  const v = readJson(DONE_PREFIX + key, []);
  return Array.isArray(v) ? v : [];
}

export function toggleDone(key, id) {
  const done = getDone(key);
  const on = !done.includes(id);
  const next = on ? [...done, id] : done.filter((x) => x !== id);
  writeJson(DONE_PREFIX + key, next);
  cloud.done(key, id, on);
  return next;
}

export function getNotes() {
  const v = readJson(NOTES_KEY, []);
  return Array.isArray(v) ? v : [];
}

export function addNote(note) {
  const notes = [note, ...getNotes()];
  writeJson(NOTES_KEY, notes);
  cloud.note(note);
  return notes;
}

export function deleteNote(id) {
  const notes = getNotes().filter((n) => n.id !== id);
  writeJson(NOTES_KEY, notes);
  cloud.removeNote(id);
  return notes;
}

export const getChecked = () => readJson(MILESTONES_KEY, {}) ?? {};

export function toggleChecked(id) {
  const checked = { ...getChecked() };
  const on = !checked[id];
  if (on) checked[id] = true;
  else delete checked[id];
  writeJson(MILESTONES_KEY, checked);
  cloud.checked(id, on);
  return checked;
}

export function getLevels() {
  const saved = readJson(LEVELS_KEY, {});
  const levels = { ...DEFAULT_LEVELS };
  for (const k of Object.keys(levels)) if (LEVEL_NAMES.includes(saved[k])) levels[k] = saved[k];
  return levels;
}

export function setLevels(levels) {
  writeJson(LEVELS_KEY, levels);
  cloud.levels(levels);
}

// --- Bulut eşleme ---

function allDone() {
  const out = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(DONE_PREFIX)) {
        const ids = getDone(k.slice(DONE_PREFIX.length));
        if (ids.length) out[k.slice(DONE_PREFIX.length)] = ids;
      }
    }
  } catch {}
  return out;
}

// Sunucuda belge yoksa ilk doldurma için yerel verinin bulut biçimi.
export function localSnapshot() {
  const doc = localToRemote({
    birth: getStoredBirth(),
    levels: readJson(LEVELS_KEY, null),
    done: allDone(),
    notes: getNotes(),
    milestones: getChecked(),
  });
  return Object.keys(doc).length ? doc : null;
}

// Bulut verisi yerelin üstüne yazılır (bulut kazanır). Değişiklik varsa 'aslan:data' olayı yayınlanır.
export function applyRemote(remoteDoc) {
  const r = remoteToLocal(remoteDoc);
  const before = JSON.stringify([getStoredBirth(), readJson(LEVELS_KEY, {}), getNotes(), getChecked(), allDone()]);

  if (r.birth) {
    try {
      localStorage.setItem(BIRTH_KEY, r.birth);
    } catch {}
  }
  writeJson(LEVELS_KEY, r.levels);
  writeJson(NOTES_KEY, r.notes);
  writeJson(MILESTONES_KEY, r.milestones);
  try {
    const stale = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(DONE_PREFIX)) stale.push(k);
    }
    stale.forEach((k) => localStorage.removeItem(k));
  } catch {}
  for (const [date, ids] of Object.entries(r.done)) writeJson(DONE_PREFIX + date, ids);

  const after = JSON.stringify([getStoredBirth(), readJson(LEVELS_KEY, {}), getNotes(), getChecked(), allDone()]);
  if (before !== after) window.dispatchEvent(new Event('aslan:data'));
}

// Çıkışta bu cihazdaki aile verisini temizler (profil seçimi cihazda kalır).
export function clearFamilyData() {
  try {
    const drop = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith(DONE_PREFIX) || [BIRTH_KEY, LEVELS_KEY, NOTES_KEY, MILESTONES_KEY].includes(k))) drop.push(k);
    }
    drop.forEach((k) => localStorage.removeItem(k));
  } catch {}
}
