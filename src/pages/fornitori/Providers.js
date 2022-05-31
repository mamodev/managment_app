import { Stack, Typography } from "@mui/material";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import TextFilter from "components/modules/filters/TextFilter";
import { CreateProvider } from "components/modules/subjects/ProviderSelector";
import ApiDataList from "components/templates/ApiDataList";
import { useWindowManagerContext } from "context/WindowManagerContext";
import useFilters from "hooks/useFilters";
import providers_columns from "./columns";

export default function Providers() {
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
              <CreateProvider
                callback={({ id }) =>
                  newWindow({
                    url: `/fornitori/${id}`,
                    name: "Fornitore",
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
