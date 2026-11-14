// Lightbox for project images: click an image to view it large with its title
// below. Arrow keys / buttons / swipe move between the page's images, Esc or a
// click outside the image closes it.
(function () {
  const images = [...document.querySelectorAll('img[data-lightbox]')];
  if (!images.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML =
    '<figure class="lightbox-figure">' +
      '<img class="lightbox-img" alt="">' +
      '<figcaption class="lightbox-caption"><span class="lightbox-title"></span><span class="lightbox-count"></span></figcaption>' +
    '</figure>' +
    '<button class="lightbox-btn lightbox-prev" aria-label="previous">&#8249;</button>' +
    '<button class="lightbox-btn lightbox-next" aria-label="next">&#8250;</button>' +
    '<button class="lightbox-btn lightbox-close" aria-label="close">&#10005;</button>';
  document.body.appendChild(dialog);

  const big = dialog.querySelector('.lightbox-img');
  const title = dialog.querySelector('.lightbox-title');
  const count = dialog.querySelector('.lightbox-count');
  const single = images.length === 1;
  dialog.classList.toggle('lightbox-single', single);
  let index = 0;

  const srcOf = (img) => img.currentSrc || img.src;

  function show(n) {
    index = (n + images.length) % images.length;
    const img = images[index];
    big.src = srcOf(img);
    big.alt = img.alt;
    title.textContent = img.dataset.caption || '';
    count.textContent = single ? '' : (index + 1) + ' / ' + images.length;
    // Warm up the neighbours so arrowing through feels instant.
    [index - 1, index + 1].forEach((k) => {
      const neighbour = images[(k + images.length) % images.length];
      new Image().src = srcOf(neighbour);
    });
  }

  images.forEach((img, n) => {
    img.addEventListener('click', () => {
      show(n);
      dialog.showModal();
    });
  });

  dialog.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });

  // Swipe on touch screens; a plain click/tap outside the image closes.
  let startX = null, startY = null;
  dialog.addEventListener('pointerdown', (e) => { startX = e.clientX; startY = e.clientY; });
  dialog.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    startX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (!single) show(index + (dx < 0 ? 1 : -1));
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && !e.target.closest('.lightbox-img, .lightbox-btn, .lightbox-caption')) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => { big.removeAttribute('src'); });
})();
