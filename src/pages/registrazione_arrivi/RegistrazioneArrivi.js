import { ViewList } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import { green, yellow } from "@mui/material/colors";
import { Box } from "@mui/system";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";

import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import TableInput from "components/modules/TableInput";
import ApiDataList from "components/templates/ApiDataList";
import { formatDate } from "config/utils";
import { useAuthContext } from "context/AuthContext";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

//OPTIMIZE Check state re-renders
//TODO add specific validation

const fields = [
  {
    headerName: "Fornitore",
    field: "fornitore",
    type: "provider",
    required: "true",
  },
  {
    headerName: "Doc. fron nr",
    field: "doc",
    type: "string",
    required: "true",
  },
  {
    headerName: "Del",
    field: "data_doc",
    type: "date",
    required: "true",
  },
  {
    headerName: "Colli bolla",
    field: "colli",
    type: "number",
    required: "true",
  },
  {
    headerName: "Data arrivo",
    field: "data_arrivo",
    type: "date",
    required: "true",
  },
];

const columns = [
  { field: "numero", headerName: "Nr ODA", flex: 1 },
  { field: "riferimento", headerName: "Riferimento", flex: 1 },
  { field: "dex_esresa", headerName: "Descrizione", flex: 2 },
  { field: "um", headerName: "um", flex: 0.5 },
  { field: "qta", headerName: "Qta prevista", flex: 0.5, type: "number" },
  {
    field: "qta_in",
    headerName: "Qta Arrivo",
    flex: 0.5,
    type: "number",
    editable: true,
    cellClassName: ({ row, value }) => {
      return value > row.qta ? "super-app-theme--errorText" : "";
    },
  },
  { field: "colli_in", headerName: "Colli arrivo", flex: 0.5, type: "number", editable: true },
];

function Riepilogo({ summaryActive, onSummary: handleSummaryClick, colli, expectedColli }) {
  const counterStyle = {
    px: 1,
    py: 0.3,
    border: 1,
  };

  return (
    <Stack alignItems="center" direction="row" spacing={2}>
      <Button
        variant="outlined"
        size="small"
        color={summaryActive ? "error" : "primary"}
        startIcon={<ViewList />}
        onClick={handleSummaryClick}
      >
        {summaryActive ? "Chiudi riepilogo" : "Riepilogo"}
      </Button>
      <Tooltip
        title={
          expectedColli === ""
            ? "Devi impostare la quantità di colli nell'intestazione"
            : expectedColli == colli
            ? "Colli inseriti con successo"
            : "La quantità di colli non corrisponde con quella dell'intestazione"
        }
        arrow
      >
        <Stack direction="row">
          <Typography
            sx={{
              ...counterStyle,
              borderRight: 0,
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
              color: "primary.main",
            }}
          >
            Colli in arrivo
          </Typography>
          <Typography
            sx={{
              ...counterStyle,
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              borderColor:
                expectedColli === ""
                  ? "error.dark"
                  : expectedColli == colli
                  ? "success.dark"
                  : "warning.dark",
              backgroundColor:
                expectedColli === ""
                  ? "error.main"
                  : expectedColli == colli
                  ? "success.main"
                  : "warning.main",
              color:
                expectedColli === ""
                  ? "error.contrastText"
                  : expectedColli == colli
                  ? "success.contrastText"
                  : "warning.contrastText",
            }}
          >
            <strong>{colli}</strong>
          </Typography>
        </Stack>
      </Tooltip>
    </Stack>
  );
}

function CustomFooter() {
  return (
    <Stack px={2} py={1.5} direction="row" alignItems="center" spacing={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            width: 20,
            height: 20,
            backgroundColor: yellow[200],
            border: 1,
            borderColor: "primary.main",
          }}
        ></Box>
        <Typography variant="body2">Riga incompleta</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            width: 20,
            height: 20,
            backgroundColor: green[200],
            border: 1,
            borderColor: "primary.main",
          }}
        ></Box>
        <Typography variant="body2">Riga completa</Typography>
      </Stack>
    </Stack>
  );
}

const getColli = (A = []) => {
  if (A.length === 0) return 0;
  A = A.filter((e) => e.colli_in > 0 && e.qta_in > 0).map((e) => e.colli_in);
  if (A.length === 0) return 0;
  return A.reduce((p, n) => p + n);
};

export default function RegistrazioneArrivi() {
  const [header, setHeader] = useState({});
  const [rows, setRows] = useState([]);
  const [summaryActive, setSummaryActive] = useState(false);

  const handleHaderChange = useCallback((val) => setHeader(val), [setHeader]);
  const handleRowsChange = useCallback((rows) => setRows(rows), []);
  const handleCellEditCommit = useCallback(({ field, value }, row) => {
    setRows((old) => {
      const newRows = [...old];
      newRows[row.id][field] = value;
      return newRows;
    });
  }, []);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { api, sede } = useAuthContext();
  const { func, revalidate } = endpoints.INCOM_FROM_ODA(api).record;
  const queryClinet = useQueryClient();

  const { mutate: sendRecord, isLoading } = useMutation(func, {
    onSuccess: (data) => {
      revalidate(data, queryClinet);
      navigate(`/mag_ubicazioni/${data.id}`);
      enqueueSnackbar(data.msg, { variant: "success" });
    },
  });

  const handleSendMutation = () => {
    sendRecord({
      in_testata: {
        doc_est_nr: header.doc,
        doc_est_data: formatDate(header.data_doc),
        data_mov: formatDate(header.data_arrivo),
        doc_int_ricev_id: null,
        sede,
        controp_id: header.fornitore.id,
      },
      in_righe: rows
        .filter((e) => e.qta_in > 0 && e.colli_in > 0)
        .map((e) => ({ qta: e.qta_in, nr_colli: e.colli_in, oda_riga_id: e.oda_riga_id })),
    });
  };

  return (
    <Stack p={3} spacing={4}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">REGISTRAZIONE ARRIVO</Typography>
        <LoadingButton
          loading={isLoading}
          disabled={header.colli !== "" + getColli(rows) || !header.sendable}
          variant="contained"
          onClick={handleSendMutation}
        >
          Registra
        </LoadingButton>
      </Stack>

      <TableInput fields={fields} onChange={handleHaderChange} />
      <ApiServer endpoint={endpoints.INCOM_FROM_ODA}>
        <ApiDataList
          columns={columns}
          toolbarPosition="space-between"
          toolbarActions={[
            () => (
              <GridToolbarQuickFilter autoComplete="off" debounceMs={200} placeholder="Filtra..." />
            ),
            () => (
              <Riepilogo
                expectedColli={header.colli}
                colli={getColli(rows)}
                onSummary={() => setSummaryActive((old) => !old)}
                summaryActive={summaryActive}
              />
            ),
          ]}
          onCellEditCommit={handleCellEditCommit}
          rowMap={(e, i) => ({ id: i, ...e, qta_in: 0, colli_in: 0 })}
          rowFilter={summaryActive ? (e) => e.qta_in > 0 && e.colli_in > 0 : (e) => true}
          rowChange={handleRowsChange}
          componentsProps={{ toolbarProps: { sx: { py: 1, px: 3, pt: 2 } } }}
          components={{ Footer: CustomFooter }}
          commitMode={false}
          getRowClassName={({ row }) => {
            if ((row.colli_in > 0 && row.qta_in <= 0) || (row.colli_in <= 0 && row.qta_in > 0))
              return "super-app-theme--warning";
            if (row.colli_in > 0 && row.qta_in > 0) return "super-app-theme--success";
            else return "";
          }}
        />
      </ApiServer>
    </Stack>
  );
}
