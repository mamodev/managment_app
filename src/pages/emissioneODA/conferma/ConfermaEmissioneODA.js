import { Button, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiDataList from "components/templates/ApiDataList";
import { useParams } from "react-router-dom";
import { useAuthContext } from "context/AuthContext";
import { useMutation, useQueryClient } from "react-query";
import { LoadingButton } from "@mui/lab";
import { Done, Error, PaymentSharp, PaymentsOutlined } from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";
import { formatDate, reverseDate } from "config/utils";

const columns = [
  {
    field: "data_cons_a_cli",
    headerName: "Data consegna a cliente",
    flex: 1,
  },
  {
    field: "fornitore_dex",
    headerName: "Fornitore",
    flex: 1,
  },
  {
    field: "prima_data_possibile",
    headerName: "Prima data possibile",
    valueFormatter: ({ value: date }) => reverseDate(date, "/"),
    flex: 1,
  },
  {
    field: "consegna_richiesta",
    headerName: "Consegna richiesta",
    type: "date",
    valueFormatter: ({ value: date }) => reverseDate(date, "/"),
    valueGetter: ({ value: date }) => formatDate(date),
    valueSetter: (params) => {
      if (params.value instanceof Date) return { ...params.row, consegna_richiesta: params.value };
      return params.row;
    },

    preProcessEditCellProps: ({ props, row }) => {
      const startDate = new Date(row.prima_data_possibile);
      return { ...props, error: +props.value < +startDate };
    },
    flex: 1,
    editable: true,
  },
  {
    field: "status",
    headerName: "Ordina",
    renderCell: (params) => {
      return (
        <LoadingButton
          loading={params.row.status === "LOADING"}
          color={
            params.row.status ? (params.row.status === "SUCCESS" ? "success" : "error") : "primary"
          }
          size="small"
        >
          <Tooltip title="Acquista" arrow>
            {params.row.status ? (
              params.row.status === "SUCCESS" ? (
                <Done />
              ) : (
                <Error />
              )
            ) : (
              <PaymentSharp />
            )}
          </Tooltip>
        </LoadingButton>
      );
    },
  },
];

export default function ConfermaEmissioneODA() {
  const { id } = useParams();
  const [rows, setRows] = useState(null);

  const { api } = useAuthContext();
  const {
    confirm: { func, revalidate },
    key,
  } = endpoints.ODA_FROM_ODV_CONFIRM(api, { id });

  const queryClient = useQueryClient();

  const { mutate } = useMutation(func, {
    onSuccess: (data) => revalidate(data, queryClient),
    onError: (data, vars) => {
      queryClient.getDefaultOptions("onError").mutations.onError(data, vars);

      queryClient.setQueryData(key, (data) =>
        data.map((e) => (vars.in_fornitore_id === e.fornitore_id ? { ...e, status: "ERROR" } : e))
      );
    },
  });

  const cellClickHandler = useCallback(
    ({ field, row }) => {
      if (field === "status" && row[field] !== "LOADING") {
        queryClient.setQueryData(key, (data) =>
          data.map((e) => (row.fornitore_id === e.fornitore_id ? { ...e, status: "LOADING" } : e))
        );

        //TODO add emesso da
        mutate(
          {
            in_odv_id: id,
            in_fornitore_id: row.fornitore_id,
            in_prima_data_possibile: row.prima_data_possibile,
            in_data_richiesta: formatDate(row.consegna_richiesta),
            in_emesso_da: 19,
          },
          {
            onSuccess: (data) =>
              queryClient.setQueryData(key, (data) =>
                data.map((e) =>
                  row.fornitore_id === e.fornitore_id ? { ...e, status: "SUCCESS" } : e
                )
              ),
          }
        );
      }
    },
    [id, mutate, queryClient]
  );

  const rowChangeHandler = useCallback((rows) => setRows(rows), []);

  const rowMap = useCallback(
    (e, i) => ({
      id: i,
      status: 0,
      ...e,
      consegna_richiesta: new Date(e.prima_data_possibile),
    }),
    []
  );

  const toolbarActions = useMemo(
    () => [
      () => <Typography pl={2}>Conferma ODA per ODV</Typography>,
      () => (
        <Button
          disabled={!rows}
          variant="outlined"
          size="small"
          sx={{ margin: 1, mr: 2 }}
          endIcon={<PaymentsOutlined />}
          onClick={() => rows.forEach((row) => cellClickHandler({ field: "status", row }))}
        >
          Ordina tutti
        </Button>
      ),
    ],
    [rows, cellClickHandler]
  );

  console.log(rows);
  return (
    <Box p={2}>
      <ApiServer endpoint={endpoints.ODA_FROM_ODV_CONFIRM} params={{ id }}>
        <ApiDataList
          onCellEditCommit={({ field, value: date, row }) => {
            if (field === "consegna_richiesta" && date instanceof Date) {
              setRows((rows) => {
                const newRows = [...rows];
                const index = newRows.indexOf(
                  newRows.find((e) => e.fornitore_id === row.fornitore_id)
                );
                newRows[index] = { ...row, consegna_richiesta: date };
                return newRows;
              });
            }

            if (date instanceof Date) row[field] = date;
            return row;
          }}
          rowChange={rowChangeHandler}
          toolbarPosition="space-between"
          toolbarActions={toolbarActions}
          onCellClick={cellClickHandler}
          rowMap={rowMap}
          columns={columns}
        />
      </ApiServer>
    </Box>
  );
}
