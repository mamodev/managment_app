import { Add, Delete, Link, SettingsBackupRestore } from "@mui/icons-material";
import { Button, Dialog } from "@mui/material";
import { Box } from "@mui/system";
import ApiServer from "components/layout/ApiServer";
import ApiDataList from "components/templates/ApiDataList";
import { useCallback, useContext, useState } from "react";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { odv_pro_id_details } from "./columns";
import { useMutation, useQueryClient } from "react-query";
import { endpoints, POST } from "api";
import AuthContext from "context/AuthContext";
import CreateProductDialog from "pages/odv_pro/[id]/details/CreateProductDialog";

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
function AddProject({ data }) {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Button startIcon={<Link />} onClick={() => setOpen(true)}>
        Collega progetto
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        Ciao
      </Dialog>
    </Box>
  );
}

export default function OdvProDetails() {
  const data = useOutletContext();
  console.log(data);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editing = searchParams.has("editing");

  const queryClient = useQueryClient();

  const { api } = useContext(AuthContext);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries(["ODV_PRO", "HEADER", id]);
    queryClient.invalidateQueries(["ODV_PRO", "DETAILED_LIST", id]);
    queryClient.invalidateQueries(["ODV_PRO", "SUMMARY_LIST", id]);
  }, []);

  const { mutate: mutateLine } = useMutation(
    (data) => POST(api, { table: "lista_righe_upd", profile: "vend", data }),
    { onSuccess: refetch }
  );

  const { mutate: deleteLine } = useMutation(
    (data) => POST(api, { table: "lista_righe_del", profile: "vend", data }),
    {
      onSuccess: refetch,
    }
  );
  const { mutate: cancelLine } = useMutation(
    (data) => POST(api, { table: "lista_righe_ann", profile: "vend", data }),
    {
      onSuccess: refetch,
    }
  );

  const handleCellEditCommit = ({ field, value }, row) => {
    row[field] = value;
    mutateLine({
      in_id: row.id,
      in_linea: row.linea,
      in_codice: row.codice,
      in_dex: row.dex,
      in_dex2: row.dex2,
      in_costo_un_orig: row.costo_un_orig,
      in_ricar_su_prog: row.ricar_su_prog ? row.ricar_su_prog : 0,
      in_sconto_vend: row.sconto_vend ? row.sconto_vend : 0,
      in_qta: row.qta,
    });
  };

  return (
    <ApiServer endpoint={endpoints.ODV_PRO_DETAILED_LIST} params={{ id }}>
      <ApiDataList
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
        toolbarActions={[AddProduct, AddProject]}
        rowActions={
          editing
            ? [
                {
                  icon: <SettingsBackupRestore />,
                  func: ({ id }) =>
                    cancelLine({ in_id: id, in_caus_annullam: "default" }),
                },
                {
                  icon: <Delete />,
                  func: ({ id }) => deleteLine({ in_id: id }),
                },
              ]
            : []
        }
      />
    </ApiServer>
  );
}
