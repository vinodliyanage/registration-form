const form = document.getElementById("form");
const uid = document.getElementById("uid");
const password = document.getElementById("password");
const username = document.getElementById("name");
const country = document.getElementById("country");
const email = document.getElementById("email");
const sex = document.querySelectorAll('input[type="radio"][name="sex"]');
const lang = document.querySelectorAll('input[type="checkbox"][name="lang"]');

uid.addEventListener("input", () => validate(uid));
password.addEventListener("input", () => validate(password));
username.addEventListener("input", () => validate(username));
email.addEventListener("input", () => validate(email));
country.addEventListener("change", () => validate(country));

sex.forEach((elm) => {
  elm.addEventListener("change", () => validate(elm));
});

lang.forEach((elm) => {
  elm.addEventListener("change", () => validate(elm));
});

form.addEventListener("submit", (event) => {
  let isvalid = true;
  for (let element of [uid, password, username, country, email, ...sex])
    isvalid &= validate(element);

  for (let element of lang) isvalid |= validate(element);

  if (!isvalid) {
    event.preventDefault();
  }
});

form.addEventListener("reset", () => {
  form
    .querySelectorAll(".valid")
    .forEach((elm) => elm.classList.remove("valid"));
  form
    .querySelectorAll(".invalid")
    .forEach((elm) => elm.classList.remove("invalid"));
  form.querySelectorAll(".error").forEach((elm) => elm.remove());
});

function validate(element) {
  let isvalid = true;
  const name = element.name;

  const error = document.createElement("span");
  error.setAttribute("aria-live", "polite");
  error.className = "error";

  if (element.validity.valid) {
    isvalid = true;
    error.textContent = "";
    element.className = "valid";
  } else {
    isvalid = false;
    element.className = "invalid";
    error.className = "error error--active error--invalid";
  }

  //? checkbox validation hack

  if (element.checked) {
    lang.forEach((elm) => {
      if (!elm.isEqualNode(element)) elm.removeAttribute("required");
    });
  } else lang.forEach((elm) => elm.setAttribute("required", "true"));

  //??????????????????????????

  if (element.validity.tooShort) {
    error.textContent = `${name} should be at least ${element.minLength} characters; you entered ${element.value.length}.`;
  } else if (element.validity.patternMismatch) {
    if (name === "name")
      error.textContent = `${name} should only contains alphabets.`;
    else if (name === "password")
      error.textContent = `${name} should be at least ${element.minLength} characters; you entered ${element.value.length}.`;
  } else if (element.validity.typeMismatch) {
    error.textContent = `${name} is not in the required syntax. (e.g. you@example.com)`;
  } else if (element.validity.valueMissing) {
    error.textContent = `${name} is missing.`;
  } else if (element.validity.badInput) {
    error.textContent = "Bad input detected.";
  }

  const parent = document.querySelector(`[data-name=${name}]`);
  if (parent instanceof HTMLElement) {
    const _error = parent.querySelector(".error");
    if (!_error) parent.append(error);
    else parent.replaceChild(error, _error);
  }

  return isvalid;
}
