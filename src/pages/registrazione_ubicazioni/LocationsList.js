import { Save } from "@mui/icons-material";
import { Fab, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import { useAuthContext } from "context/AuthContext";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Location from "./Location";

export default function LocationsList({ data }) {
  const { id } = useParams();
  const [state, setState] = useState(
    data.map((e) => ({
      in_mov_id: e.mov_id,
      in_odv_id: e.odv_id,
      in_ubicaz: e.ubicazioni,
    }))
  );

  useEffect(
    () =>
      setState(
        data.map((e) => ({
          in_mov_id: e.mov_id,
          in_odv_id: e.odv_id,
          in_ubicaz: e.ubicazioni,
        }))
      ),
    [data]
  );

  const changeState = useCallback((index, data, bypass = false) => {
    setState((old) => {
      const newState = [...old];
      newState[index] = { ...newState[index], ...data };
      return newState;
    });
  }, []);

  const { api } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const { func, revalidate } = endpoints.MOVEMENT_LOCATION(api, { id }).save;
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(func);

  const handleSaving = () => {
    state.forEach((e, i) => {
      console.log("SALVANDO -> " + e.in_odv_id, e.in_ubicaz);
      mutate(e, {
        onSuccess: (data) => {
          revalidate(data, queryClient);
          enqueueSnackbar("Salvato con successo", { variant: "success" });
        },
      });
    });
  };

  return (
    <Stack spacing={3}>
      {data.map((e, i) => (
        <Location key={i} loading={isLoading} {...e} onChange={(data) => changeState(i, data)} />
      ))}
      {
        <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
          <Fab color="primary" variant="extended" onClick={handleSaving}>
            <Save sx={{ mr: 1 }} />
            {isLoading ? "Caricamento..." : "Salva le modifiche"}
          </Fab>
        </Box>
      }
    </Stack>
  );
}
