const btnHamburger = document.querySelector("#btnHamburger");
const header = document.querySelector(".header");
const fadeElements = document.querySelectorAll(".has-fade");
const body = document.querySelector("body");

btnHamburger.addEventListener("click", () => {
  header.classList.toggle("open");
  body.classList.toggle("no-scroll");
  if (header.classList.contains("open")) {
    fadeElements.forEach((element) => {
      element.classList.remove("fade-out");
      element.classList.add("fade-in");
    });
  } else {
    fadeElements.forEach((element) => {
      element.classList.add("fade-out");
      element.classList.remove("fade-in");
    });
  }
});
