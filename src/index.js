import { LocalizationProvider } from "@mui/lab";
import { ThemeProvider } from "@mui/material";
import theme from "components/theme";
import AuthContextProvider from "context/AuthContextProvider";
import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import Router from "routes";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import itLocale from "date-fns/locale/it";

import "style/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthContextProvider>
          <QueryClientProvider client={queryClient}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={itLocale}
            >
              <Router />
            </LocalizationProvider>
          </QueryClientProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
