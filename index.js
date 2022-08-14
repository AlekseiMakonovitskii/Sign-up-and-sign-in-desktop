const emailInputIn = document.querySelector(`#Email-id-in`);
const passwordInputIn = document.querySelector(`#Password-id-in`);
const usernameInputUp = document.querySelector(`#Usernmae-id-up`);
const emailInputUp = document.querySelector(`#Email-id-up`);
const passwordInputUp = document.querySelector(`#Password-id-up`);
const sections = document.querySelectorAll(`.section`);

const btnIn = document.querySelector(`#btn-in`);
const btnUp = document.querySelector(`#btn-up`);
const btnUpInfo = document.querySelector(`#btn-up-info`);

const slideInfoSection = document.querySelector(`.slide-info-section`);
const slideContent = document.querySelector(`.slide-content`);

const signUpText = document.querySelector(`.sign-up-text`);
const signInText = document.querySelector(`.sign-in-text`);

const loggedIn = document.querySelector(`.logged-in`);
const loggedElements = document.querySelector(`.logged-elements`);
const btnOutLogged = document.querySelector(`#btn-out-logged`);

const accounts = [];

// Slide logic
const createInfoSection = function () {
  slideContent.innerHTML = ``;

  const signInHtml = `<div class="slide-content">
	<h1>Hi There!</h1>
	<h3>Enter your personal details to open an account with us</h3>
	<input type="button" value="SIGN UP" class="btn" id="btn-up-info" /></div>`;

  const signUpHtml = `<div class="slide-content">
	<h1>Welcome Back!</h1>
	<h3>To keep connected with us please login with your personal details</h3>
	<input type="button" value="SIGN IN" class="btn" id="btn-in-info" /></div>`;

  if (slideInfoSection.classList.contains(`sign-in-info`)) {
    slideContent.insertAdjacentHTML(`afterbegin`, signInHtml);
    document
      .querySelector(`#btn-up-info`)
      .addEventListener(`click`, slideSection);
  }

  if (slideInfoSection.classList.contains(`sign-up-info`)) {
    slideContent.insertAdjacentHTML(`afterbegin`, signUpHtml);
    document
      .querySelector(`#btn-in-info`)
      .addEventListener(`click`, slideSection);
  }

  slideContent.style.filter = `blur(0px)`;
};

const slideSection = function (e) {
  e.preventDefault();
  slideContent.style.filter = `blur(10px)`;
  slideInfoSection.classList.toggle(`sign-in-info`);
  slideInfoSection.classList.toggle(`sign-up-info`);
  clearForms();
  setTimeout(createInfoSection, 1000);
};

// Form validation
const clearForms = function () {
  emailInputIn.value = ``;
  passwordInputIn.value = ``;
  usernameInputUp.value = ``;
  emailInputUp.value = ``;
  passwordInputUp.value = ``;
};

const showFormError = function (input) {
  input.classList.add(`input-error`);

  setTimeout(() => input.classList.remove(`input-error`), 1000);
};

const showEmptyFieldsError = function (el, text) {
  el.textContent = `Fill in all the fields`;
  el.classList.add(`text-error`);

  setTimeout(() => {
    el.textContent = `${text}`;
    el.classList.remove(`text-error`);
  }, 3000);
};

// Sign up
const signUpformValidation = function (...inputs) {
  let inputsArr = [...inputs];
  const failed = inputsArr.filter(input => input.value.length < 5);

  if (failed.length === 0) {
    return true;
  }

  failed.forEach(input => {
    showFormError(input);
  });
  showEmptyFieldsError(signUpText, `or use your email for registration`);

  return false;
};

const signUpValidation = function () {
  for (const account of accounts) {
    if (account.username === usernameInputUp.value) {
      showFormError(usernameInputUp);
      signUpText.textContent = `This username has already been taken`;
      signUpText.classList.add(`text-error`);

      setTimeout(() => {
        signUpText.textContent = `or use your email for registration`;
        signUpText.classList.remove(`text-error`);
      }, 3000);

      return false;
    }
  }

  return true;
};

// Sign in
const signInFormValidation = function (...inputs) {
  const inputsArr = [...inputs];
  const failed = inputsArr.filter(input => input.value.length < 5);

  if (failed.length === 0) {
    return true;
  }

  failed.forEach(input => showFormError(input));
  showEmptyFieldsError(signInText, `or use your account`);
  return false;
};

const showLoggedIn = function () {
  loggedIn.classList.toggle(`online`);
  loggedIn.classList.toggle(`offline`);

  setTimeout(() => {
    loggedIn.classList.add(`onlineNoBlur`);
  }, 500);
};

const signInValidation = function () {
  const showError = function () {
    signInText.textContent = `Invalid data`;
    signInText.classList.add(`text-error`);

    setTimeout(() => {
      signInText.classList.remove(`text-error`);
      signInText.textContent = `or use your account`;
    }, 1000);
  };

  let checked = false;

  for (const account of accounts) {
    if (
      account.email === emailInputIn.value &&
      account.password === passwordInputIn.value
    ) {
      checked = true;
      return true;
    } else {
      checked = false;
    }
  }

  if (accounts.length === 0) {
    showError();
  }

  if (!checked) {
    showError();
    return false;
  }
};

// Create account
const createAccount = function (e) {
  e.preventDefault();
  const account = {
    username: usernameInputUp.value,
    email: emailInputUp.value,
    password: passwordInputUp.value,
  };

  const validation = signUpformValidation(
    usernameInputUp,
    emailInputUp,
    passwordInputUp
  );

  const signUpValidationValue = signUpValidation();

  if (validation && signUpValidationValue) {
    accounts.push(account);
    clearForms();
    slideSection(e);
    saveToLocalStorage();
  }
};

// Log in
const logToAccount = function (e) {
  e.preventDefault();
  const validation = signInFormValidation(emailInputIn, passwordInputIn);

  if (!validation) {
    return;
  }

  const signInValidationValue = signInValidation();

  if (validation && signInValidationValue) {
    showLoggedIn();
    sectionsToggle();
  }
};

// Log out
const sectionsToggle = function () {
  sections.forEach(section => {
    section.classList.toggle(`offlineContainer`);
    section.classList.toggle(`onlineContainer`);
  });
};

const logOut = function (e) {
  e.preventDefault();

  loggedIn.classList.toggle(`online`);
  loggedIn.classList.toggle(`offline`);
  loggedIn.classList.remove(`onlineNoBlur`);

  clearForms();
  sectionsToggle();
};

// Local storage
const saveToLocalStorage = function () {
  localStorage.setItem(`Accounts`, JSON.stringify(accounts));
};

const loadFromLocalStorage = function () {
  const show = JSON.parse(localStorage.getItem(`Accounts`));
  accounts.push(...show);
};

btnUpInfo.addEventListener(`click`, slideSection);
btnUp.addEventListener(`click`, createAccount);
btnIn.addEventListener(`click`, logToAccount);
btnOutLogged.addEventListener(`click`, logOut);

loadFromLocalStorage();
