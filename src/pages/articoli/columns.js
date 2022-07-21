import { Delete } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid-pro";

const article_columns = (products, iva, um, cat, deleteRow) => {
  return [
    {
      field: "marchio",
      headerName: "Marchio",
      minWidth: 100,
      flex: 1,
      editable: true,
    },
    {
      field: "linea",
      headerName: "Linea",
      minWidth: 100,
      flex: 1,
      editable: true,
    },
    {
      field: "codice",
      headerName: "Codice",
      minWidth: 100,
      flex: 1,
      editable: true,
    },
    {
      field: "art_dex",
      headerName: "Dex",
      minWidth: 100,
      flex: 2,
      editable: true,
    },
    {
      field: "dex2",
      headerName: "Dex 2",
      minWidth: 100,
      flex: 2,
      editable: true,
    },
    {
      field: "um",
      headerName: "Um",
      minWidth: 50,
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: um.map((e) => e.cod),
    },
    {
      field: "tipo_art_dex",
      headerName: "Tipo",
      minWidth: 100,
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: products.map((e) => e.dex),
    },
    {
      field: "categ_cont_dex",
      headerName: "Cat. contab.",
      minWidth: 100,
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: cat.map((e) => e.dexb),
    },
    {
      field: "cod_iva",
      headerName: "Cod IVA",
      minWidth: 80,
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: iva.map((e) => e.cod),
    },

    {
      field: "dex_fissa",
      headerName: "Dex fissa",
      type: "boolean",
      minWidth: 100,
      flex: 1,
      editable: true,
    },
    {
      field: "stato_dex",
      headerName: "Stato",
      minWidth: 100,
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: ["attivi", "sospesi", "obsoleti"],
    },
    {
      field: "sequenza",
      headerName: "Seq",
      minWidth: 80,
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      minWidth: 60,
      flex: 1,
      headerName: "Azioni",
      type: "actions",
      getActions: ({ row }) => {
        if (row.art_id)
          return [
            <GridActionsCellItem
              icon={<Delete />}
              onClick={() =>
                row.art_id &&
                deleteRow({
                  in_id: row.art_id,
                  in_tipo_art_dex: null,
                  in_fare_oda: null,
                  in_categ_id: null,
                  in_marchio: null,
                  in_linea: null,
                  in_codice: null,
                  in_dex: null,
                  in_dex2: null,
                  in_um: null,
                  in_cod_iva: null,
                  in_categ_cont_dex: null,
                  in_dex_fissa: null,
                  in_stato_dex: null,
                  in_seq_entro_categ: null,
                  //TODO add tum
                  in_tum: null,
                })
              }
              label="Delete"
            />,
          ];
        else return [];
      },
    },
  ];
};

export { article_columns };
