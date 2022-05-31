import { Stack, Typography } from "@mui/material";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import TextFilter from "components/modules/filters/TextFilter";
import { CreateClient } from "components/modules/subjects/ClientSelector";
import ApiDataList from "components/templates/ApiDataList";
import { useWindowManagerContext } from "context/WindowManagerContext";
import useFilters from "hooks/useFilters";
import clienti_columns from "./columns";

const filters = [
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
];

export default function Clienti() {
  const { newWindow } = useWindowManagerContext();
  const { FilterOutlet, query } = useFilters(filters);
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
              <CreateClient
                callback={({ id }) =>
                  newWindow({
                    url: `/clienti/${id}`,
                    name: "Clienti",
                    params: id,
                    w: 420,
                    h: 490,
                  })
                }
              />
            ),
          ]}
        />
      </ApiServer>
    </Stack>
  );
}
