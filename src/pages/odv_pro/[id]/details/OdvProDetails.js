import { Add, Link } from "@mui/icons-material";
import { Button, Dialog } from "@mui/material";
import { Box } from "@mui/system";
import ApiServer from "components/layout/ApiServer";
import ApiDataList from "components/templates/ApiDataList";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { odv_pro_id_details } from "./columns";

function AddProduct({ data }) {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Button startIcon={<Add />} onClick={() => setOpen(true)}>
        Aggiungi articolo
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        Ciao
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
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editing = searchParams.has("editing");
  return (
    <ApiServer
      query={{
        table: "v_lista_righe",
        profile: "vend",
        lista_testate_id: `eq.${id}`,
        select:
          "id,lista_testate_id,s1,s2,s3,s4,tr,art_id,marchio,linea,codice,dex,dex2,costo_un_orig,variaz_su_catal,ricar_su_prog,sconto_vend,costo_un_mio,prezzo_un_lordo,prezzo_un_netto,qta,um,cod_iva,prz_tot_ivato,gru_fatt_nr,gru_cons_nr,causale,prz_catal_est_ivato,categ_contab,b_s,prz_tot_non_ivato,margine,modif_marchio,modif_linea,modif_codice,modif_dex,modif_dex2,obblig_marchio,obblig_linea,obblig_codice,obblig_dex,obblig_dex2",
      }}
    >
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
        toolbarActions={[AddProduct, AddProject]}
      />
    </ApiServer>
  );
}
