import { LocationOn } from "@mui/icons-material";
import { Stack, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiFilterServer from "components/modules/filters/ApiFilterServer";
import AutocompleteFilter from "components/modules/filters/AutocompleteFilter";
import ApiDataList from "components/templates/ApiDataList";
import { default_filters } from "config/utils";
import { useWindowManager } from "context/NewWindowManagerContext";
import useFilters from "hooks/useFilters";

const columns = [
  { field: "sede", headerName: "Sede", flex: 1 },
  { field: "magazzino", headerName: "Magazzino", flex: 1 },
  { field: "articolo", headerName: "Articolo", flex: 2 },
  { field: "um", headerName: "Um", flex: 0.25 },
  { field: "qta", headerName: "Qta", flex: 0.25 },
  { field: "qta_impegnata", headerName: "Impegni", flex: 0.5 },
  { field: "qta_disponibile", headerName: "Disponib", flex: 0.5 },
  { field: "riferimento", headerName: "Riferimento", flex: 1.5 },
];

const filters = [
  default_filters.sede("sede_cod"),
  {
    name: "magazzino_cod",
    component: ApiFilterServer,
    defaultValue: null,
    filterRender: (val) => `eq.${val.maga}`,
    componentProps: {
      endpoint: endpoints.WAREHOUSES,
      children: AutocompleteFilter,
      mapData: (data) => ({ label: `(${data.cod}) ${data.dexm}`, maga: data.cod }),
      dataName: "options",
      placeholder: "Magazzino",
      isOptionEqualToValue: (option, value) => option.label === value.label,
      sx: { minWidth: 230 },
      size: "small",
    },
  },
  default_filters.likeText({ field: "articolo", placeholder: "Articolo" }),
];

export default function Giacenze() {
  const { query, FilterOutlet } = useFilters(filters);
  const { newWindow } = useWindowManager();
  return (
    <Stack p={2} spacing={2}>
      <Typography variant="h4">GIACENZE</Typography>
      <ApiServer endpoint={endpoints.MOVEMENT_STOCKS} filters={query}>
        <ApiDataList
          verbose={true}
          columns={columns}
          filterOutlet={FilterOutlet}
          rowMap={(e, i) => ({ id: i, ...e, qta_disponibile: e.qta - e.qta_impegnata })}
          rowActionsPosition="end"
          rowActions={[
            {
              icon: (params) =>
                !params.row.ubicaz_id ? (
                  <Box></Box>
                ) : (
                  <Tooltip title="Ubicazione">
                    <LocationOn />
                  </Tooltip>
                ),
              func: (params) =>
                params.row.ubicaz_id &&
                newWindow({
                  url: "/ubicazione/" + params.row.ubicaz_id,
                  name: "Ubicazione",
                  params: params.row.ubicaz_id,
                  w: 1000,
                }),
            },
          ]}
        />
      </ApiServer>
    </Stack>
  );
}
