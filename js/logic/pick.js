import { TASKS, PERIOD_ORDER } from '../data/tasks.js';
import { periodOf } from './period.js';

export const SLOTS = ['sabah', 'ogle', 'aksam'];

// Seviye, dilim başına dil/bilişsel/duygusal kart sayısını belirler.
// Fiziksel kartlar seviyeden bağımsızdır (aşağıdaki PHYSICAL).
export const COUNTS = {
  rahat: { sabah: 1, ogle: 1, aksam: 1 },
  dengeli: { sabah: 1, ogle: 2, aksam: 1 },
  zengin: { sabah: 2, ogle: 3, aksam: 2 },
};
export const PHYSICAL = { sabah: 1, ogle: 1, aksam: 0 };

export function dayNumber(date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

export function eligible(task, parent) {
  if (parent === 'anne') return task.lang !== 'en' && task.owner !== 'baba';
  return task.owner !== 'anne';
}

function rotate(list, start, n) {
  const out = [];
  for (let i = 0; i < Math.min(n, list.length); i++) out.push(list[(start + i) % list.length]);
  return out;
}

// Dönem + ebeveyn + seviye + gün -> dilim dilim kartlar. Rastgelelik yok: aynı gün aynı sonuç.
export function pickDay({ date, parent, levels, catalog = TASKS }) {
  const d = dayNumber(date);
  const period = periodOf(date);
  const level = levels[period] ?? 'dengeli';
  const tiers = level === 'zengin' ? ['temel', 'zengin'] : ['temel'];
  const mine = catalog.filter((t) => t.period === period && eligible(t, parent));
  const used = new Set();
  const take = (t, extra) => {
    used.add(t.id);
    return { task: t, ...extra };
  };

  const physicalPool = mine.filter((t) => t.category === 'hareket' && t.tier === 'temel');
  const pool = mine.filter((t) => t.category !== 'hareket' && tiers.includes(t.tier));
  const nextPeriod = PERIOD_ORDER[PERIOD_ORDER.indexOf(period) + 1];
  const stretchPool =
    level === 'zengin' && nextPeriod
      ? catalog.filter(
          (t) => t.period === nextPeriod && t.tier === 'temel' && (t.category === 'dil' || t.category === 'bilissel') && t.lang !== 'en' && eligible(t, parent)
        )
      : [];

  let physicalIndex = 0;
  const days = SLOTS.map((slot) => {
    const cards = [];

    for (let i = 0; i < PHYSICAL[slot] && physicalPool.length; i++) {
      cards.push(take(physicalPool[(d * 2 + physicalIndex++) % physicalPool.length]));
    }

    const n = COUNTS[level][slot];
    const own = pool.filter((t) => t.slot === slot && !used.has(t.id));
    let picks = rotate(own, (d * n) % Math.max(own.length, 1), n);
    if (picks.length < n) {
      const spare = pool.filter((t) => !used.has(t.id) && !picks.includes(t));
      picks = picks.concat(rotate(spare, d % Math.max(spare.length, 1), n - picks.length));
    }
    picks.forEach((t) => cards.push(take(t)));

    // Zengin: öğle diliminin son kartı bir üst dönemden (bebek ilgiliyse) bir dil/bilişsel madde olur.
    if (slot === 'ogle' && stretchPool.length) {
      const s = stretchPool[d % stretchPool.length];
      cards[cards.length - 1] = { task: s, stretch: true };
      used.add(s.id);
    }

    return { slot, cards };
  });

  // Baba her gün en az bir İngilizce kart görür: yoksa o günün İngilizce maddesi,
  // kendi diliminde ilk fiziksel olmayan (üst dönem olmayan) kartın yerine geçer.
  if (parent === 'baba' && !days.some((s) => s.cards.some((c) => c.task.lang === 'en'))) {
    const enPool = mine.filter((t) => t.lang === 'en');
    if (enPool.length) {
      const en = enPool[d % enPool.length];
      const slot = days.find((s) => s.slot === en.slot);
      const i = slot.cards.findIndex((c) => c.task.category !== 'hareket' && !c.stretch);
      if (i >= 0) slot.cards[i] = { task: en };
    }
  }
  return days;
}
