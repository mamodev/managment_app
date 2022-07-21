import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import { formatDate, reverseDate } from "config/utils";
import { useAuthContext } from "context/AuthContext";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import Movimento from "./Moviemento";

const default_data = {
  id: null,
  numero: null,
  numero_dex: null,
  del: null,
  stato_dex: null,
  tipo_doc_mag: null,
  tipo_doc_mag_dex: null,
  doc_est_nr: null,
  doc_est_data: null,
  doc_int_ricev_id: null,
  trasf_ricevuto_nr: null,
  controp_id: null,
  controp_dex: null,
  ind_diverso_id: null,
  ind_invio_se_div: null,
  fatturare: null,
  fatt_sospesa: null,
  fatturato: null,
  fatturazione: null,
  note_interne: null,
  caus_annullam: null,
  data_annullam: null,
  da_fatturare: null,
};

export default function MovimentoCreate() {
  const [searchParams] = useSearchParams();
  const sede = searchParams.get("sede");
  const causale_mov = searchParams.get("causale_mov");

  const { api } = useAuthContext();

  const { func: sietesFunc, key: sitesKey } = endpoints.SITES(api, {}, { sede: `eq.${sede}` });
  const { data: sites, isLoading: sitesLoading } = useQuery(sitesKey, sietesFunc);

  const { func: docFunc, key: docKey } = endpoints.DOCUMENT_TYPE(api, causale_mov);
  const { data: doc, isLoading: docLoading } = useQuery(docKey, docFunc);

  return (
    <>
      {!docLoading &&
        !sitesLoading &&
        Array.isArray(doc) &&
        doc.length > 0 &&
        Array.isArray(sites) &&
        sites.length > 0 && <MoviementoCreateMain sites={sites[0]} doc={doc[0]} />}
    </>
  );
}

function MoviementoCreateMain({ sites, doc }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { api } = useAuthContext();
  const queryClient = useQueryClient();
  const { func, revalidate } = endpoints.MOVEMENT_DETAILS(api, { id: null }).update;

  const { mutate, isLoading } = useMutation(func, {
    onSuccess: (data) => {
      navigate(`/movimenti/${data.id}${searchParams.has("minimal") ? "?minimal=true" : ""}`);
      revalidate(data, queryClient);
    },
  });
  const today = new Date();
  const buttonRef = useRef();
  const [button, setButton] = useState(null);
  useEffect(() => {
    if (buttonRef.current !== button) setButton(buttonRef.current);
  });

  const handleSave = (header, rows) => {
    mutate({
      in_operaz: "C",
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
        controp_id: header?.controp?.id,
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
      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Typography variant="h4">
          Creazione movimento del {reverseDate(formatDate(today), "/")}
        </Typography>
        <LoadingButton loading={isLoading} ref={buttonRef} variant="contained">
          Crea
        </LoadingButton>
      </Stack>
      <Movimento
        save={handleSave}
        buttonRef={button}
        endpoint={endpoints.EMPTY}
        headerData={{
          ...default_data,
          data_mov: formatDate(today),
          sede_dex: sites.dexb,
          sede: sites.sede,
          causale_mov: doc.causale_mov,
          causale_dex: doc.dexb,
          tipo_soggetto_controp: doc.tipo_soggetto_controp,
          abil_doc_ricevuto: doc.abil_doc_ricevuto,
          abil_ind_se_diverso: doc.abil_ind_se_diverso,
        }}
        rowsData={[]}
      />
    </Box>
  );
}
