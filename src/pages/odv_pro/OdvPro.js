import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { endpoints, POST } from "api";
import ApiServer from "components/layout/ApiServer";
import ClientSelector from "components/modules/ClientSelector";
import ApiDataList from "components/templates/ApiDataList";
import { useAuthContext } from "context/AuthContext";
import useFilters from "hooks/useFilters";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import odv_pro_columns from "./columns";
import odv_pro_filters from "./filters";

function AddOrder() {
  const [open, setOpen] = useState(false);
  const { api, sede, vendId } = useAuthContext();

  const [client, setClient] = useState(null);

  const queryClient = useQueryClient();
  const { mutate: create, isLoading } = useMutation(
    (data) =>
      POST(api, { table: "lista_testate_cre", profile: "vend", data: data }),
    {
      onSuccess: () => {
        setOpen(false);
        queryClient.invalidateQueries(["ODV_PRO_LIST"]);
      },
    }
  );

  useEffect(() => {
    if (open) {
      setClient(null);
    }
  }, [open]);
  return (
    <Box>
      <Button startIcon={<Add />} onClick={() => setOpen(true)}>
        Aggiungi
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Aggiungi</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2} mt={1}>
            <ClientSelector value={client} onChange={(val) => setClient(val)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            disabled={!client}
            onClick={() =>
              create({
                in_tipo: "V",
                in_sede: sede,
                in_cliente_id: client.id,
                in_venditore: vendId,
              })
            }
          >
            Crea
          </LoadingButton>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpen(false)}
          >
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default function OdvPro() {
  const { FilterOutlet, query } = useFilters(odv_pro_filters);

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
    <Box sx={{ marginBottom: 3 }}>
      <Stack p={4} spacing={2}>
        <Typography variant="h4">LISTA TESTATE</Typography>
        <ApiServer endpoint={endpoints.ODV_PRO_LIST} filters={query}>
          <ApiDataList
            columns={odv_pro_columns}
            filterOutlet={FilterOutlet}
            containerProps={{ spacing: 4 }}
            onCellClick={cellClickHandler}
            toolbarActions={[AddOrder]}
          />
        </ApiServer>
      </Stack>
    </Box>
  );
}
