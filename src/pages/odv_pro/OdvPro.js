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

const AddOrder = (setOpen) => {
  return function Component() {
    return (
      <Box>
        <Button startIcon={<Add />} onClick={() => setOpen(true)}>
          Aggiungi
        </Button>
      </Box>
    );
  };
};
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

  const [open, setOpen] = useState(false);
  const [defaultClient, setDefaultClient] = useState(null);

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
            toolbarActions={[AddOrder(setOpen)]}
            rowActions={[
              {
                icon: <Add />,
                func: ({ row: { cliente_id, denom } }) => {
                  setDefaultClient({ id: cliente_id, denom });
                  setOpen(true);
                },
              },
            ]}
            rowActionsPosition="end"
          />
        </ApiServer>

        <CreateOrderDialog
          open={open}
          onClose={() => {
            setOpen(false);
            if (defaultClient) setDefaultClient(null);
          }}
          defaultClient={defaultClient}
        />
      </Stack>
    </Box>
  );
}

function CreateOrderDialog({ open, defaultClient, onClose: close }) {
  const { api, sede, vendId } = useAuthContext();

  const [client, setClient] = useState(null);
  const [type, setType] = useState(null);

  const queryClient = useQueryClient();
  const { mutate: create, isLoading } = useMutation(
    (data) =>
      POST(api, { table: "lista_testate_cre", profile: "vend", data: data }),
    {
      onSuccess: () => {
        close();
        queryClient.invalidateQueries(["ODV_PRO"]);
      },
    }
  );

  useEffect(() => {
    if (open) {
      setClient(null);
      setType(null);
    }
  }, [open]);

  useEffect(() => {
    if (defaultClient) setClient(defaultClient);
  }, [defaultClient]);

  return (
    <Dialog open={open} onClose={() => close}>
      <DialogTitle>Aggiungi</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Autocomplete
            value={type}
            onChange={(e, v) => setType(v)}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            options={[
              { id: "V", label: "Ordine" },
              { id: "P", label: "Progetto" },
            ]}
            renderInput={(props) => (
              <TextField {...props} size="small" label="Tipo" />
            )}
          />
          <ClientSelector value={client} onChange={(val) => setClient(val)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          disabled={!client || !type}
          onClick={() =>
            create({
              in_tipo: type.id,
              in_sede: sede,
              in_cliente_id: client.id,
              in_venditore: vendId,
            })
          }
        >
          Crea
        </LoadingButton>
        <Button variant="contained" color="error" onClick={() => close()}>
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
