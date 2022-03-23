const odv_pro_columns = [
  {
    field: "tipo_decod",
    headerName: "Tipo",
    sortable: false,
  },
  {
    field: "numero",
    headerName: "Numero",
    sortable: false,
    cellClassName: "super-app-theme--link",
  },
  {
    field: "del",
    headerName: "Data",
    sortable: false,
  },
  {
    width: 200,
    field: "denom",
    headerName: "Cliente",
    sortable: false,
  },
  {
    field: "stato_dex",
    headerName: "Stato",
    color: "red",
    sortable: false,
  },
  {
    field: "sede",
    headerName: "Sede",
    sortable: false,
  },
  {
    field: "venditore",
    headerName: "Venditore",
    sortable: false,
  },
];

export default odv_pro_columns;
