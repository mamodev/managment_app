import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { endpoints } from "api";
import FormTextField from "components/base/FormTextField";
import AutocompleteFilter from "components/modules/filters/AutocompleteFilter";
import { useAuthContext } from "context/AuthContext";
import { useState } from "react";
import ApiDataForm from "./ApiDataForm";

const fields = [
  {
    xs: 12,
    id: "in_persona",
    Component: AutocompleteFilter,
    defaultValue: null,
    componentProps: {
      options: [
        { value: "FISI", label: "Persona fisica senza partita iva" },
        { value: "PIVA", label: "Persona fisica con partita iva" },
        { value: "GIUR", label: "Persona giuridica" },
      ],
      inputProps: {
        variant: "standard",
      },
      placeholder: "Tipo",
    },
    valueGet: (val) => val?.value,
    required: true,
  },
  {
    xs: 6,
    conditionallyRendered: { id: "in_persona", value: ["FISI", "PIVA"] },
    id: "in_nome",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Nome" },
    required: true,
  },
  {
    xs: 6,
    conditionallyRendered: { id: "in_persona", value: ["FISI", "PIVA"] },
    id: "in_cognome",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Cognome" },
    required: true,
  },
  {
    conditionallyRendered: { id: "in_persona", value: "GIUR" },
    id: "in_denom",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Denominazione" },
    required: true,
  },
  {
    id: "in_email",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Email" },
    required: false,
  },
  {
    id: "in_pec",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "PEC" },
    required: false,
  },
  {
    id: "in_cfisc",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Codice fiscale" },
    required: false,
  },
  {
    id: "in_piva",
    conditionallyRendered: { id: "in_persona", value: ["PIVA", "GIUR"] },
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Partita iva" },
    required: false,
  },
  {
    xs: 3,
    id: "in_nazione",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Nazione" },
    required: false,
  },
  {
    xs: 3,
    id: "in_provincia",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Provincia" },
    required: false,
  },
  {
    xs: 3,
    id: "in_comune",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Comune" },
    required: false,
  },
  {
    xs: 3,
    id: "in_cap",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "CAP" },
    required: false,
  },
  {
    id: "in_indirizzo",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Indirizzo" },
    required: false,
  },
  {
    id: "in_ind_note",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Note indirizzo" },
    required: false,
  },
  {
    id: "in_telefono",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Telefono" },
    required: false,
  },
  {
    id: "in_cellulare",
    defaultValue: "",
    Component: FormTextField,
    componentProps: { fullWidth: true, placeholder: "Cellulare" },
    required: false,
  },
];

export default function CreateClient({
  callback,
  size = "normal",
  variant = "text",
  text = "Aggiungi",
  startIcon = <Add />,
  dataForm,
}) {
  const [open, setOpen] = useState();
  const { api } = useAuthContext();

  return (
    <>
      <Button size={size} variant={variant} startIcon={startIcon} onClick={() => setOpen(true)}>
        {text}
      </Button>
      <ApiDataForm
        endpoint={endpoints.CLIENTS(api).add}
        callback={callback}
        send={(mutate, fields) => {
          if (!fields.in_nome) fields.in_nome = "";
          if (!fields.in_cognome) fields.in_cognome = "";
          mutate(fields);
        }}
        title="Aggiungi cliente"
        sendText="Aggiungi"
        open={open}
        onClose={() => setOpen(false)}
        fields={fields}
        {...dataForm}
      />
    </>
  );
}
