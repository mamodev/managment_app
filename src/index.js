import { LocalizationProvider } from "@mui/lab";
import { ThemeProvider } from "@mui/material";
import theme from "config/theme";
import AuthContextProvider from "context/AuthContextProvider";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "routes";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import itLocale from "date-fns/locale/it";

import "style/index.css";
import { WindowManagerContextProvider } from "context/WindowManagerContext";
import ReactQueryProvider from "context/QueryClientProvider";
import { SnackbarProvider } from "notistack";
import { ConfigContextProvider } from "context/ConfigContext";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={5}>
            <ReactQueryProvider>
              <ConfigContextProvider>
                <WindowManagerContextProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={itLocale}>
                    <Router />
                  </LocalizationProvider>
                </WindowManagerContextProvider>
              </ConfigContextProvider>
            </ReactQueryProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
