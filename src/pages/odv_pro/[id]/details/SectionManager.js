import { Add, Delete } from "@mui/icons-material";
import { Button, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useDialog } from "context/DialogContext";
import { useEffect, useState } from "react";

export default function SectionManager({ data }) {
  const { closeDialog } = useDialog();
  const [rows, setRows] = useState([]);

  useEffect(
    () => setRows(data.map((e, i) => ({ id: i, ...e, __reorder__: e.dex }))),
    [setRows, data]
  );

  return (
    <>
      <DialogTitle>Gestisci struttura</DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => closeDialog("Add section")}>
          Chiudi
        </Button>
      </DialogActions>
    </>
  );
}
