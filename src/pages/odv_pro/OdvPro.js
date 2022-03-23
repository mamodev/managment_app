import { Stack, Typography } from "@mui/material";
import ApiServer from "components/layout/ApiServer";
import ApiDataList from "components/templates/ApiDataList";
import useFilters from "hooks/useFilters";
import odv_pro_columns from "./columns";
import odv_pro_filters from "./filters";

export default function OdvPro() {
  const { FilterOutlet, query } = useFilters(
    {
      table: "v_lista_testate",
      profile: "vend",
      select:
        "tipo_decod,numero,del,denom,sede,venditore,data_ult_modif,stato_dex, stato_cod,lista_testate_id",
    },
    odv_pro_filters
  );

  return (
    <Stack p={4} spacing={2}>
      <Typography variant="h4">LISTA TESTATE</Typography>
      <ApiServer query={query}>
        <ApiDataList
          columns={odv_pro_columns}
          filterOutlet={FilterOutlet}
          containerProps={{ spacing: 4 }}
        />
      </ApiServer>
    </Stack>
  );
}
