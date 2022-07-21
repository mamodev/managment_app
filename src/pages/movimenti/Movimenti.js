import { Add, LocationOn } from "@mui/icons-material";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiFilterServer from "components/modules/filters/ApiFilterServer";
import AutocompleteFilter from "components/modules/filters/AutocompleteFilter";
import ApiDataList from "components/templates/ApiDataList";
import FormDialog from "components/templates/Form/FormDialog";
import { default_filters, reverseDate } from "config/utils";
import { useWindowManager } from "context/NewWindowManagerContext";
import useFilters from "hooks/useFilters";
import { useState } from "react";

const columns = [
  { field: "sede", headerName: "Sede", flex: 1 },
  { field: "causale", headerName: "Causale", flex: 1.5 },
  { field: "magazzino", headerName: "Magazzino", flex: 1.5 },
  { field: "controparte", headerName: "Controparte", flex: 1.5 },
  {
    field: "data_mov",
    headerName: "Data mov.",
    flex: 1,
    valueFormatter: ({ value }) => reverseDate(value, "/"),
  },
  { field: "nr_documento", headerName: "Documento", flex: 1.5 },
  { field: "nr_doc_ricevuto", headerName: "Doc. ricevuto", flex: 1.5 },
  { field: "articolo", headerName: "Articolo", flex: 1.5 },
  { field: "um", headerName: "Um", flex: 0.5 },
  { field: "riferimento", headerName: "Riferimento", flex: 1.5 },
];

const filters = [
  default_filters.dateGraterThen({ field: "data_mov" }),
  default_filters.dateSmallerThen({ field: "data_mov" }),
  default_filters.sede("sede_cod"),
  {
    name: "causale_cod",
    component: ApiFilterServer,
    defaultValue: null,
    filterRender: (val) => `eq.${val.causal}`,
    componentProps: {
      endpoint: endpoints.MOVEMENT_CAUSALS,
      children: AutocompleteFilter,
      mapData: (data) => ({ label: data.dexb, causal: data.cod }),
      dataName: "options",
      placeholder: "Causale",
      isOptionEqualToValue: (option, value) => option.label === value.label,
      sx: { minWidth: 230 },
      size: "small",
    },
  },

  default_filters.likeText({ field: "controparte", placeholder: "Controparte" }),
  default_filters.likeText({ field: "nr_documento", placeholder: "Documento" }),
  default_filters.likeText({ field: "nr_doc_ricevuto", placeholder: "Doc. ricevuto" }),
  default_filters.likeText({ field: "articolo", placeholder: "Articolo" }),
  default_filters.likeText({ field: "riferimento", placeholder: "Riferimento" }),
];

export default function Movimenti() {
  const { query, FilterOutlet } = useFilters(filters);
  const { newWindow } = useWindowManager();

  return (
    <Stack p={2} spacing={2}>
      <Typography variant="h4">LISTA MOVIMENTI</Typography>
      <ApiServer endpoint={endpoints.MOVEMENTS} filters={query}>
        <ApiDataList
          toolbarActions={[() => <AddMovement />]}
          columns={columns}
          filterOutlet={FilterOutlet}
          rowActionsPosition="end"
          onRowClick={(e) =>
            newWindow({
              url: `/movimenti/${e.row.mov_id}`,
              name: "Movimento",
              params: e.row.mov_id,
              w: 1000,
            })
          }
          getRowClassName={() => `super-app-theme--select`}
          rowActions={[
            {
              icon: (params) =>
                !params.row.mov_id ? (
                  ""
                ) : (
                  <Tooltip title="Registra ubicazioni">
                    <LocationOn />
                  </Tooltip>
                ),
              func: (params) =>
                params.row.mov_id &&
                newWindow({
                  url: "/registrazione_ubicazioni/" + params.row.mov_id,
                  name: "Ubicazioni",
                  params: params.row.mov_id,
                  w: 1000,
                }),
            },
          ]}
        />
      </ApiServer>
    </Stack>
  );
}

function AddMovement() {
  const [open, setOpen] = useState(false);
  const { newWindow } = useWindowManager();
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Button startIcon={<Add />} onClick={handleOpen}>
        Aggiungi
      </Button>
      {open && (
        <FormDialog
          open={open}
          onClose={handleClose}
          z
          send={({ sede, causale_mov }) =>
            newWindow({
              url: `/movimenti/create`,
              searchParams: { sede, causale_mov, editing: true },
              w: 1000,
            })
          }
          fields={[
            {
              xs: 12,
              id: "sede",
              Component: ApiFilterServer,
              defaultValue: null,
              componentProps: {
                endpoint: endpoints.SITES,
                children: AutocompleteFilter,
                mapData: (data) => ({ label: data.dexb, sede: data.sede }),
                dataName: "options",
                placeholder: "Sede",
                isOptionEqualToValue: (option, value) => option.label === value.label,
                size: "small",
                inputProps: { variant: "standard" },
                sx: { minWidth: 500 },
              },
              valueGet: (val) => val?.sede,
            },
            {
              xs: 12,
              id: "causale_mov",
              Component: ApiFilterServer,
              defaultValue: null,
              componentProps: {
                endpoint: endpoints.DOCUMENT_TYPE,
                children: AutocompleteFilter,
                mapData: (data) => ({ label: data.dexb, cod: data.cod }),
                dataName: "options",
                placeholder: "Tipo documento",
                isOptionEqualToValue: (option, value) => option.label === value.label,
                size: "small",
                inputProps: { variant: "standard" },
                sx: { minWidth: 500 },
              },
              valueGet: (val) => val?.cod,
            },
          ]}
          title="Crea movimento"
          sendText="Crea"
          closeText="Rinuncia"
        />
      )}
    </>
  );
}
