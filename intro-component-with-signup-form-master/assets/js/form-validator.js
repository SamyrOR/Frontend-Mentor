const form = document.querySelector(".form");
const inputs = document.querySelectorAll(".form__input");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInputs();
});

function checkInputs() {
  inputs.forEach((input) => {
    if (!input.value || !input.checkValidity()) {
      setError(input);
    } else {
      setSuccess(input);
    }
  });
}

function setError(input) {
  const formControl = input.parentElement;
  input.classList.add("invalid");
  formControl.querySelector(".error").style.display = "block";
}

function setSuccess(input) {
  const formControl = input.parentElement;
  input.classList.remove("invalid");
  formControl.querySelector(".error").style.display = "none";
}
