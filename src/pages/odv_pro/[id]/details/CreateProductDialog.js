import FindProduct from "components/modules/FindProduct";

const { Add, ReplayOutlined } = require("@mui/icons-material");
const { LoadingButton } = require("@mui/lab");
const {
  Dialog,
  DialogTitle,
  Stack,
  Button,
  DialogContent,
  TextField,
  InputAdornment,
  DialogActions,
} = require("@mui/material");
const { POST } = require("api");
const { default: AuthContext } = require("context/AuthContext");
const { useState, useContext } = require("react");
const { useMutation, useQueryClient } = require("react-query");

//TODO Flag for editing?
const DEFAULT_STATE = {
  desc: "",
  qta: "1",
  sconto: "0",
  codice: "",
  prezzo_un: "0",
};

export default function CreateProductDialog({ id, ...dialogProps }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState();
  const [fields, setFields] = useState(DEFAULT_STATE);
  const { api } = useContext(AuthContext);

  const closeHandler = (p) => {
    setOpen(false);
    if (p) setProduct(p);
  };
  const resetHandler = () => {
    setProduct(undefined);
    setFields(DEFAULT_STATE);
  };

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (data) =>
      POST(api, {
        table: "lista_righe_cre",
        profile: "vend",
        data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["ODV_PRO", "HEADER", id], {
          exact: true,
        });
        queryClient.invalidateQueries(["ODV_PRO", "DETAILED_LIST", id], {
          exact: true,
        });
        queryClient.invalidateQueries(["ODV_PRO", "SUMMARY_LIST", id], {
          exact: true,
        });
        resetHandler();
        dialogProps.onClose();
      },
    }
  );
  const createHandler = () => {
    mutate({
      in_lista_id: 0,
      in_lista_testate_id: id,
      in_riga_prog_orig_id: 0,
      in_art_id: product.art_id,
      in_marchio: product.marchio,
      in_linea: product.linea,
      in_codice: fields.codice,
      in_dex: product.art_dex,
      in_prezzo_un_lordo: parseFloat(fields.prezzo_un),
      in_sconto_vend: parseFloat(fields.sconto),
      in_qta: parseFloat(fields.qta),
      in_cond_id: product.cond_id,
    });
  };

  const isSendable =
    product &&
    (!product.obblig_codice ||
      (product.obblig_codice && fields.codice !== "")) &&
    (!product.obblig_dex || (product.obblig_dex && product.art_dex !== "")) &&
    (!product.obblig_linea || (product.obblig_linea && product.linea !== "")) &&
    (!product.obblig_marchio ||
      (product.obblig_marchio && product.marchio !== "")) &&
    fields.qta !== "" &&
    fields.sconto !== "" &&
    product.cod_iva !== "" &&
    fields.prezzo_un !== "";

  console.log(product);
  return (
    <Dialog
      {...dialogProps}
      onClose={() => dialogProps.onClose() && resetHandler()}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          Aggiungi un prodotto
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Seleziona un prodotto
          </Button>
        </Stack>
      </DialogTitle>
      <FindProduct isOpen={open} onClose={closeHandler} />
      <DialogContent>
        <Stack spacing={3} mt={3} mb={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              variant="standard"
              disabled={!product || !product.modif_marchio}
              value={product ? product.marchio : ""}
              onChange={(e) =>
                setProduct((old) => ({ ...old, marchio: e.target.value }))
              }
              label="Marchio"
            />
            <TextField
              variant="standard"
              disabled={!product || !product.modif_linea}
              value={product ? product.linea : ""}
              onChange={(e) =>
                setProduct((old) => ({ ...old, linea: e.target.value }))
              }
              label="Linea"
            />
            <TextField
              variant="standard"
              disabled={!product || !product.modif_codice}
              value={fields.codice}
              onChange={(e) =>
                setFields((old) => ({ ...old, codice: e.target.value }))
              }
              label="Codice"
            />
            <TextField
              variant="standard"
              disabled
              value={product ? product.cat_dex : ""}
              onChange={(e) =>
                setProduct((old) => ({ ...old, cat_dex: e.target.value }))
              }
              label="Categoria"
            />
            <TextField
              sx={{ minWidth: 250 }}
              variant="standard"
              disabled={!product || !product.modif_dex}
              value={product ? product.art_dex : ""}
              onChange={(e) =>
                setProduct((old) => ({ ...old, art_dex: e.target.value }))
              }
              label="Descrizione"
              multiline
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              sx={{ width: 85 }}
              variant="standard"
              disabled={!product}
              label="Quantità"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">n.</InputAdornment>
                ),
              }}
              value={fields.qta}
              onChange={(e) =>
                !isNaN(e.target.value) &&
                setFields((old) => ({ ...old, qta: e.target.value }))
              }
            />
            <TextField
              sx={{ width: 100 }}
              variant="standard"
              disabled={!product}
              label="Prezzo un."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              }}
              value={fields.prezzo_un}
              onChange={(e) =>
                !isNaN(e.target.value) &&
                setFields((old) => ({ ...old, prezzo_un: e.target.value }))
              }
            />
            <TextField
              sx={{ width: 80 }}
              variant="standard"
              disabled={!product}
              label="Sconto"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              }}
              value={fields.sconto}
              onChange={(e) =>
                !isNaN(e.target.value) &&
                setFields((old) => ({ ...old, sconto: e.target.value }))
              }
            />

            <TextField
              sx={{ width: 80 }}
              variant="standard"
              disabled
              label="IVA"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              }}
              value={product ? product.cod_iva : ""}
              onChange={(e) =>
                !isNaN(e.target.value) &&
                setProduct((old) => ({ ...old, cod_iva: e.target.value }))
              }
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          onClick={createHandler}
          loading={isLoading}
          disabled={!isSendable}
          variant="contained"
          startIcon={<Add />}
        >
          Aggiungi
        </LoadingButton>

        <Button
          disabled={!product}
          variant="outlined"
          color="error"
          endIcon={<ReplayOutlined />}
          onClick={resetHandler}
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
}
