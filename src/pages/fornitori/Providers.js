import { Add } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { endpoints } from "api";
import FormTextField from "components/base/FormTextField";
import ApiServer from "components/layout/ApiServer";
import TextFilter from "components/modules/filters/TextFilter";
import ApiDataForm from "components/templates/ApiDataForm";
import ApiDataList from "components/templates/ApiDataList";
import { useAuthContext } from "context/AuthContext";
import { useWindowManagerContext } from "context/WindowManagerContext";
import useFilters from "hooks/useFilters";
import { useState } from "react";
import providers_columns from "./columns";

//TODO Rendere come clienti
const fields = [
  {
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
    required: true,
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
    required: true,
  },
  {
    id: "in_piva",
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

export default function Providers() {
  const { api } = useAuthContext();
  const [addProviderOpen, setAddProviderOpen] = useState(false);
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
        Lista fornitori
      </Typography>

      <ApiServer endpoint={endpoints.PROVIDERS} filters={query}>
        <ApiDataList
          columns={providers_columns}
          filterOutlet={FilterOutlet}
          onRowClick={(e) =>
            newWindow({
              url: `/fornitori/${e.id}`,
              name: "Fornitori",
              params: e.id,
            })
          }
          getRowClassName={() => `super-app-theme--select`}
          toolbarActions={[
            () => (
              <Button onClick={() => setAddProviderOpen(true)} startIcon={<Add />}>
                Aggiungi
              </Button>
            ),
          ]}
        />
      </ApiServer>
      <ApiDataForm
        endpoint={endpoints.PROVIDERS(api).add}
        callback={({ id }) => newWindow({ url: `/fornitori/${id}`, name: "Fornitori", params: id })}
        send={(mutate, fields) => mutate(fields)}
        title="Aggiungi fornitore"
        open={addProviderOpen}
        onClose={() => setAddProviderOpen(false)}
        fields={fields}
      />
    </Stack>
  );
}
