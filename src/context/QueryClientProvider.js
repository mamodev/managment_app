import { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";

export default function ReactQueryProvider({ children }) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            cacheTime: 1000 * 60 * 60 * 2,
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
