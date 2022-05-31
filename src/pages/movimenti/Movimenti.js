import { LocationOn } from "@mui/icons-material";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiFilterServer from "components/modules/filters/ApiFilterServer";
import AutocompleteFilter from "components/modules/filters/AutocompleteFilter";
import ApiDataList from "components/templates/ApiDataList";
import { default_filters, reverseDate } from "config/utils";
import { useWindowManagerContext } from "context/WindowManagerContext";
import useFilters from "hooks/useFilters";
import { useNavigate } from "react-router-dom";

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
  const { newWindow } = useWindowManagerContext();

  return (
    <Stack p={2} spacing={2}>
      <Typography variant="h4">LISTA MOVIMENTI</Typography>
      <ApiServer endpoint={endpoints.MOVEMENTS} filters={query}>
        <ApiDataList
          verbose={true}
          columns={columns}
          filterOutlet={FilterOutlet}
          rowActionsPosition="end"
          rowActions={[
            {
              icon: (params) =>
                !params.row.mov_id ? (
                  <Box></Box>
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
