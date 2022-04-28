const odv_pro_state_summary = [
  {
    field: "id",
    headerName: "Seq",
    align: "center",
    sortable: false,
    width: 60,
  },
  {
    field: "item",
    headerName: "Articolo",
    sortable: false,
    width: 200,
  },
  {
    field: "dex",
    headerName: "Descrizione",
    sortable: false,
    width: 250,
  },
  {
    field: "um",
    headerName: "Um",
    sortable: false,
    align: "center",
    width: 60,
  },
  {
    field: "qta",
    headerName: "Qta",
    align: "center",
    sortable: false,
    width: 60,
  },
  {
    field: "prz_tot_ivato",
    headerName: "Importo",
    sortable: false,
    align: "right",
    valueFormatter: ({ value }) => (value + " €").replace(".", ","),
  },
  {
    field: "stato_acquisto",
    headerName: "Stato acquisto",
    sortable: false,
    width: 160,
  },
  {
    field: "gru_fatt_id",
    headerName: "G. Fatt.",
    sortable: false,
    align: "center",
    width: 80,
    cellClassName: "super-app-theme--link",
  },
  {
    field: "gru_cons_id",
    headerName: "G. Cons.",
    sortable: false,
    align: "center",
    width: 90,
    cellClassName: "super-app-theme--link",
  },
  {
    field: "stato_consegna",
    headerName: "Stato consegna",
    sortable: false,
    width: 160,
  },
];

export { odv_pro_state_summary };
