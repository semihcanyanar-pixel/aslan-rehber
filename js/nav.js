// Alt menü. Yapılmamış sekmeler soluk ve tıklanamaz; ekranı yapınca built: true yap.
const NAV = [
  { href: '#/bugun', label: 'Bugün', built: true, path: 'M4 11l8-7 8 7v9H4z' },
  { href: '#/gelisim', label: 'Gelişim', built: true, path: 'M3 20h18M6 16v-5M11 16V8M16 16v-9M21 16V5' },
  { href: '#/takip', label: 'Takip', built: true, path: 'M12 3a9 9 0 1 0 9 9h-9z M15 3.5A9 9 0 0 1 20.5 9H15z' },
  { href: '#/ingilizce', label: 'İngilizce', built: true, path: 'M4 5h16v11H9l-5 4z M8 10h8M8 13h5' },
  { href: '#/kaynaklar', label: 'Kaynaklar', built: true, path: 'M4 5c3-1 6 0 8 2 2-2 5-3 8-2v13c-3-1-6 0-8 2-2-2-5-3-8-2z M12 7v13' },
];

export function tabbar(active) {
  return `<nav class="tabbar" aria-label="Ana menü">${NAV.map((n) => {
    const inner = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${n.path}"/></svg>${n.label}`;
    if (n.href === active) return `<a href="${n.href}" class="is-active" aria-current="page">${inner}</a>`;
    return n.built ? `<a href="${n.href}">${inner}</a>` : `<span class="soon" aria-disabled="true">${inner}</span>`;
  }).join('')}</nav>`;
}
