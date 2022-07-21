import { Stack } from "@mui/material";
import { VerticalInputTable } from "components/modules/TableInput";
import { useMemo } from "react";
import { get_field1, get_field2, get_field3 } from "./movimento_headers";

export default function MovementHeader({ isEditing, setHeaderSate, data }) {
  const [state1, state2, state3] = useMemo(
    () => [
      {
        causale_dex: data.causale_dex,
        controp: data.controp,
        ind_invio_se_div: data.ind_invio_se_div,
      },
      {
        doc_est_data: data.doc_est_data ? new Date(data.doc_est_data) : null,
        doc_est_nr: data.doc_est_nr,
      },
      {
        note_interne: data.note_interne,
        trasf_ricevuto_nr: data.trasf_ricevuto_nr,
        fatturazione: data.fatturazione,
      },
    ],
    [data]
  );

  return (
    <Stack direction="row" pt={2} spacing={1} sx={{ alignItems: "start" }}>
      <VerticalInputTable
        fields={get_field1(isEditing, data)}
        initialState={state1}
        onChange={(data) => setHeaderSate((old) => ({ ...old, ...data }))}
      />
      <VerticalInputTable
        fields={get_field2(isEditing, data)}
        initialState={state2}
        onChange={(data) => setHeaderSate((old) => ({ ...old, ...data }))}
      />
      <VerticalInputTable
        fields={get_field3(isEditing, data)}
        initialState={state3}
        onChange={(data) => setHeaderSate((old) => ({ ...old, ...data }))}
      />
    </Stack>
  );
}
