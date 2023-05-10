// Add the novalidate attribute when the JS loads
let forms = document.querySelectorAll('.validate');
for (let i = 0; i < forms.length; i++) {
    forms[i].setAttribute('novalidate', true);
}

// Define input fields
const email = document.querySelector('#email');
const country = document.querySelector("#country");
const zipField = document.querySelector("#ZIP");
const password = document.querySelector("#password");
const confirmaiton = document.querySelector("#confirmation");

// Listen to all blur events
document.addEventListener('blur', function (event) {
  let field = event.target;
  // Only run if the field is in a form to be validated
  if (!field.form.classList.contains('validate')) return;

  // Special listening on zip field when country changes
  if (field.id == 'country') {
    setZip();
    let currentError = hasError(zipField);
    if (currentError != null) {
      displayError(zipField, currentError)
    }
  }

  // Validate the field
  let error = hasError(field);
  checkPassword(password);
  if (error != null) {
    displayError(field, error);
    } else {
      displayError(field, '');
    }
}, true);



// Validate the field
let hasError = function (field) {
    // Don't validate submits, buttons, file and reset inputs, and disabled fields
    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

    // Get validity
    let validity = field.validity;
    // If valid, return null
    if (validity.valid) return;
    // If field is required and empty
    if (validity.valueMissing) return 'Please fill out this field.';
    // If not the right type
    if (validity.typeMismatch) {
        // Email
        if (field.type === 'email') return 'Please enter a valid email address.';
        // URL
        if (field.type === 'url') return 'Please enter a URL.';
    }
    // If too short
    if (validity.tooShort) return 'Please lengthen this text to ' + field.getAttribute('minLength') + ' characters or more. You are currently using ' + field.value.length + ' characters.';
    // If too long
    if (validity.tooLong) return 'Please shorten this text to no more than ' + field.getAttribute('maxLength') + ' characters. You are currently using ' + field.value.length + ' characters.';

    // If number input isn't a number
    if (validity.badInput) return 'Please enter a number.';

    // If a number value doesn't match the step interval
    if (validity.stepMismatch) return 'Please select a valid value.';

    // If a number field is over the max
    if (validity.rangeOverflow) return 'Please select a value that is no more than ' + field.getAttribute('max') + '.';

    // If a number field is below the min
    if (validity.rangeUnderflow) return 'Please select a value that is no less than ' + field.getAttribute('min') + '.';
  
      // If pattern doesn't match
    if (validity.patternMismatch) {
        if (field.id == 'password') {
          return 'Please correct the following errors:'
        }
        // If pattern info is included, return custom error
        if (field.hasAttribute('title')) return `Pleases use the required format: ${field.getAttribute('title')};`

        // Otherwise, generic error
        return 'Please match the requested format.';

    }

    // If all else fails, return a generic catchall error
    return 'The value you entered for this field is invalid.';

};



const setZip = () => {
  switch (country.value){
    case 'ch':
      console.log('Switzerland')
      zipField.setAttribute('pattern','^[1-9]\\d{3}$');
      zipField.setAttribute('title', 'e.g., 1111')
      break;
    case 'fr':
      console.log('France')
      zipField.setAttribute('pattern', '^(?:0[1-9]|[1-8]\\d|9[0-8])\\d{3}$');
      zipField.setAttribute('title', 'e.g., 00123')
      break;
    case 'de':
      console.log('Germany')
      zipField.setAttribute('pattern', '^\\d{5}$');
      zipField.setAttribute('title', 'e.g., 12345')
      break;
    case 'nl':
      console.log('The Netherlands')
      zipField.setAttribute('pattern', '^(?:NL-)?(\\d{4})\\s*([A-Z]{2})$/i')
      zipField.setAttribute('title', 'e.g., 9438AE or 1000AB or 2378sc')
      break;
    case 'us':
      console.log('United States')
      zipField.setAttribute('pattern', '^\\d{5}(?:-\\d{4})?$')
      zipField.setAttribute('title', 'e.g., 12345 or 12345-6789')
      break;
    }
}


// Set default patterns for password and zip
password.setAttribute('pattern', '^((?=\\S*?[A-Z])(?=\\S*?[a-z])(?=\\S*?[0-9]).{6,})\\S$');
setZip('ch');

  const displayError = (element, error) => {
    console.log(error);
    let span = document.querySelector(`.${element.id}`);
    span.textContent = `${error}`;
  }


const checkPassword = (field) => {
  let value = field.value;
  let errors = [
    {
      name: 'length',
      pattern: /^.{8,20}$/,
      message: 'Password must be at least 8 characters long, and no more than 20. \n',
    },
    {
      name: 'lowercase',
      pattern: /^(?=.*[a-z]).*$/,
      message: 'Password must contain at least one lowercase letter. \n',
    },
    {
      name: 'uppercase',
      pattern: /^(?=.*[A-Z]).*$/,
      message: 'Password must contain at least one uppercase letter. \n',
    },
    {
      name: 'digit',
      pattern: /^(?=.*\d).*$/,
      message: 'Password must contain at least one digit. \n',
    },
    {
      name: 'whitespace',
      pattern: /^\S*$/,
      message: 'Password must not contain any whitespace characters. \n',
    },
    {
      name: 'special',
      pattern: /^.*[\!\@\#\$\%\^\&\*\(\)\-\=\¡\£\_\+\`\~\.\,\<\>\/\?\;\:\'\"\|].*$/,
      message: 'Password must contain at least one special character. \n',
    },
  ]

  let errorsList = document.querySelector('.errors');
  while(errorsList.firstChild) {
    errorsList.removeChild(errorsList.firstChild);
  }

  // Returns concatenated string of error messages
  let messages = [];

  errors.forEach(error => {
    let patternTest = error.pattern;
    if (!patternTest.test(value)) {
      messages.push(error.message)
    }})
  
  messages.forEach(message => {
    let item = document.createElement('li');
    item.textContent = message;
    errorsList.appendChild(item);
  })
  setConfirmation(value);
}

const setConfirmation = (value) => {
  confirmation.setAttribute('pattern', `${value}`);
  console.log(confirmation.pattern);
}


/* case country value
  ch
    add attribute to zip 
    pattern = 
  fr
  de
  nl
  us

confirmation must equal password

*/