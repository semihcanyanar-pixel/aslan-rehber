import { TASKS } from '../data/tasks.js';
import { pickDay } from './pick.js';

const CATS = ['hareket', 'bilissel', 'dil', 'duygusal'];
const p2 = (n) => String(n).padStart(2, '0');
export const keyOf = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

// Bir günün planı ile yapılanı: scope 'anne' | 'baba' | 'aile' (aile = iki ebeveynin planlarının birleşimi).
// Plan, şu anki seviye ayarlarıyla yeniden hesaplanır (geçmiş günler için seviye geçmişi tutulmaz).
export function dayStat({ date, scope, levels, done, catalog = TASKS }) {
  const parents = scope === 'aile' ? ['anne', 'baba'] : [scope];
  const planned = new Map();
  for (const parent of parents) {
    for (const { task } of pickDay({ date, parent, levels, catalog }).flatMap((s) => s.cards)) planned.set(task.id, task);
  }
  const doneSet = new Set(done);
  const byCategory = Object.fromEntries(CATS.map((c) => [c, { planned: 0, done: 0 }]));
  let doneCount = 0;
  for (const t of planned.values()) {
    byCategory[t.category].planned++;
    if (doneSet.has(t.id)) {
      doneCount++;
      byCategory[t.category].done++;
    }
  }
  return { key: keyOf(date), date: startOfDay(date), planned: planned.size, done: doneCount, rate: planned.size ? doneCount / planned.size : 0, byCategory };
}

// Doğumdan bugüne (dahil) günlük istatistikler, eskiden yeniye.
export function daySeries({ birthISO, today = new Date(), scope, levels, getDone, catalog = TASKS }) {
  const first = startOfDay(new Date(birthISO + 'T00:00:00'));
  const last = startOfDay(today);
  const out = [];
  for (let d = first; d <= last; d = addDays(d, 1)) {
    out.push(dayStat({ date: d, scope, levels, done: getDone(keyOf(d)), catalog }));
  }
  return out;
}

const sum = (days) => days.reduce((a, d) => ({ planned: a.planned + d.planned, done: a.done + d.done }), { planned: 0, done: 0 });
const rateOf = (s) => (s.planned ? s.done / s.planned : 0);

const mondayOf = (d) => addDays(startOfDay(d), -((d.getDay() + 6) % 7));

// Günleri gruplar (hafta: pazartesi başlar, ay: takvim ayı). Oran = yapılan toplam / planlanan toplam.
export function groupSeries(days, mode) {
  const groups = new Map();
  for (const d of days) {
    const start = mode === 'hafta' ? mondayOf(d.date) : new Date(d.date.getFullYear(), d.date.getMonth(), 1);
    const k = keyOf(start);
    if (!groups.has(k)) groups.set(k, { key: k, start, days: [] });
    groups.get(k).days.push(d);
  }
  return [...groups.values()].map((g) => {
    const s = sum(g.days);
    return { key: g.key, start: g.start, dayCount: g.days.length, ...s, rate: rateOf(s) };
  });
}

// Özet kartları. today: dizinin son günü (bugün).
export function summary(days) {
  if (!days.length) return null;
  const today = days[days.length - 1];
  const weekStart = mondayOf(today.date);
  const monthStart = new Date(today.date.getFullYear(), today.date.getMonth(), 1);
  const inRange = (from) => days.filter((d) => d.date >= from);
  const week = sum(inRange(weekStart));
  const month = sum(inRange(monthStart));
  const total = sum(days);

  // Seri: ardışık "aktif" gün (en az bir görev). Bugün henüz başlamadıysa dünden sayılır.
  let i = days.length - 1;
  if (days[i].done === 0) i--;
  let streak = 0;
  for (; i >= 0 && days[i].done > 0; i--) streak++;

  const best = days.reduce((b, d) => (d.planned && d.rate > (b?.rate ?? -1) ? d : b), null);
  const faithful = days.filter((d) => d.planned && d.rate >= 0.7 && d.date < today.date).length;
  const past = days.filter((d) => d.date < today.date).length;

  const last30 = days.slice(-30);
  const categories = Object.fromEntries(
    CATS.map((c) => {
      const s = last30.reduce((a, d) => ({ planned: a.planned + d.byCategory[c].planned, done: a.done + d.byCategory[c].done }), { planned: 0, done: 0 });
      return [c, { ...s, rate: rateOf(s) }];
    })
  );

  return {
    today,
    week: { ...week, rate: rateOf(week) },
    month: { ...month, rate: rateOf(month) },
    total: { ...total, rate: rateOf(total) },
    streak,
    best,
    faithfulDays: faithful,
    pastDays: past,
    categories,
  };
}
