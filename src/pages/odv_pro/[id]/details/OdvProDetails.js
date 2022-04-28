import {
  AccountTree,
  Add,
  Delete,
  Link,
  SettingsBackupRestore,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ApiServer from "components/layout/ApiServer";
import ApiDataList from "components/templates/ApiDataList";
import { useMemo, useState } from "react";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { odv_pro_id_details } from "./columns";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { endpoints } from "api";
import { useAuthContext } from "context/AuthContext";
import CreateProductDialog from "pages/odv_pro/[id]/details/CreateProductDialog";
import { useSnackbar } from "notistack";

function AddProduct({ data }) {
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  return (
    <Box>
      <Button startIcon={<Add />} onClick={() => setOpen(true)}>
        Aggiungi articolo
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <CreateProductDialog
          id={id}
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
        />
      </Dialog>
    </Box>
  );
}
function AddProject() {
  const { api } = useAuthContext();
  const { id } = useParams();
  const { cliente_id } = useOutletContext();
  const { key, func } = endpoints.PRO_FOR_ODV(api, cliente_id);
  const [open, setOpen] = useState(false);
  const { data, isSuccess } = useQuery(key, func);

  const { add } = endpoints.ODV_PRO_DETAILED_LIST(api, { id });
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(add.func, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["PRO_FOR_ODV", cliente_id]);
      add.revalidate(data, queryClient);
      setOpen(false);
    },
  });
  return (
    <Box>
      {isSuccess && data?.length > 0 && (
        <Button startIcon={<Link />} onClick={() => setOpen(true)}>
          Collega progetto
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box p={2}>
          <Typography variant="h6" mb={2}>
            Seleziona un progetto
          </Typography>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              overflow: "auto",
              maxHeight: 300,
            }}
          >
            {data?.map((e, i) => (
              <ListItemButton
                key={i}
                onClick={() =>
                  mutate({
                    in_lista_id: null,
                    in_odv_id: id,
                    in_prog_orig_id: e.id,
                    in_art_id: null,
                    in_marchio: null,
                    in_linea: null,
                    in_codice: null,
                    in_dex: null,
                    in_prezzo_un_lordo: 0,
                    in_sconto_vend: 0,
                    in_qta: 0,
                    in_cond_id: null,
                  })
                }
              >
                <ListItemIcon>
                  <AccountTree />
                </ListItemIcon>
                <ListItemText
                  primary={isLoading ? "Aggiungo..." : e.numero}
                  secondary={e.del}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Chiudi</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function OdvProDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const editing = useMemo(() => searchParams.has("editing"), [searchParams]);
  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();
  const { api } = useAuthContext();

  const { update, remove, cancel } = endpoints.ODV_PRO_DETAILED_LIST(api, {
    id,
  });

  const { mutate: mutateLine } = useMutation(update.func, {
    onSuccess: (data) => {
      enqueueSnackbar("Riga aggiornata", { variant: "success" });
      update.revalidate(data, queryClient);
    },
  });

  const { mutate: deleteLine } = useMutation(remove.func, {
    onSuccess: (data) => {
      enqueueSnackbar("Riga eliminata", { variant: "success" });
      remove.revalidate(data, queryClient);
    },
  });

  const { mutate: cancelLine } = useMutation(cancel.func, {
    onSuccess: (data) => {
      enqueueSnackbar("Riga annullata", { variant: "success" });
      cancel.revalidate(data, queryClient);
    },
  });

  const handleCellEditCommit = ({ field, value }, row) => {
    row[field] = value;

    mutateLine({
      in_id: row.id,
      in_linea: row.linea,
      in_codice: row.codice,
      in_dex: row.dex,
      in_dex2: row.dex2,
      in_prezzo_un_lordo: row.prezzo_un_lordo,
      in_sconto_vend: row.sconto_vend ? row.sconto_vend : 0,
      in_qta: row.qta,
      in_tum: row.tum,
    });
  };

  return (
    <ApiServer endpoint={endpoints.ODV_PRO_DETAILED_LIST} params={{ id }}>
      <ApiDataList
        verbose={true}
        columns={odv_pro_id_details}
        containerProps={{ spacing: 4 }}
        isCellEditable={({ field, row }) => {
          if (!editing) return false;
          switch (field) {
            case "marchio":
              return row.modif_marchio;
            case "linea":
              return row.modif_linea;
            case "codice":
              return row.modif_codice;
            case "dex":
              return row.modif_dex;
            case "dex2":
              return row.modif_dex2;
            default:
              return true;
          }
        }}
        onCellEditCommit={handleCellEditCommit}
        toolbarActions={editing ? [AddProduct, AddProject] : []}
        getRowClassName={({ row }) =>
          row.prog_orig_id ? "super-app-theme--project" : ""
        }
        rowActions={[
          {
            icon: <SettingsBackupRestore />,
            func: ({ id }) =>
              cancelLine({ in_id: id, in_caus_annullam: "default" }),
          },
          {
            icon: <Delete />,
            func: ({ id }) => deleteLine({ in_id: id }),
          },
        ]}
        columnVisibilityModel={{ actions: editing }}
      />
    </ApiServer>
  );
}
