import { Stack } from "@mui/material";
import { Suspense } from "react";

export default function PageLoader({ children }) {
  return (
    <Suspense
      fallback={
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ height: "80vh", width: "100%" }}
        >
          Caricamento..
        </Stack>
      }
    >
      {children}
    </Suspense>
  );
}
