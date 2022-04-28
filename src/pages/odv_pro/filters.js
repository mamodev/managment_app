import { endpoints } from "api";
import ApiFilterServer from "components/modules/filters/ApiFilterServer";
import AutocompleteFilter from "components/modules/filters/AutocompleteFilter";
import DateFilter from "components/modules/filters/DateFilter";
import TextFilter from "components/modules/filters/TextFilter";
import { formatDate } from "utils";

const odv_pro_filters = [
  {
    name: "tipo_decod",
    component: ApiFilterServer,
    defaultValue: null,
    filterRender: (val) => `eq.${val}`,
    componentProps: {
      endpoint: endpoints.ODV_PRO_TYPE,
      children: AutocompleteFilter,
      mapData: (data) => data.cod,
      dataName: "options",
      placeholder: "Tipo",
      sx: { minWidth: 150 },
      size: "small",
    },
  },
  {
    name: "stato_cod",
    component: ApiFilterServer,
    defaultValue: null,
    filterRender: (val) => `eq.${val.cod}`,
    componentProps: {
      endpoint: endpoints.ODV_PRO_STATE,
      children: AutocompleteFilter,
      mapData: (data) => ({ label: data.dex, cod: data.cod }),
      dataName: "options",
      placeholder: "Stato",
      isOptionEqualToValue: (option, value) => option.label === value.label,
      sx: { minWidth: 150 },
      size: "small",
    },
  },
  {
    name: "sede",
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
  },
  {
    name: "venditore_id",
    component: ApiFilterServer,
    defaultValue: null,
    filterRender: (val) => `eq.${val.id}`,
    componentProps: {
      endpoint: endpoints.SELLERS,
      children: AutocompleteFilter,
      mapData: (data) => ({ label: data.denom, id: data.id }),
      dataName: "options",
      placeholder: "Venditore",
      isOptionEqualToValue: (option, value) => option.label === value.label,
      sx: { minWidth: 150 },
      size: "small",
    },
  },
  {
    name: "numero",
    component: TextFilter,
    defaultValue: "",
    filterRender: (val) => `like.*${val.toUpperCase()}*`,
    componentProps: {
      placeholder: "Numero Ordine",
      sx: { minWidth: 300 },
      size: "small",
    },
  },
  {
    name: "estremi",
    component: TextFilter,
    defaultValue: "",
    filterRender: (val) => `like.*${val.toLowerCase()}*`,
    componentProps: {
      placeholder: "Estremi",
      sx: { minWidth: 300 },
      size: "small",
    },
  },
  {
    name: "del",
    component: DateFilter,
    defaultValue: null,
    filterRender: (val) => `gte.${formatDate(val)}`,
    componentProps: {
      placeholder: "Dal",
      sx: { minWidth: 150 },
      inputProps: { size: "small" },
    },
  },
  {
    name: "del",
    component: DateFilter,
    defaultValue: null,
    filterRender: (val) => `lte.${formatDate(val)}`,
    componentProps: {
      placeholder: "Al",
      sx: { minWidth: 150 },
      inputProps: { size: "small" },
    },
  },
];

export default odv_pro_filters;
