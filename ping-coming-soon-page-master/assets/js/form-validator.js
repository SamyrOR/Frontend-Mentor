const form = document.querySelector(".form");
const email = document.getElementById("email");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInput();
});

function checkInput() {
  const emailValue = email.value.trim();
  if (!emailValue) {
    setError(email, "Email field cannot be empty");
  } else if (!isEmail(emailValue)) {
    setError(email, "Please provide a valid email address");
  } else {
    setSuccess(email);
  }
}

function setError(input, message) {
  const formControl = input.parentElement;
  formControl.classList.add("error");
  const textError = document.querySelector(".error-text");
  textError.innerText = message;
}

function setSuccess(input) {
  const formControl = input.parentElement;
  formControl.classList.remove("error");
}

function isEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
