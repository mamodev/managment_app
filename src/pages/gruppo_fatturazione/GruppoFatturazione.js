import { Add } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import BooleanInput from "components/base/BooleanInput";
import ApiServer from "components/layout/ApiServer";
import ApiDataHeader from "components/templates/ApiDataHeader";
import ApiDataList from "components/templates/ApiDataList";
import { useParams } from "react-router-dom";

export default function GruppoFatturazione() {
  const { id } = useParams();

  return (
    <Box p={2}>
      <Typography variant="h6">Gruppo fatturazione</Typography>
      <ApiServer endpoint={endpoints.BILLING_GROUP} params={{ id }}>
        <ApiDataHeader
          sx={{ width: "50%", m: 2 }}
          columns={[
            [
              { name: "Gruppo", id: "nr" },
              { name: "Importo", id: "importo" },
              { name: "Causale fattura", id: "dex_causale", editable: true },
              {
                name: "Fatturazione da tabella",
                id: "da_tabella",
                component: BooleanInput,
              },
              { name: "Fatturare a SAL", id: "a_sal", component: BooleanInput },
              { name: "Fatturare a", id: "fatturare_a_dex" },
              { name: "Eccezione IVA", id: "cod_iva_dex" },
              {
                name: "IVA agevolata",
                id: "iva_agevolata_dex",
              },
              {
                name: "Riferimenti IVA agevolata",
                id: "iva_agevolata_riferim",
              },
              {
                name: "Beneficia di bonus",
                id: "bonus",
                component: BooleanInput,
              },
              { name: "Descrizione bonus", id: "bonus_dex" },
            ],
            [
              {
                name: "Verificato",
                id: "verificato",
                editable: false,
                valueFormatter: (val) => (val ? "Si" : "No"),
              },
              {
                name: "Verificato da",
                id: "verificato_da",
              },
              {
                name: "Verificato Il",
                id: "verificato_il",
                valueFormatter: (val) => {
                  const date = new Date(val);
                  return `${date.getDate()}/${
                    date.getMonth() + 1
                  }/${date.getFullYear()}`;
                },
              },
            ],
          ]}
        />
      </ApiServer>

      <ApiServer endpoint={endpoints.BILLING_GROUP_ACC} params={{ id }}>
        <ApiDataList
          containerProps={{ width: "60vw" }}
          rowHeight={50}
          columns={[
            {
              field: "percentuale",
              headerName: "Percentuale",
              align: "center",
              valueFormatter: ({ value }) => `${value}%`,
            },

            {
              field: "importo",
              headerName: "Importo",
            },
            {
              field: "vincola",
              headerName: "Vincola",
              type: "singleSelect",
              valueOptions: ["Acquisti", "Consegne"],
              editable: true,
              valueGetter: ({ row: { vincola_acquisti } }) =>
                vincola_acquisti ? "Acquisti" : "Consegne",
              valueSetter: ({ row, value }) => ({
                ...row,
                vincola_acquisti: value === "Acquisti",
                vincola_consegne: value === "Consegne",
              }),
            },
            {
              field: "finanziamento",
              headerName: "Finanziamento",
              width: 130,
              align: "center",
              valueFormatter: ({ value }) => (value ? "Si" : "No"),
            },
            {
              field: "note_interne",
              headerName: "Note",
              width: 400,
            },
          ]}
        />
      </ApiServer>
    </Box>
  );
}
