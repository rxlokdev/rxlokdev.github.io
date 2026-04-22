function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    const original = btn.innerHTML;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 2000);
  });
}
