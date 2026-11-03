// Alttan açılan panel: Esc, dışına dokunma ve [data-close] ile kapanır, odağı geri verir.
export function openSheet(html, { opener, onClose, labelledBy } = {}) {
  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';
  backdrop.innerHTML = `<section class="sheet" role="dialog" aria-modal="true"${labelledBy ? ` aria-labelledby="${labelledBy}"` : ''}>${html}</section>`;

  const close = () => {
    onClose?.();
    document.removeEventListener('keydown', onKey);
    document.body.classList.remove('sheet-open');
    backdrop.remove();
    opener?.focus();
  };
  const onKey = (e) => e.key === 'Escape' && close();

  backdrop.addEventListener('click', (e) => e.target === backdrop && close());
  backdrop.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', onKey);
  document.body.classList.add('sheet-open');
  document.body.appendChild(backdrop);
  (backdrop.querySelector('[data-autofocus]') ?? backdrop.querySelector('[data-close]'))?.focus();
  return { el: backdrop, close };
}
