// Firestore belgesi (family/main) ile yerel veri arasında dönüşüm. Saf fonksiyonlar, tarayıcı gerektirmez.
//
// Belge şekli:
//   baby:       { birth: 'YYYY-AA-GG' }
//   settings:   { levels: { '0-3': 'dengeli', ... } }
//   done:       { 'YYYY-AA-GG': [görevId, ...] }
//   notes:      { [noteId]: { id, at, by, category, title, text } }
//   milestones: { [maddeId]: true }

const LEVEL_NAMES = ['rahat', 'dengeli', 'zengin'];
const PERIOD_KEYS = ['0-3', '4-6', '7-9', '10-12'];

export function remoteToLocal(doc = {}) {
  const levels = {};
  for (const k of PERIOD_KEYS) {
    const v = doc.settings?.levels?.[k];
    if (LEVEL_NAMES.includes(v)) levels[k] = v;
  }
  const done = {};
  for (const [date, ids] of Object.entries(doc.done ?? {})) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && Array.isArray(ids)) done[date] = ids.filter((x) => typeof x === 'string');
  }
  const notes = Object.values(doc.notes ?? {})
    .filter((n) => n && typeof n.id === 'string' && typeof n.title === 'string' && typeof n.at === 'string')
    .sort((a, b) => (a.at < b.at ? 1 : -1));
  const milestones = {};
  for (const [id, v] of Object.entries(doc.milestones ?? {})) if (v === true) milestones[id] = true;
  const birth = /^\d{4}-\d{2}-\d{2}$/.test(doc.baby?.birth ?? '') ? doc.baby.birth : null;
  return { birth, levels, done, notes, milestones };
}

export function localToRemote({ birth, levels, done, notes, milestones }) {
  const doc = {};
  if (birth) doc.baby = { birth };
  if (levels && Object.keys(levels).length) doc.settings = { levels };
  if (done && Object.keys(done).length) doc.done = done;
  if (notes?.length) doc.notes = Object.fromEntries(notes.map((n) => [n.id, n]));
  if (milestones && Object.keys(milestones).length) doc.milestones = milestones;
  return doc;
}
