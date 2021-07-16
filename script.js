/* ****************************************************************
Side note: Normally I would just use the embedded html attributes
on forms like maxlength and required, as well as the different
types (email, tel, etc) but I wanted to try to do the validation
and use text inputs as instructed.
 **************************************************************** */

(function () {
  const referralSelect = document.getElementById('referral-select');
  const infoForm = document.getElementById('info-form');
  const inputs = document.getElementsByClassName('input');
  const inputsArr = Array.from(inputs);

  // Initialize Status Object, once all fields are true, will set success
  const statusObj = {
    firstname: false,
    lastname: false,
    phone: false,
    email: false,
    referralOrPromo: false,
    terms: false,
  };

  // Sets form to not validate if javascript is available
  infoForm.setAttribute('novalidate', '');

  // Gets name of the field
  function getField(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
  }

  // Shows error message in browser
  function showError(input, msg) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    statusObj[input.id] = false;

    input.classList.add('input-error');
    small.innerText = msg;
    small.style.display = 'block';
  }

  // Removes error message in browser
  function removeError(input) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    statusObj[input.id] = true;

    input.classList.remove('input-error');
    small.innerText = '';
    small.style.display = 'none';
  }

  // Checks length of form elements and adds or removes error as needed
  function checkLength(input, maxLength) {
    const hasError = input.classList.contains('input-error');

    if (input.value.trim().length > maxLength && !hasError) {
      const msg = `This cannot be longer than ${maxLength} characters`;
      showError(input, msg);
    } else if (input.value.trim().length <= maxLength && hasError) {
      removeError(input);
    }

    return input.value.trim().length <= maxLength;
  }

  // Checks to see if email address is valid
  function checkEmail(input) {
    const hasError = input.classList.contains('input-error');
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = regex.test(input.value.trim().toLowerCase());

    if (!validEmail && !hasError) {
      const msg = 'Must enter a valid email address';
      showError(input, msg);
    } else if (validEmail && hasError) {
      removeError(input);
    }

    return validEmail;
  }

  // Checks for only numbers in phone number
  function numbersOnly(input) {
    const hasError = input.classList.contains('input-error');
    const regex = /^[0-9]+$/;
    const onlyNumbers = regex.test(input.value.trim());

    if (!onlyNumbers && !hasError) {
      const msg = 'This field can only contain numbers';
      showError(input, msg);
    } else if (onlyNumbers && hasError) {
      removeError(input);
    }

    return onlyNumbers;
  }

  // Checks for only alphanumeric characters in promocode
  function alphaNumericOnly(input) {
    const hasError = input.classList.contains('input-error');
    const regex = /^[A-Za-z0-9_]*$/;
    const onlyAlphaNumeric = regex.test(input.value.trim());

    if (!onlyAlphaNumeric && !hasError) {
      const msg = 'This field can only contain alphanumeric characters';
      showError(input, msg);
    } else if (onlyAlphaNumeric && hasError) {
      removeError(input);
    }

    return onlyAlphaNumeric;
  }

  // Sets select to required if no promo code is entered
  function togglePromo() {
    const promoCode = document.getElementById('promo').value;
    if (!promoCode) {
      document.getElementById('referral-select').setAttribute('required', '');
    } else {
      document
        .getElementById('referral-select')
        .setAttribute('required', 'false');
      document.getElementById('referral').setAttribute('required', 'false');
    }
  }

  // Fills out statusObj to see if
  function setStatus(input) {
    if (input === 'promo' || input === 'referral') {
      statusObj['referralOrPromo'] = true;
    } else {
      statusObj[input.id] = true;
    }

    // Check to see if fields are still missing or invalid
    let anyErrors = 0;
    for (let prop in statusObj) {
      if (statusObj[prop] === false) {
        anyErrors++;
      }
    }

    if (!anyErrors) {
      document.getElementById('success-box').style.display = 'block';
      setTimeout(() => {
        document.getElementById('success-box').style.display = 'none';
      }, 5000);
    }
  }

  // Checks fields to see if they are required and filled out, returns false if not, true if so
  function checkIfRequired(inputs) {
    let missingRequired = false;

    // Iterates over inputArr and checks required elements
    inputs.forEach((input) => {
      let msg;

      if (
        input.hasAttribute('required') &&
        input.getAttribute('required') !== 'false'
      ) {
        if (input.type === 'checkbox' && !input.checked) {
          msg = `This must be checked`;
          showError(input, msg);
          missingRequired = true;
        } else if (input.type === 'select-one' && !input.value) {
          msg = `This must have a selection`;
          showError(input, msg);
          missingRequired = true;
        } else if (!input.value.trim()) {
          const fieldName = getField(input);
          msg = `${fieldName} is required`;
          showError(input, msg);
          missingRequired = true;
        }
      }
    });

    return missingRequired;
  }

  // Performs needed validations on each input
  function validate(evt) {
    switch (evt.target.id) {
      case 'firstname':
      case 'lastname':
        let validLength = checkLength(evt.target, 30);
        if (validLength) {
          setStatus(evt.target);
        }
        break;

      case 'email':
        let validEmailLength;
        const emailValid = checkEmail(evt.target);
        if (emailValid) {
          validEmailLength = checkLength(evt.target, 50);
        }
        if (validEmailLength) {
          setStatus(evt.target);
        }
        break;

      case 'phone':
        let validPhoneLength;
        const phoneNumberValid = numbersOnly(evt.target);

        if (phoneNumberValid) {
          validPhoneLength = checkLength(evt.target, 30);
        }
        if (validPhoneLength) {
          setStatus(evt.target);
        }
        break;

      case 'promo':
        let validPromoLength;
        const promoValid = alphaNumericOnly(evt.target);
        if (promoValid) {
          validPromoLength = checkLength(evt.target, 7);
        }
        if (validPromoLength) {
          setStatus('promo');
        }
        togglePromo();
        break;

      case 'referral-select':
        if (evt.target.value) {
          removeError(evt.target);
          setStatus('referral');
        }
        break;

      case 'referral':
        checkLength(evt.target, 255);
        break;

      case 'terms':
        if (evt.target.checked) {
          removeError(evt.target);
          setStatus(evt.target);
        }
        break;
      default:
        return;
    }
  }

  // ************************* EVENT LISTENERS *************************
  function addEventListenersOnInputs(inputs) {
    inputs.forEach((input) => {
      input.addEventListener('change', (evt) => {
        validate(evt);
      });

      input.addEventListener('paste', (evt) => {
        validate(evt);
      });
    });
  }

  // Toggles textbox and sets to required if 'other' is selected
  referralSelect.addEventListener('change', () => {
    const selectOption = referralSelect.value;
    const referralTextbox = document.getElementById('referral');

    if (selectOption === 'other') {
      referralTextbox.style.display = 'block';
      referralTextbox.setAttribute('required', '');

      // Adds text area to inputs array and adds event listener
      inputsArr.push(referralTextbox);
      addEventListenersOnInputs(inputsArr);
    } else {
      referralTextbox.style.display = 'none';
      referralTextbox.setAttribute('required', 'false');
      removeError(referralTextbox);
    }
  });

  // Validates on submit
  infoForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    checkIfRequired(inputsArr);
  });

  togglePromo();
  addEventListenersOnInputs(inputsArr);
})();
