const btn = document.querySelector(".share");
btn.addEventListener("click", toggleClass);

function catchElement(element) {
  return document.querySelector(element);
}
function toggle(element, clas) {
  element.classList.toggle(clas);
}

function toggleClass() {
  let profile = catchElement(".profile");
  let social = catchElement(".social");
  let profileWrapper = catchElement(".profile__wrapper");
  toggle(profile, "profile--active");
  toggle(social, "display");
  toggle(profileWrapper, "display");
  toggle(btn, "share--active");
}
