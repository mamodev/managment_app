import React from "react";
import ReactDOM from "react-dom";
import Router from "routes";

import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/lab";
import AuthContextProvider from "context/AuthContextProvider";
import { BrowserRouter } from "react-router-dom";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import itLocale from "date-fns/locale/it";

import ReactQueryProvider from "context/QueryClientProvider";
import { SnackbarProvider } from "notistack";
import { ConfigContextProvider } from "context/ConfigContext";
import { WindowManagerProvider } from "context/NewWindowManagerContext";
import theme from "config/theme";
import "./style/index.css";
import { DialogProvider } from "context/DialogContext";
import { WindowProvider } from "context/WindowManagerContext";

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

if (window.name === "") window.windowManagerSession = uuidv4();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={5}>
          <AuthContextProvider>
            <ReactQueryProvider>
              <ConfigContextProvider>
                <WindowManagerProvider>
                  <WindowProvider>
                    <DialogProvider>
                      <LocalizationProvider dateAdapter={AdapterDateFns} locale={itLocale}>
                        <Router />
                      </LocalizationProvider>
                    </DialogProvider>
                  </WindowProvider>
                </WindowManagerProvider>
              </ConfigContextProvider>
            </ReactQueryProvider>
          </AuthContextProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
