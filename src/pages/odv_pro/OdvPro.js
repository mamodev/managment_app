import { Add, ShoppingBag } from "@mui/icons-material";
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
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ClientSelector from "components/modules/ClientSelector";
import ApiDataList from "components/templates/ApiDataList";
import { useAuthContext } from "context/AuthContext";
import { useWindowManagerContext } from "context/WindowManagerContext";
import useFilters from "hooks/useFilters";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import odv_pro_columns from "./columns";
import odv_pro_filters from "./filters";

//TODO fix action ODA only for orders (Conditional rendering on actions)
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
  const { newWindow } = useWindowManagerContext();

  const cellClickHandler = useCallback(
    ({ field, row: { odv_id, tipo_decod, numero } }) => {
      if (field === "numero") {
        newWindow({
          url: `/odv_pro/${odv_id}/${tipo_decod === "Ordine" ? "state" : "details"}`,
          name: "Ordine",
          params: numero,
          w: 1000,
        });
      }
    },
    [newWindow]
  );

  const [open, setOpen] = useState(false);
  const [defaultClient, setDefaultClient] = useState(null);

  const actions = useMemo(
    () => [
      {
        icon: ({ row: { denom } }) => {
          return (
            <Tooltip arrow title={`Nuovo ordine per ${denom}`}>
              <Add />
            </Tooltip>
          );
        },
        func: ({ row: { cliente_id, denom } }) => {
          setDefaultClient({ id: cliente_id, denom });
          setOpen(true);
        },
      },
      {
        icon: () => (
          <Tooltip arrow title="Ordine di acquisto">
            <ShoppingBag />
          </Tooltip>
        ),
        func: ({ row: { odv_id } }) => {
          newWindow({
            url: `/emissione_oda/${odv_id}`,
            params: odv_id,
            name: "ODA per ODV",
            w: 1200,
            h: 600,
          });
        },
      },
    ],
    [newWindow]
  );

  const toolbarActions = useMemo(() => [AddOrder(setOpen)], []);
  console.log("Over");
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
            toolbarActions={toolbarActions}
            rowActions={actions}
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
  const { newWindow } = useWindowManagerContext();

  const [client, setClient] = useState(null);
  const [type, setType] = useState(null);

  const queryClient = useQueryClient();
  const { add } = endpoints.ODV_PRO_LIST(api);

  const { mutate: create, isLoading } = useMutation(add.func, {
    onSuccess: (data) => {
      newWindow({
        url: `/odv_pro/${data.id}/details`,
        name: "Ordine",
        params: data.numero,
      });
      close();
      add.revalidate(data, queryClient);
    },
  });

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
            isOptionEqualToValue={(option, value) => option.label === value.label}
            options={[
              { id: "V", label: "Ordine" },
              { id: "P", label: "Progetto" },
            ]}
            renderInput={(props) => <TextField {...props} size="small" label="Tipo" />}
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
