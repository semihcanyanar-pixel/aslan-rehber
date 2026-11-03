const PROFILE_KEY = 'aslan.profile';

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

// Tamamlanan görevler: gün başına id listesi. Firebase bağlanınca completions koleksiyonuna taşınacak.
export function dateKey(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

export function getDone(key) {
  try {
    const v = JSON.parse(localStorage.getItem('aslan.done.' + key) ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function toggleDone(key, id) {
  const done = getDone(key);
  const next = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
  try {
    localStorage.setItem('aslan.done.' + key, JSON.stringify(next));
  } catch {}
  return next;
}

// Gelişim notları ve işaretlenen gözlem basamakları. Firebase bağlanınca aile belgesine taşınacak.
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

export function getNotes() {
  const v = readJson('aslan.notes', []);
  return Array.isArray(v) ? v : [];
}

export function addNote(note) {
  const notes = [note, ...getNotes()];
  writeJson('aslan.notes', notes);
  return notes;
}

export function deleteNote(id) {
  const notes = getNotes().filter((n) => n.id !== id);
  writeJson('aslan.notes', notes);
  return notes;
}

export const getChecked = () => readJson('aslan.milestones', {}) ?? {};

export function toggleChecked(id) {
  const checked = { ...getChecked() };
  if (checked[id]) delete checked[id];
  else checked[id] = true;
  writeJson('aslan.milestones', checked);
  return checked;
}

// Ayarlar aile ayarıdır; Firebase bağlanınca aile belgesine taşınacak.
const LEVELS_KEY = 'aslan.levels';
const LEVEL_NAMES = ['rahat', 'dengeli', 'zengin'];
const DEFAULT_LEVELS = { '0-3': 'dengeli', '4-6': 'dengeli', '7-9': 'dengeli', '10-12': 'dengeli' };

export function getLevels() {
  try {
    const saved = JSON.parse(localStorage.getItem(LEVELS_KEY) ?? '{}');
    const levels = { ...DEFAULT_LEVELS };
    for (const k of Object.keys(levels)) if (LEVEL_NAMES.includes(saved[k])) levels[k] = saved[k];
    return levels;
  } catch {
    return { ...DEFAULT_LEVELS };
  }
}

export function setLevels(levels) {
  try {
    localStorage.setItem(LEVELS_KEY, JSON.stringify(levels));
  } catch {}
}
