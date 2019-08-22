// Validation rule for a specific value: email or password or confirmPass
const validate = (val, rules, connectedValue) => {
  let isValid = true;
  for (const rule in rules) {
    switch (rule) {
      case 'isEmail':
        isValid = isValid && emailValidator(val);
        break;
      case 'minLength':
        isValid = minLengthValidator(val, rules[rule]);
        break;
      case 'isEqualTo':
        isValid = isValid && isEqualToValidator(val, connectedValue[rule]);
        break;
      case 'notEmpty':
        isValid = isValid && isEmpty(val);
        break;
      default:
        isValid = true;
    }
  }
  return isValid;
};

const emailValidator = val => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    val,
  );
};

const minLengthValidator = (val, minLength) => {
  return val.length >= minLength;
};

const isEqualToValidator = (val, checkVal) => {
  return val === checkVal;
};

const isEmpty = val => {
  return val.trim() !== '';
};

export default validate;
