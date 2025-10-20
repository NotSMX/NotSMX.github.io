class Slideshow {
  constructor(slideshowId) {
    this.slideshow = document.getElementById(slideshowId);
    this.slidesContainer = this.slideshow.querySelector('.slides-container');
    this.slides = this.slidesContainer.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.index = 0;

    this.slideshow.querySelector('.prev').addEventListener('click', () => this.prev());
    this.slideshow.querySelector('.next').addEventListener('click', () => this.next());
    
    this.update();
  }

  update() {
    const offset = -this.index * 100;
    this.slidesContainer.style.transform = `translateX(${offset}%)`;
  }

  prev() {
    this.index = (this.index - 1 + this.totalSlides) % this.totalSlides;
    this.update();
  }

  next() {
    this.index = (this.index + 1) % this.totalSlides;
    this.update();
  }
}

// Initialize all slideshows
document.addEventListener('DOMContentLoaded', () => {
  new Slideshow('backgrounds-slideshow');
  new Slideshow('characters-slideshow');
});
