import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import TextFilter from "components/modules/filters/TextFilter";
import ApiDataList from "components/templates/ApiDataList";
import useFilters from "hooks/useFilters";
import clienti_columns from "./columns";

export default function Clienti() {
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
        <ApiDataList columns={clienti_columns} filterOutlet={FilterOutlet} />
      </ApiServer>
    </Stack>
  );
}
