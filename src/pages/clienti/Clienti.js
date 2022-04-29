import { Add } from "@mui/icons-material";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { endpoints } from "api";
import FormTextField from "components/base/FormTextField";
import ApiServer from "components/layout/ApiServer";
import AutocompleteFilter from "components/modules/filters/AutocompleteFilter";
import TextFilter from "components/modules/filters/TextFilter";
import ApiDataForm from "components/templates/ApiDataForm";
import ApiDataList from "components/templates/ApiDataList";
import { useAuthContext } from "context/AuthContext";
import { useWindowManagerContext } from "context/WindowManagerContext";
import useFilters from "hooks/useFilters";
import { useState } from "react";
import clienti_columns from "./columns";

//TODO ORGANIZE IN MULTIPLE FILES
//FIXME sistemare creazione cliente non persona fisica
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

export default function Clienti() {
  const { api } = useAuthContext();
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const { newWindow } = useWindowManagerContext();
  const { FilterOutlet, query } = useFilters([
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
      name: "comune_search",
      component: TextFilter,
      defaultValue: "",
      filterRender: (val) => `like.*${val.toLowerCase()}*`,
      componentProps: {
        placeholder: "Comune",
        sx: { minWidth: 300 },
        size: "small",
      },
    },
  ]);
  return (
    <Stack p={3} spacing={2}>
      <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
        Lista clienti
      </Typography>

      <ApiServer endpoint={endpoints.CLIENTS} filters={query}>
        <ApiDataList
          columns={clienti_columns}
          filterOutlet={FilterOutlet}
          onRowClick={(e) => {
            newWindow({
              url: `/clienti/${e.id}`,
              name: "Cliente",
              params: e.row.denom,
              w: 420,
              h: 490,
            });
          }}
          getRowClassName={() => `super-app-theme--select`}
          toolbarActions={[
            () => (
              <Button onClick={() => setAddPersonOpen(true)} startIcon={<Add />}>
                Aggiungi
              </Button>
            ),
          ]}
        />
      </ApiServer>

      <ApiDataForm
        endpoint={endpoints.CLIENTS(api).add}
        callback={({ id }) =>
          newWindow({
            url: `/clienti/${id}`,
            name: "Clienti",
            params: id,
            w: 420,
            h: 490,
          })
        }
        send={(mutate, fields) => {
          if (!fields.in_nome) fields.in_nome = "";
          if (!fields.in_cognome) fields.in_cognome = "";
          mutate(fields);
        }}
        title="Aggiungi cliente"
        sendText="Crea"
        open={addPersonOpen}
        onClose={() => setAddPersonOpen(false)}
        fields={fields}
      />
    </Stack>
  );
}
