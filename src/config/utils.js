const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const reverseDate = (date, separator = "-") => date.split("-").reverse().join(separator);

const validate = (field, value, fields) => {
  const rules = fields[field];
  if (rules) {
    switch (rules.type) {
      case "string":
        if (typeof value !== "string") {
          console.log(field, value, "is not a string");
          return false;
        }
        if (rules.format && value !== "" && !value.match(rules.format)) return false;
        if (rules.max_length && value.length > rules.max_length) return false;
        else return true;
      case "number":
        return true;
      default:
        return true;
    }
  } else return true;
};

const isValid = (field, value, fields) => {
  const res = validate(field, value, fields);

  return res;
};

const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

export { formatDate, reverseDate, isValid, debounce };
