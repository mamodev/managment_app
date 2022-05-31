import { Stack, Box, Typography } from "@mui/material";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ObjectTable from "components/templates/ObjectTable";
import { reverseDate } from "config/utils";
import { useParams } from "react-router-dom";
import LocationsList from "./LocationsList";

function Header({
  data: {
    controparte,
    nr_doc_ricevuto,
    data_mov,
    data_doc = "data/da/inserire",
    colli = "manca endp.",
  },
}) {
  return (
    <ObjectTable
      object={{
        Fornitore: controparte,
        "Doc.forn nr": nr_doc_ricevuto,
        Del: data_doc,
        Colli: colli,
        "Data arrivo": reverseDate(data_mov),
      }}
    />
  );
}

export default function RegistrazioneUbicazioni() {
  const { id } = useParams();

  return (
    <Stack p={2} spacing={3}>
      <Typography pt={2} variant="h4">
        REGISTRAZIONE UBICAZIONE
      </Typography>

      <ApiServer singleMode endpoint={endpoints.MOVEMENT} params={{ id }}>
        <Header />
      </ApiServer>

      <Box px={8}>
        <ApiServer verbose={true} endpoint={endpoints.MOVEMENT_LOCATION} params={{ id }}>
          <LocationsList />
        </ApiServer>
      </Box>
    </Stack>
  );
}
