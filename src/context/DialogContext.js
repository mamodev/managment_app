import { Dialog } from "@mui/material";
import React, { useCallback, useContext, useRef, useState } from "react";
const DialogContext = React.createContext({});

function DialogProvider({ children }) {
  const [dialogs, setDialogs] = useState({});
  const portalRef = useRef();
  const handleClose = useCallback(
    (key) =>
      setDialogs((old) => {
        const newDialogs = { ...old };
        delete newDialogs[key];
        return newDialogs;
      }),
    []
  );

  const openDialog = useCallback(
    (key = "dialog", content = "", props = {}) =>
      setDialogs((old) => ({
        ...old,
        [key]: (
          <Dialog key={key} open={true} onClose={() => handleClose(key)} {...props}>
            {content}
          </Dialog>
        ),
      })),
    [handleClose]
  );

  const addDialog = useCallback(
    (key = "dialog", content = "") => setDialogs((old) => ({ ...old, [key]: content })),
    []
  );

  return (
    <DialogContext.Provider
      value={{ addDialog, openDialog, closeDialog: handleClose, portal: portalRef.current }}
    >
      <div ref={portalRef} />
      {Object.keys(dialogs).map((e) => dialogs[e])}
      {children}
    </DialogContext.Provider>
  );
}

function useDialog() {
  return useContext(DialogContext);
}

export { DialogContext, DialogProvider, useDialog };
