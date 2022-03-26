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

  const cellClickHandler = ({
    field,
    row: { lista_testate_id, tipo_decod },
  }) => {
    if (field === "numero") {
      let params = `scrollbars=no,status=no,location=no,toolbar=no,menubar=no,width=850,height=500`;
      window.open(
        `${window.origin}/odv_pro/${lista_testate_id}/${
          tipo_decod === "Ordine" ? "state" : "details"
        }/?&minimal=true`,
        `order_status-${lista_testate_id}`,
        params
      );
    }
  };
  return (
    <Stack p={4} spacing={2}>
      <Typography variant="h4">LISTA TESTATE</Typography>
      <ApiServer query={query}>
        <ApiDataList
          columns={odv_pro_columns}
          filterOutlet={FilterOutlet}
          containerProps={{ spacing: 4 }}
          onCellClick={cellClickHandler}
        />
      </ApiServer>
    </Stack>
  );
}
