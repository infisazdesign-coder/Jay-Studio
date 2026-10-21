
/* =========================================
   JAY studio UK — INTERACTIVE FEATURES
   ========================================= */

// Automatically update copyright year
document.getElementById("year").textContent =
  new Date().getFullYear();

// -----------------------------------------
// MOBILE NAVIGATION
// -----------------------------------------

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

function closeMenu() {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// -----------------------------------------
// PORTFOLIO FILTERS
// -----------------------------------------

const filterButtons = document.querySelectorAll(".filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    portfolioItems.forEach((item, index) => {
      const matches =
        selectedCategory === "all" ||
        item.dataset.category === selectedCategory;

      item.classList.toggle("is-hidden", !matches);

      if (matches) {
        item.style.animationDelay = `${(index % 5) * 60}ms`;
      } else {
        item.style.animationDelay = "0ms";
      }
    });
  });
});

// -----------------------------------------
// FULL-SCREEN LIGHTBOX GALLERY
// -----------------------------------------

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxCount = document.getElementById("lightboxCount");

const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentImages = [];
let currentIndex = 0;
let lastFocusedElement = null;

function getVisibleImages() {
  return Array.from(portfolioItems).filter((item) => {
    return !item.classList.contains("is-hidden");
  });
}

function getImageTitle(item) {
  const heading = item.querySelector(".portfolio-caption h3");
  return heading ? heading.textContent.trim() : "JAY studio UK";
}

function showImage(index) {
  if (!currentImages.length) return;

  currentIndex =
    (index + currentImages.length) % currentImages.length;

  const item = currentImages[currentIndex];
  const image = item.querySelector("img");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = getImageTitle(item);

  lightboxCount.textContent =
    `${String(currentIndex + 1).padStart(2, "0")} / ` +
    `${String(currentImages.length).padStart(2, "0")}`;
}

function openLightbox(item) {
  currentImages = getVisibleImages();
  currentIndex = currentImages.indexOf(item);

  if (currentIndex < 0) return;

  lastFocusedElement = document.activeElement;

  showImage(currentIndex);

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");

  // Release the displayed image when the viewer closes
  lightboxImage.removeAttribute("src");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function showNextImage() {
  showImage(currentIndex + 1);
}

function showPreviousImage() {
  showImage(currentIndex - 1);
}

// Open photographs instead of navigating away from the page
portfolioItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    openLightbox(item);
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxNext.addEventListener("click", showNextImage);
lightboxPrev.addEventListener("click", showPreviousImage);

// Close when clicking the dark background
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowRight") {
    showNextImage();
  } else if (event.key === "ArrowLeft") {
    showPreviousImage();
  }
});

// Touch swipe navigation for mobile phones
let touchStartX = 0;
let touchStartY = 0;

lightbox.addEventListener("touchstart", (event) => {
  if (!event.changedTouches.length) return;

  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

lightbox.addEventListener("touchend", (event) => {
  if (!event.changedTouches.length) return;

  const differenceX =
    event.changedTouches[0].clientX - touchStartX;

  const differenceY =
    event.changedTouches[0].clientY - touchStartY;

  if (
    !lightbox.classList.contains("open") ||
    Math.abs(differenceX) < 60 ||
    Math.abs(differenceX) < Math.abs(differenceY)
  ) {
    return;
  }

  if (differenceX < 0) {
    showNextImage();
  } else {
    showPreviousImage();
  }
}, { passive: true });

// -----------------------------------------
// WHATSAPP ENQUIRIES
// -----------------------------------------

const whatsappLink = document.getElementById("whatsappLink");

// IMPORTANT: Replace this with your own number.
// UK example format: 447XXXXXXXXX
// Include country code; remove +, spaces and brackets.

const whatsappNumber = "07780583401";

const whatsappMessage =
  "Hi JAY studio UK! I'm interested in booking a photography session. Could you please share your packages and availability?";

if (/^\d{10,15}$/.test(whatsappNumber)) {
  whatsappLink.href =
    `https://wa.me/${whatsappNumber}?text=` +
    encodeURIComponent(whatsappMessage);

  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
} else {
  whatsappLink.href = "#contact";

  whatsappLink.addEventListener("click", (event) => {
    event.preventDefault();
    alert(
      "Please add your WhatsApp number in script.js before using this link."
    );
  });
}
