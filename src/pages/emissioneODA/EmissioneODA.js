import { ShoppingBasket } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiDataList from "components/templates/ApiDataList";
import { useAuthContext } from "context/AuthContext";
import { useWindowManager } from "context/NewWindowManagerContext";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

export default function EmissioneODA() {
  const { id } = useParams();
  const { newWindow } = useWindowManager();
  const { enqueueSnackbar } = useSnackbar();

  const { api } = useAuthContext();
  const { func, revalidate } = endpoints.ODA_FROM_ODV(api, { id }).update;
  const queryClient = useQueryClient();

  const { mutate } = useMutation(func, { onSuccess: (data) => revalidate(data, queryClient) });

  const handleCellEditCommit = ({ field, value }, row) => {
    row[field] = value;
    queryClient.setQueryData(["ODA_FROM_ODV", { id }], (old) => {
      const newVal = [...old];
      let index = 0;
      for (let i = 0; i < newVal.length; ++i)
        if (newVal[i].odv_riga_id === row.odv_riga_id) index = i;

      if (index !== -1) newVal[index] = row;

      return newVal;
    });

    mutate({ in_acquistare_qta: row.acquistare_qta, in_odv_riga_id: row.odv_riga_id });
  };

  return (
    <Box p={2}>
      <ApiServer endpoint={endpoints.ODV_PRO_HEADER} params={{ id }}>
        <Title />
      </ApiServer>
      <ApiServer endpoint={endpoints.ODA_FROM_ODV} params={{ id }}>
        <Test></Test>
        <ApiDataList
          verbose={true}
          onCellEditCommit={handleCellEditCommit}
          toolbarActions={[
            () => (
              <Button
                variant="outlined"
                onClick={() =>
                  newWindow({
                    url: `/emissione_oda/${id}/conferma`,
                    params: id,
                    name: "ODA da ODV conferma",
                    h: 420,
                  })
                }
                endIcon={<ShoppingBasket />}
              >
                Ordina
              </Button>
            ),
          ]}
          toolbarPosition={"end"}
          columns={[
            { field: "nr", headerName: "Gruppo", flex: 1, align: "center", maxWidth: 70 },
            { field: "data_cons_a_cli", headerName: "Data prevista", flex: 1 },
            { field: "item", headerName: "Descrizione", flex: 1, minWidth: 400 },
            { field: "um", headerName: "um", flex: 1, maxWidth: 50, align: "center" },
            { field: "qta", headerName: "Qta", flex: 1, maxWidth: 50, align: "center" },
            { field: "stato_acquisto", headerName: "Stato acquisto", flex: 1 },
            { field: "fornitore_dex", headerName: "Fornitore", flex: 1 },
            { field: "qta_gia_ordinata", headerName: "Qta già acquistata", flex: 1 },
            { field: "qta_da_ordinare", headerName: "Qta da acquistare", flex: 1 },
            {
              field: "acquistare_qta",
              headerName: "Qta nuovo acquisto",
              editable: true,
              type: "number",
              flex: 1,
              preProcessEditCellProps: ({ props, row }) => {
                const isError =
                  typeof props.value === "number" && row.qta_da_ordinare < props.value;
                if (isError)
                  enqueueSnackbar("La quantità non deve superare la quantità da acquistare", {
                    variant: "error",
                  });
                return {
                  ...props,
                  error: isError,
                };
              },
            },
            { field: "prima_data_possibile", headerName: "Prima data possibile", flex: 1 },
          ]}
        />
      </ApiServer>
    </Box>
  );
}

function Title({ data }) {
  data = data ? data[0] : {};
  return (
    <Typography variant="h5" mb={2}>
      Ordine di acquisto per {data.tipo_decod} {data.numero} ({data.denom})
    </Typography>
  );
}

function Test({ data }) {
  useEffect(
    () =>
      console.log(
        "Data",
        data.map((e) => e.acquistare_qta)
      ),
    [data]
  );
  return <></>;
}
