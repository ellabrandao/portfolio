const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const designMore = document.getElementById("designMore");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  document.querySelectorAll(".menu a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      menuToggle.classList.remove("active");
    });
  });
}

const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.88;

  reveals.forEach((element) => {
    const boxTop = element.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      element.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* FILTRO ENTRE SITES E DESIGN */
const filterButtons = document.querySelectorAll(".filter-btn");
const sitesCarousel = document.getElementById("sitesCarousel");
const designGrid = document.getElementById("designGrid");

function applyFilter(filter) {
  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-filter") === filter);
  });

  if (sitesCarousel) {
    sitesCarousel.style.display = filter === "web" ? "block" : "none";
  }

  if (designGrid) {
    designGrid.style.display = filter === "design" ? "grid" : "none";
  }

  if (designMore) {
    designMore.style.display = filter === "design" ? "flex" : "none";
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");
    applyFilter(filter);
  });
});

/* COMEÇA MOSTRANDO SITES */
applyFilter("web");

/* CARROSSEL - AUTO + DOTS + DRAG */
const track = document.getElementById("carouselTrack");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const dotsContainer = document.getElementById("carouselDots");
const carousel = document.getElementById("sitesCarousel");

if (track && prevSlide && nextSlide && carousel) {
  const slides = Array.from(track.children);
  let currentIndex = 0;
  let autoPlay;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  function getVisibleSlides() {
    return window.innerWidth <= 768 ? 1 : 2;
  }

  function getTotalPages() {
    return Math.ceil(slides.length / getVisibleSlides());
  }

  function getMaxIndex() {
    return Math.max(0, getTotalPages() - 1);
  }

  function getStepPercent() {
    return 100;
  }

  function updateDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";

    for (let i = 0; i < getTotalPages(); i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
      if (i === currentIndex) dot.classList.add("active");

      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
        restartAutoPlay();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    const translateValue = currentIndex * getStepPercent();
    track.style.transform = `translateX(-${translateValue}%)`;
    updateDots();
  }

  function nextCarousel() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateCarousel();
  }

  function prevCarousel() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateCarousel();
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlay = setInterval(() => {
      nextCarousel();
    }, 3500);
  }

  function stopAutoPlay() {
    if (autoPlay) clearInterval(autoPlay);
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  nextSlide.addEventListener("click", () => {
    nextCarousel();
    restartAutoPlay();
  });

  prevSlide.addEventListener("click", () => {
    prevCarousel();
    restartAutoPlay();
  });

  carousel.addEventListener("mouseenter", stopAutoPlay);
  carousel.addEventListener("mouseleave", startAutoPlay);

  /* DRAG / SWIPE */
  function dragStart(clientX) {
    isDragging = true;
    startX = clientX;
    prevTranslate = -currentIndex * getStepPercent();
    track.classList.add("dragging");
  }

  function dragMove(clientX) {
    if (!isDragging) return;

    const moveX = clientX - startX;
    const containerWidth = track.parentElement.offsetWidth;
    const movePercent = (moveX / containerWidth) * 100;

    currentTranslate = prevTranslate + movePercent;
    track.style.transform = `translateX(${currentTranslate}%)`;
  }

  function dragEnd() {
    if (!isDragging) return;

    isDragging = false;
    track.classList.remove("dragging");

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -10) {
      currentIndex = Math.min(currentIndex + 1, getMaxIndex());
    } else if (movedBy > 10) {
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    updateCarousel();
    restartAutoPlay();
  }

  track.addEventListener("mousedown", (e) => {
    dragStart(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    dragMove(e.clientX);
  });

  window.addEventListener("mouseup", dragEnd);

  track.addEventListener(
    "touchstart",
    (e) => {
      dragStart(e.touches[0].clientX);
    },
    { passive: true },
  );

  track.addEventListener(
    "touchmove",
    (e) => {
      dragMove(e.touches[0].clientX);
    },
    { passive: true },
  );

  track.addEventListener("touchend", dragEnd);

  window.addEventListener("resize", () => {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    updateCarousel();
  });

  updateCarousel();
  startAutoPlay();
}

/* LIGHTBOX */

const galleries = {
  posters: [
    "imagens/poster1.png",
    "imagens/poster2.png",
    "imagens/poster3.png",
    "imagens/poster4.png",
    "imagens/poster5.png",
    "imagens/poster6.png",
    "imagens/poster7.png",
  ],

  banners: [
    "imagens/banner1.png",
    "imagens/banner2.png",
    "imagens/banner3.png",
    "imagens/banner4.png",
    "imagens/banner5.png",
    "imagens/banner6.png",
  ],

  socialmedia: [
    "imagens/socialmedia1.png",
    "imagens/socialmedia2.png",
    "imagens/socialmedia3.png",
  ],

  layouts: [
    "imagens/layout1.png",
    "imagens/layout2.png",
    "imagens/layout3.png",
    "imagens/layout4.png",
    "imagens/layout5.png",
    "imagens/layout6.png",
    "imagens/layout7.png",
  ],
};

const lightbox = document.getElementById("lightbox");
const overlay = document.getElementById("lightboxOverlay");
const closeBtn = document.getElementById("lightboxClose");
const galleryContainer = document.getElementById("lightboxGallery");

const openButtons = document.querySelectorAll(".project-open");

openButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-gallery");
    const images = galleries[key];

    if (!images) return;

    galleryContainer.innerHTML = "";

    images.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      galleryContainer.appendChild(img);
    });

    lightbox.classList.remove("lightbox-banners", "lightbox-layouts");

    if (key === "banners") {
      lightbox.classList.add("lightbox-banners");
    }

    if (key === "layouts") {
      lightbox.classList.add("lightbox-layouts");
    }

    lightbox.classList.add("active");
    document.body.classList.add("lightbox-open");
  });
});

function closeLightbox() {
  lightbox.classList.remove("active", "lightbox-banners", "lightbox-layouts");
  document.body.classList.remove("lightbox-open");
}

if (overlay) {
  overlay.addEventListener("click", closeLightbox);
}
if (closeBtn) {
  closeBtn.addEventListener("click", closeLightbox);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
  }
});

/* IMAGE ZOOM */

const viewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("imageViewerImg");
const viewerOverlay = document.getElementById("imageViewerOverlay");

document.addEventListener("click", (e) => {
  if (e.target.closest(".lightbox-gallery img")) {
    const src = e.target.src;

    viewerImg.src = src;
    viewer.classList.add("active");
  }
});

function closeViewer() {
  viewer.classList.remove("active");
  viewerImg.src = "";
}

if (viewerOverlay) {
  viewerOverlay.addEventListener("click", closeViewer);
}

if (viewerImg) {
  viewerImg.addEventListener("click", closeViewer);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeViewer();
  }
});
