import { Box } from "@mui/system";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiDataHeader from "components/templates/ApiDataHeader";
import { useParams } from "react-router-dom";

export default function GruppoFatturazione() {
  const { id } = useParams();

  return (
    <Box>
      <ApiServer endpoint={endpoints.BILLING_GROUP} params={{ id }}>
        <ApiDataHeader
          columns={[
            [
              { name: "Gruppo", id: "id" },
              { name: "Importo", id: "id" },
              { name: "Causale fattura", id: "id" },
              { name: "Fatturare a", id: "id" },
              { name: "Eccezione IVA", id: "id" },
              { name: "IVA agevolata", id: "id" },
              { name: "Riferimenti IVA", id: "id" },
              { name: "Beneficia di bonus", id: "id" },
              { name: "Descrizione bonus", id: "id" },
              { name: "Dati verificati", id: "id" },
            ],
          ]}
        />
      </ApiServer>
    </Box>
  );
}
