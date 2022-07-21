import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

import Form from "./Form";

export default function FormDialog({
  open,
  onClose: close,
  loading = false,
  fields = [],
  send = () => {},
  title = "Titolo",
  sendText = "Invia",
  closeText = "Chiudi",
}) {
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Form
          sendText={sendText}
          send={send}
          fields={fields}
          loading={loading}
          actions={[
            <Button variant="contained" color="error" onClick={close}>
              {closeText}
            </Button>,
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
