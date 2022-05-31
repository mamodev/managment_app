import { Stack, Box, Typography } from "@mui/material";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import LocationsList from "pages/registrazione_ubicazioni/LocationsList";
import { useParams } from "react-router-dom";

export default function Ubicazione() {
  const { id } = useParams();

  return (
    <Stack p={2} spacing={3}>
      <Typography pt={2} variant="h4">
        UBICAZIONE {id}
      </Typography>

      <ApiServer verbose={true} endpoint={endpoints.LOCATION} params={{ id }}>
        <LocationsList />
      </ApiServer>
    </Stack>
  );
}
