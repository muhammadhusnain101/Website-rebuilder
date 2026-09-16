document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.getElementById('primary-menu');
  const searchToggle = document.querySelector('.search-toggle');
  const searchModal = document.getElementById('search-modal');
  const modalCloseBtn = searchModal.querySelector('.modal-close');
  const searchInput = searchModal.querySelector('#search-input');
  const resetButton = searchModal.querySelector('.reset-button');

  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
    if (!expanded) {
      primaryNav.style.display = 'flex';
      primaryNav.focus();
    } else {
      primaryNav.style.display = 'none';
    }
  });

  // Toggle search modal
  function openSearch() {
    searchModal.setAttribute('aria-hidden', 'false');
    searchInput.focus();
  }
  function closeSearch() {
    searchModal.setAttribute('aria-hidden', 'true');
    searchInput.value = '';
    resetButton.style.display = 'none';
  }
  searchToggle.addEventListener('click', () => {
    const visible = searchModal.getAttribute('aria-hidden') === 'false';
    if (visible) {
      closeSearch();
    } else {
      openSearch();
    }
  });
  modalCloseBtn.addEventListener('click', closeSearch);
  searchModal.querySelector('.modal-overlay').addEventListener('click', closeSearch);

  // Show/hide reset button in search
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() !== '') {
      resetButton.style.display = 'block';
    } else {
      resetButton.style.display = 'none';
    }
  });

  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    resetButton.style.display = 'none';
    searchInput.focus();
  });

  // Slideshow variables
  const slideshow = document.querySelector('.slideshow');
  const slideLink = slideshow.querySelector('.slide-link');
  const prevBtn = slideshow.querySelector('.nav-arrow.prev');
  const nextBtn = slideshow.querySelector('.nav-arrow.next');
  const dotsContainer = slideshow.querySelector('.dots');

  // Since the reference had a single slide, this is basic setup for future slides
  let currentSlideIndex = 0;
  const slides = [
    {
      desktopImage: 'https://rangolistore.pk/cdn/shop/files/Rangoli_Banner_jpg.jpg?v=1774949333&width=2000',
      mobileImage: 'https://rangolistore.pk/cdn/shop/files/Rangoli_Banner_mob_jpg.jpg?v=1774954542&width=1000',
      href: 'https://rangolistore.pk/collections/new-arrivals-26',
      alt: 'Rangoli Store Summer Collection Banner'
    }
  ];

  function updateSlideshow(index) {
    currentSlideIndex = index;
    const slide = slides[index];
    // Update slide image link
    slideLink.href = slide.href;

    // Update picture element images
    const picture = slideLink.querySelector('picture');
    const source = picture.querySelector('source');
    const img = picture.querySelector('img');
    source.srcset = slide.mobileImage;
    img.src = slide.desktopImage;
    img.alt = slide.alt;

    // Update dots active state
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Initialize dots (based on slides array)
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.className = i === 0 ? 'dot active' : 'dot';
    dot.addEventListener('click', () => updateSlideshow(i));
    dotsContainer.appendChild(dot);
  });

  prevBtn.addEventListener('click', () => {
    let idx = currentSlideIndex - 1;
    if (idx < 0) idx = slides.length - 1;
    updateSlideshow(idx);
  });
  nextBtn.addEventListener('click', () => {
    let idx = currentSlideIndex + 1;
    if (idx >= slides.length) idx = 0;
    updateSlideshow(idx);
  });

  // Initial update
  updateSlideshow(0);
});
