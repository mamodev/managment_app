import { Button, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiDataHeader from "components/templates/ApiDataHeader";
import { useNavigate, useParams } from "react-router-dom";

//TODO Aggiungere funzionamento per modifica. (Capire meglio con gabriele)
export default function GruppoConsegna() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <Box p={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Gruppo consegna</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/pianif_sped/" + id + "?minimal=true")}
        >
          Prebolla
        </Button>
      </Stack>
      <ApiServer endpoint={endpoints.SHIPPING_GROUP} params={{ id }}>
        <ApiDataHeader
          sx={{ width: "50%", m: 2 }}
          columns={[
            [
              { name: "Gruppo", id: "nr" },
              {
                name: "Data Prevista",
                id: "data_prevista",
                editable: "true",
                endpoint_editable: "modif_data_prevista",
              },
              {
                name: "Indirizzo",
                id: "consegna_a_dex",
                editable: "true",
                endpoint_editable: "modif_consegna_a_id",
              },
            ],
          ]}
        />
      </ApiServer>
    </Box>
  );
}
