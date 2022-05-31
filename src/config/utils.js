import { endpoints } from "api";
import ApiFilterServer from "components/modules/filters/ApiFilterServer";
import AutocompleteFilter from "components/modules/filters/AutocompleteFilter";
import DateFilter from "components/modules/filters/DateFilter";
import TextFilter from "components/modules/filters/TextFilter";

const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const reverseDate = (date, separator = "-") =>
  date ? date.split("-").reverse().join(separator) : date;

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

const default_filters = {
  sede: (field = "sede") => ({
    name: field,
    component: ApiFilterServer,
    defaultValue: null,
    filterRender: (val) => `eq.${val.sede}`,
    componentProps: {
      endpoint: endpoints.SITES,
      children: AutocompleteFilter,
      mapData: (data) => ({ label: data.dexb, sede: data.sede }),
      dataName: "options",
      placeholder: "Sede",
      isOptionEqualToValue: (option, value) => option.label === value.label,
      sx: { minWidth: 150 },
      size: "small",
    },
  }),
  likeText: ({ field, placeholder = "Inserisci testo", size = "small" }) => ({
    name: field,
    component: TextFilter,
    defaultValue: "",
    filterRender: (val) => `ilike.*${val}*`,
    componentProps: {
      placeholder: placeholder,
      sx: { minWidth: 300 },
      size: size,
    },
  }),
  dateGraterThen: ({ field, placeholder = "Dal", size = "small" }) => ({
    name: field,
    component: DateFilter,
    defaultValue: null,
    filterRender: (val) => `gte.${formatDate(val)}`,
    componentProps: {
      placeholder: placeholder,
      sx: { minWidth: 150 },
      inputProps: { size },
    },
  }),
  dateSmallerThen: ({ field, placeholder = "Al", size = "small" }) => ({
    name: field,
    component: DateFilter,
    defaultValue: null,
    filterRender: (val) => `lte.${formatDate(val)}`,
    componentProps: {
      placeholder: placeholder,
      sx: { minWidth: 150 },
      inputProps: { size },
    },
  }),
};
export { formatDate, reverseDate, isValid, debounce, default_filters };
