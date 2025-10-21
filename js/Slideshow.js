import { backgroundImages, characterImages, conceptImages, sceneImages, blurbs } from "./art.js";

window.addEventListener("DOMContentLoaded", () => {
  setupCarousel("backgrounds-slideshow", backgroundImages);
  setupCarousel("characters-slideshow", characterImages);
  setupCarousel("concepts-slideshow", conceptImages);
  setupCarousel("scenes-slideshow", sceneImages);
});


function setupCarousel(sectionId, images) {
  const section = document.getElementById(sectionId);
  const container = section.querySelector(".slides-container");
  const prevBtn = section.querySelector(".prev");
  const nextBtn = section.querySelector(".next");

  let index = 0;

  // Create slides
  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "slide";
    img.addEventListener("click", () => openBlurb(src));
    container.appendChild(img);
  });

  const slides = container.querySelectorAll(".slide");

  function updateSlides() {
    slides.forEach((slide, i) => slide.classList.remove("active"));
    slides[index].classList.add("active");

    // calculate translateX to center active slide
    const slideWidth = slides[0].offsetWidth + 20; // include margin
    const offset = -index * slideWidth + (container.offsetWidth - slideWidth) / 2;
    container.style.transform = `translateX(${offset}px)`;
  }

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlides();
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateSlides();
  });

  window.addEventListener("resize", updateSlides);
  updateSlides();
}


function openBlurb(imageSrc) {
  const text = blurbs[imageSrc] || "";
  const overlay = document.createElement("div");
  overlay.className = "blurb-overlay";
  overlay.innerHTML = `
    <div class="blurb-content">
      <img src="${imageSrc}" alt="">
      <p>${text}</p>
      <button class="close">Close</button>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector(".close").addEventListener("click", () => overlay.remove());
}

