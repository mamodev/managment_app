import { Add, ShoppingBag } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Backdrop,
  Button,
  CircularProgress,
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
import ClientSelector, { CreateClient } from "components/modules/subjects/ClientSelector";
import { SubjectSelectorDialog } from "components/modules/subjects/SubjectSelector";
import ApiDataList from "components/templates/ApiDataList";
import { useAuthContext } from "context/AuthContext";
import { useWindowManager } from "context/NewWindowManagerContext";
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
  const { newWindow } = useWindowManager();

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
  return (
    <Box sx={{ marginBottom: 3 }}>
      <Stack p={4} spacing={2}>
        <Typography variant="h4">LISTA ORDINI DI VENDITA</Typography>
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
  const { newWindow } = useWindowManager();

  const queryClient = useQueryClient();
  const { add } = endpoints.ODV_PRO_LIST(api);

  const { mutate: create, isLoading } = useMutation(add.func, {
    onSuccess: (data) => {
      newWindow({
        url: `/odv_pro/${data.id}/details`,
        name: "Ordine",
        params: data.numero,
        searchParams: { editing: true },
      });
      close();
      add.revalidate(data, queryClient);
    },
  });

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <SubjectSelectorDialog
        open={open}
        onClose={close}
        setValue={(client) => {
          create({
            in_tipo: "V",
            in_sede: sede,
            in_cliente_id: client.id,
            in_venditore: vendId,
          });
        }}
        title={"Seleziona un cliente "}
        endpoint={endpoints.CLIENTS}
        actions={<CreateClient variant="contained" color="secondary" />}
      />
    </>
  );
}
