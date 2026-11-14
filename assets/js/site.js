// Site-wide behaviour. Navigation is plain links; page fades are handled by
// CSS view transitions (see mystyle.css), so nothing here intercepts clicks.

(function () {
  const scroller = document.querySelector('.simplebar-content-wrapper');
  const header = document.querySelector('.header');
  const key = 'scroll:' + location.pathname;

  // The page scrolls inside SimpleBar's container, not the window, so the
  // browser can't remember the position by itself. Save it when leaving and
  // put it back when the person returns with Back/Forward or reloads.
  addEventListener('pagehide', () => {
    try { sessionStorage.setItem(key, String(scroller.scrollTop)); } catch (e) {}
  });
  const nav = performance.getEntriesByType('navigation')[0];
  if (nav && (nav.type === 'back_forward' || nav.type === 'reload')) {
    let y = 0;
    try { y = Number(sessionStorage.getItem(key)) || 0; } catch (e) {}
    if (y > 0) {
      scroller.scrollTop = y;
      // If the page wasn't tall enough yet (media still loading), try again once loaded.
      if (scroller.scrollTop < y) addEventListener('load', () => { scroller.scrollTop = y; }, { once: true });
    }
  }

  // The header normally stays perfectly still during a page transition. If it
  // has been scrolled out of view, let it fade with the rest of the page
  // instead of sliding in from where it was.
  const releaseHeaderIfScrolled = () => {
    if (scroller.scrollTop > header.offsetHeight) header.style.viewTransitionName = 'none';
  };
  addEventListener('pageswap', releaseHeaderIfScrolled);   // page being left
  addEventListener('pagereveal', releaseHeaderIfScrolled); // page being shown

  // Fallback fade for browsers without cross-document view transitions:
  // fade the content out, then follow the link (the next page fades in via CSS).
  // Only plain left clicks on same-site links; middle/ctrl/shift clicks and
  // links opening elsewhere are left completely alone.
  const root = document.documentElement;
  if (root.classList.contains('js-fade')) {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest('a[href]');
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname.startsWith('/admin')) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page / #anchor
      e.preventDefault();
      root.classList.add('js-fading-out');
      setTimeout(() => { location.href = url.href; }, 300);
    });
    // Coming back with Back from the browser's page cache: show the page again.
    addEventListener('pageshow', (e) => { if (e.persisted) root.classList.remove('js-fading-out'); });
  }
})();

function toggleCollapsible(sendingElement) {
  sendingElement.classList.toggle('activeCollapsible');
  const content = sendingElement.nextElementSibling;
  content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
}

function clipboard(data, message) {
  navigator.clipboard.writeText(data);
  const alert = document.querySelector('#copied');
  alert.innerHTML = '<p class="textbox copied">' + message + '</p>';
  alert.style.display = 'inline';
}
