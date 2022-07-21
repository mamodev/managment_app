const odv_pro_state_summary = [
  {
    field: "stato_acquisto",
    headerName: "Stato acquisto",
    sortable: false,
    flex: 1.5,
  },
  {
    field: "item",
    headerName: "Articolo",
    sortable: false,
    flex: 1.5,
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
    valueFormatter: ({ value }) => (value ? (value + " €").replace(".", ",") : ""),
  },

  {
    field: "stato_consegna",
    headerName: "Stato consegna",
    sortable: false,
    width: 160,
  },
];

export { odv_pro_state_summary };
