let slideIndex = 1;
const btnPrev = document.querySelectorAll(".slider__prev");
const btnNext = document.querySelectorAll(".slider__next");

showSlides(slideIndex);
btnNext.forEach((btn) => {
  btn.addEventListener("click", () => {
    showSlides((slideIndex += 1));
  });
});
btnPrev.forEach((btn) => {
  btn.addEventListener("click", () => showSlides((slideIndex += -1)));
});

function showSlides(n) {
  const slides = document.querySelectorAll(".slider-show");
  if (n > slides.length) {
    slideIndex = 1;
  } else if (n < 1) {
    slideIndex = slides.length;
  }
  slides.forEach((slide) => {
    slide.style.display = "none";
  });
  slides[slideIndex - 1].style.display = "block";
}
