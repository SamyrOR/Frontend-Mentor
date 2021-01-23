const input = document.querySelector(".form__input");
const button = document.querySelector(".form__button");
const error = document.querySelector(".error");

button.addEventListener("click", () => {
  if (!input.checkValidity()) {
    error.style.display = "block";
    input.style.borderColor = "red";
  }
});

input.addEventListener("input", () => {
  if (!input.checkValidity()) {
    error.style.display = "block";
    input.style.borderColor = "red";
  } else {
    error.style.display = "none";
    input.style.border = "1px solid rgba(65, 58, 58, 0.5)";
  }
});
console.log(input, button);
