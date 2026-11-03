import { getProfile, getNotes, addNote, deleteNote, getChecked, toggleChecked } from '../state.js';
import { CHECKPOINTS, checkpointFor } from '../data/milestones.js';
import { ageInMonths, milestoneMarkers } from '../logic/period.js';
import { CATEGORY } from '../categories.js';
import { tabbar } from '../nav.js';
import { openSheet } from '../sheet.js';

const WEEKDAY = ['Pa', 'Pz', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];
const NOTE_CATEGORIES = [
  ...['duygusal', 'dil', 'bilissel', 'hareket'].map((k) => ({ key: k, label: CATEGORY[k].label })),
  { key: 'genel', label: 'Genel' },
];
const WHO = { anne: 'Anne', baba: 'Baba' };
const CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

const fmt = (d) => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(d);
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function render(root) {
  const who = getProfile() ?? 'baba';
  const now = new Date();
  const cp = checkpointFor(ageInMonths(now));
  const upcoming = ageInMonths(now) < cp;

  const draw = () => {
    const scroll = window.scrollY;
    const notes = getNotes();
    const checked = getChecked();
    const markers = milestoneMarkers(now);
    const entries = [
      ...notes.map((n) => ({ kind: 'note', date: new Date(n.at), n })),
      ...markers.map((m) => ({ kind: 'marker', date: m.date, m })),
    ].sort((a, b) => b.date - a.date || (a.kind === 'note' ? -1 : 1));

    const days = Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + i));
    const groups = CHECKPOINTS[cp];
    const total = groups.reduce((n, g) => n + g.items.length, 0);
    const doneCount = groups.reduce((n, g) => n + g.items.filter((it) => checked[it.id]).length, 0);

    const dateLabel = (d) => (sameDay(d, now) ? 'Bugün' : fmt(d));

    root.innerHTML = `
      <main class="screen gelisim">
        <div class="gel-band">
          <h1>Aslan'ın Gelişim Yolculuğu</h1>
          <div class="week" aria-label="Son yedi gün">
            ${days
              .map((d) => {
                const isToday = sameDay(d, now);
                const has = entries.some((e) => sameDay(e.date, d));
                return `<div><span class="wd">${WEEKDAY[d.getDay()]}</span><span class="dn${isToday ? ' is-today' : ''}">${d.getDate()}</span><span class="dot" style="background:${has ? 'var(--peach-accent)' : isToday ? 'var(--green)' : 'transparent'}"></span></div>`;
              })
              .join('')}
          </div>
        </div>

        <div class="gel-body">
          <div class="timeline">
            ${entries
              .map((e, i) => {
                const last = i === entries.length - 1;
                const rail = `<div class="tl-rail"><span class="tl-node${i === 0 ? ' is-now' : ''}"></span>${last ? '' : '<span class="tl-line"></span>'}</div>`;
                if (e.kind === 'marker') {
                  return `<div class="tl-row">${rail}<article class="entry entry--marker"><span class="entry-label">${fmt(e.date)} · Kilometre taşı</span><span class="entry-title">${e.m.label}</span></article></div>`;
                }
                const cat = NOTE_CATEGORIES.find((c) => c.key === e.n.category)?.label ?? 'Genel';
                return `<div class="tl-row">${rail}<article class="entry"><span class="entry-label">${dateLabel(e.date)} · ${cat}${WHO[e.n.by] ? ' · ' + WHO[e.n.by] : ''}</span><span class="entry-title">${esc(e.n.title)}</span>${e.n.text ? `<span class="entry-text">${esc(e.n.text)}</span>` : ''}<button class="entry-del" data-del="${esc(e.n.id)}" aria-label="Notu sil: ${esc(e.n.title)}">Sil</button></article></div>`;
              })
              .join('')}
          </div>

          <button class="btn-primary" data-new>Yeni not ekle</button>

          <div class="check-head">
            <h2>${upcoming ? `${cp}. aya doğru gözle` : `${cp}. ay gözlem listesi`}</h2>
            <span>${doneCount}/${total} gözlendi</span>
          </div>

          ${groups
            .map(
              (g) => `
            <section class="check-group">
              <span class="pill" style="background:var(--tag-${g.cat}-bg);color:var(--tag-${g.cat}-fg)">${g.title}</span>
              ${g.items
                .map(
                  (it) => `
                <button class="check-item" data-item="${it.id}" aria-pressed="${!!checked[it.id]}">
                  <span class="box${checked[it.id] ? ' is-on' : ''}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></span>
                  <span>${it.label}</span>
                </button>`
                )
                .join('')}
            </section>`
            )
            .join('')}

          <p class="gel-note">Her bebek kendi hızında gelişir. Bu liste bir sınav değil, doktorla konuşmak için not tutmaya yarar. Bir dönemin basamaklarının belirgin kısmı görülmüyorsa ya da kazanılmış bir beceri kaybolursa, ya da içiniz rahat değilse beklemeden çocuk doktoruna danışın. Kaynak: CDC</p>

          ${tabbar('#/gelisim')}
        </div>
      </main>`;

    root.querySelectorAll('[data-item]').forEach((b) =>
      b.addEventListener('click', () => {
        toggleChecked(b.dataset.item);
        draw();
      })
    );
    root.querySelectorAll('[data-del]').forEach((b) =>
      b.addEventListener('click', () => {
        if (window.confirm('Bu not silinsin mi?')) {
          deleteNote(b.dataset.del);
          draw();
        }
      })
    );
    root.querySelector('[data-new]').addEventListener('click', (e) => openNoteSheet(e.currentTarget, who, draw));
    window.scrollTo(0, scroll);
  };

  draw();
}

function openNoteSheet(opener, who, onSaved) {
  let category = 'genel';
  const { el, close } = openSheet(
    `
    <header class="coach-head">
      <div><h2 id="note-title">Yeni not</h2></div>
      <button class="sheet-close" data-close aria-label="Kapat">${CLOSE}</button>
    </header>
    <form class="note-form">
      <div class="chips-row" role="radiogroup" aria-label="Kategori">
        ${NOTE_CATEGORIES.map((c) => `<button type="button" role="radio" data-cat="${c.key}" aria-checked="false">${c.label}</button>`).join('')}
      </div>
      <label>Başlık<input name="title" maxlength="60" required autocomplete="off" data-autofocus></label>
      <label>Not (isteğe bağlı)<textarea name="text" rows="4" maxlength="500"></textarea></label>
      <button class="btn-primary" type="submit">Kaydet</button>
    </form>`,
    { opener, labelledBy: 'note-title' }
  );

  const setCat = () => el.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.cat === category)));
  el.querySelectorAll('[data-cat]').forEach((b) =>
    b.addEventListener('click', () => {
      category = b.dataset.cat;
      setCat();
    })
  );
  setCat();

  el.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const title = f.elements.title.value.trim();
    if (!title) return;
    addNote({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: new Date().toISOString(), by: who, category, title, text: f.elements.text.value.trim() });
    close();
    onSaved();
  });
}
