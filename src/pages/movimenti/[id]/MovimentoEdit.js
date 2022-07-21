import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, Typography } from "@mui/material";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import { formatDate, reverseDate } from "config/utils";
import { useAuthContext } from "context/AuthContext";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Movimento from "./Moviemento";

export default function MovimentoEdit() {
  const { id } = useParams();
  return (
    <ApiServer singleMode={true} endpoint={endpoints.MOVEMENT_DETAILS} params={{ id }}>
      <MovimentoEditContent />
    </ApiServer>
  );
}

function MovimentoEditContent({ data }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const isEditing = searchParams.has("editing");

  const [button, setButton] = useState(undefined);

  const buttonRef = useRef();
  useEffect(() => setButton(buttonRef?.current), [isEditing, searchParams, id]);

  const { api } = useAuthContext();
  const { func, revalidate } = endpoints.MOVEMENT_DETAILS(api, { id }).update;
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(func, {
    onSuccess: (data) => {
      enqueueSnackbar("Movimento salvato con successo!", { variant: "success" });
      navigate(`/movimenti/${id}${searchParams.has("minimal") ? "?minimal=true" : ""}`);
      revalidate(data, queryClient);
    },
  });
  const handleSave = (header, rows) => {
    console.log(header, rows);

    mutate({
      in_operaz: "M",
      in_testata: {
        id: header.id,
        numero: header.numero,
        del: header.del,
        tipo_doc_mag: header.tipo_doc_mag,
        causale_mov: header.causale_mov,
        doc_est_nr: header.doc_est_nr,
        doc_est_data: header.doc_est_data ? formatDate(header.doc_est_data) : null,
        data_mov: header.data_mov,
        doc_int_ricev_id: header.doc_int_ricev_id,
        sede: header.sede,
        controp_id: header.controp.id,
        ind_diverso_id: header.ind_diverso_id,
        fatturare: header.fatturare,
        fatt_sospesa: header.fatt_sospesa,
        fatturato: header.fatturato,
        note_interne: header.note_interne,
        caus_annullam: header.caus_annullam,
        data_annullam: header.data_annullam,
      },

      //TODO lotti ? non sono  nemmeno presenti nella get
      in_righe: rows.map((e) => ({
        temp_operaz_riga: e.state,
        id: e.id ? (e.state === "add" ? null : e.id) : null,
        art_id: e.art_id,
        marchio: e.marchio,
        linea: e.linea,
        codice: e.codice,
        dex: e.dex,
        dex2: e.dex2,
        um: e.um,
        qta: e.qta,
        magazzino: e.magazzino,
        odv_riga_id: e.odv_riga_id,
        oda_riga_id: e.oda_riga_id,
        lotto_id: null,
        ubicaz_id: e.ubicaz_id,
        nr_colli: e.nr_colli,
      })),
    });
  };

  return (
    <Box px={2} pt={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4">
            {`Movimento magazzino 
     ${data.numero ? ` nr. ${data.numero}` : ""} 
     ${data.data_mov ? `del ${reverseDate(data.data_mov, "/")}` : ""}
     `}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          {isEditing ? (
            <>
              <LoadingButton loading={isLoading} ref={buttonRef} variant="contained">
                Salva
              </LoadingButton>
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  navigate(`/movimenti/${id}${searchParams.has("minimal") ? "?minimal=true" : ""}`)
                }
              >
                Annulla
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="warning"
              onClick={() =>
                navigate(
                  `/movimenti/${id}?editing=true${
                    searchParams.has("minimal") ? "&minimal=true" : ""
                  }`
                )
              }
            >
              Modifica
            </Button>
          )}
        </Stack>
      </Stack>
      <ApiServer endpoint={endpoints.MOVEMENT_DETAILS_LIST} params={{ id }} field="rowsData">
        <Movimento headerData={data} buttonRef={button} save={handleSave} />
      </ApiServer>
    </Box>
  );
}
