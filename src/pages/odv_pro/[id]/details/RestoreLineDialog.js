import { LoadingButton } from "@mui/lab";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import useOdvDetailedListCancel from "api/mutation/useOdvDetailedListCancel";
import { reverseDate } from "config/utils";

export default function RestoreLineDialog({ row, onClose: handleClose }) {
  const { mutate: restoreRow, isLoading: isRestoring } = useOdvDetailedListCancel({
    onSuccess: () => handleClose(),
  });
  const handleRestore = () => restoreRow({ row, in_id: row.id, in_caus_annullam: null });
  return (
    <>
      <DialogTitle>Ripristina articolo</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Sei sicuro di voler ripristinare l'articolo {row.marchio} {row.linea} {row.codice}
          {row.dex}?
        </DialogContentText>
        <DialogContentText>
          <br />
          Causa: {row.caus_annullam_dex}
          <br />
          Annullato in data: {reverseDate(row.data_annullam, "/")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <LoadingButton loading={isRestoring} variant="contained" onClick={handleRestore}>
          Si
        </LoadingButton>
        <Button variant="contained" color="error" onClick={handleClose}>
          No
        </Button>
      </DialogActions>
    </>
  );
}
