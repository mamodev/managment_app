const odv_pro_columns = [
  {
    field: "tipo_decod",
    headerName: "Tipo",
    flex: 1,
    sortable: false,
  },
  {
    field: "numero",
    headerName: "Numero",
    sortable: false,
    flex: 1,

    cellClassName: "super-app-theme--link",
  },
  {
    field: "del",
    headerName: "Data",
    valueFormatter: ({ value }) =>
      value
        .split("-")
        .reverse()
        .reduce((p, n) => p + "-" + n),
    flex: 1,
    sortable: false,
  },
  {
    width: 200,
    field: "denom",
    headerName: "Cliente",
    flex: 1,

    sortable: false,
  },
  {
    field: "stato_dex",
    headerName: "Stato",
    color: "red",
    sortable: false,
    flex: 1,
  },
  {
    field: "sede",
    headerName: "Sede",
    sortable: false,
    flex: 1,
  },
  {
    field: "venditore",
    headerName: "Venditore",
    sortable: false,
    flex: 1,
  },
];

export default odv_pro_columns;
