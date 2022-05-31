import { Button, Stack, Typography } from "@mui/material";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiDataList from "components/templates/ApiDataList";
import ObjectTable from "components/templates/ObjectTable";
import { useAuthContext } from "context/AuthContext";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

const columns = [
  { field: "articolo", headerName: "Articolo", flex: 1.5 },
  { field: "dex", headerName: "Descrizione", flex: 1.5 },
  { field: "um", headerName: "Um", flex: 0.25 },
  { field: "qta", headerName: "qta", flex: 0.25 },
  { field: "stato_acq", headerName: "Stato Acquisto", flex: 1 },
  { field: "forn_o_ris", headerName: "Fornitore o risorsa", flex: 1 },
  { field: "qta_spedita", headerName: "Qta spedita", flex: 1 },
  { field: "qta_da_sped", headerName: "Da spedire", flex: 1 },
  { field: "qta_prebolla", headerName: "Prebolla", flex: 1, type: "number", editable: true },
];

function Header({ data }) {
  return (
    <ObjectTable
      object={{
        Cliente: { val: [data.cliente_denom, data.cliente_cell, data.cliente_email] },
        Consegna: data.data_prevista,
        "Cons nr.": data.gru_cons_id,
        Indirizzo: { val: [data.indirizzo1, data.indirizzo2, data.presso] },
        "Settimana pianif.": data.settimana_pianif,
        "Data missione": data.intervento_shedulato,
        "Appuntamento Cliente": { val: [data.intervento_orario, data.appuntamento_cliente] },
      }}
    />
  );
}

function Title({ data, emit }) {
  return (
    <Stack justifyContent="space-between" alignItems="center" direction="row">
      <Typography pt={2} variant="h4">
        PIANIFICAZIONE SPEDIZIONE - Ordine {data.numero}
      </Typography>
      <Button variant="contained" onClick={emit}>
        Emetti prebolla
      </Button>
    </Stack>
  );
}
export default function PianifSped() {
  const { id } = useParams();

  const { api } = useAuthContext();
  const queryClient = useQueryClient();
  const { update, issue } = endpoints.SHIPMENT_PLANNING_LIST(api, { id });
  const { enqueueSnackbar } = useSnackbar();

  const { mutate } = useMutation(update.func, {
    onSuccess: (data) => {
      issue.revalidate(data, queryClient);
    },
  });

  const { mutate: emit } = useMutation(issue.func, {
    onSuccess: (data) => {
      enqueueSnackbar("Prebolla emessa", { variant: "success" });
      issue.revalidate(data, queryClient);
    },
  });

  const handleCellEditCommit = ({ value }, { odv_riga_id }) => {
    mutate({ in_qta: value, in_id: odv_riga_id });
  };

  return (
    <Stack p={2} spacing={3}>
      <ApiServer singleMode endpoint={endpoints.SHIPMENT_PLANNING} params={{ id }} verbose>
        <Title emit={() => emit({ in_gruppo_cons: id })} />
        <Header />
      </ApiServer>

      <ApiServer endpoint={endpoints.SHIPMENT_PLANNING_LIST} params={{ id }}>
        <ApiDataList columns={columns} onCellEditCommit={handleCellEditCommit} />
      </ApiServer>
    </Stack>
  );
}
