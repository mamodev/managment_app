import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";

export default function ReactQueryProvider({ children }) {
  const { enqueueSnackbar } = useSnackbar();

  const handleError = useCallback(
    (error) => {
      const status = error.response.status;
      console.log(error.response);
      switch (status) {
        case 400:
          enqueueSnackbar(error.response.data.message, {
            variant: "error",
          });
          break;
        case 404:
          enqueueSnackbar("Impossibile eseguire questa funzione", {
            variant: "error",
          });
          break;
        case 409:
          enqueueSnackbar(JSON.parse(error.response.data.msg).message, {
            variant: "error",
          });
          break;
        default:
          enqueueSnackbar("C'è stato un errore");
      }
    },
    [enqueueSnackbar]
  );

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            onError: handleError,
            cacheTime: 1000 * 60 * 60 * 2,
          },
          mutations: {
            onError: handleError,
          },
        },
      }),
    []
  );

  const localStoragePersistor = useMemo(
    () =>
      createWebStoragePersistor({
        storage: window.localStorage,
      }),
    []
  );

  useEffect(
    () =>
      persistQueryClient({
        queryClient,
        persistor: localStoragePersistor,
      }),
    []
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
