const odv_pro_id_header_columns = [
  [
    {
      nameid: "tipo_decod",
      id: "numero",
    },
    {
      name: "Del",
      id: "del",
    },
    {
      name: "Venditore",
      id: "venditore",
    },
    {
      name: "Sede",
      id: "sede",
    },
  ],
  [
    {
      name: "Cliente",
      id: "denom",
    },
    {
      name: "",
      multiline: true,
      id: "luogo",
    },
    {
      name: "",
      id: "telefoni",
    },
    {
      name: "",
      id: "email",
    },
  ],
  [
    {
      name: "Totale c/iva",
      id: "prz_tot_ivato",
    },
    {
      name: "Totale s/iva",
      id: "prz_tot_non_ivato",
    },
    {
      name: "Costi",
      id: "costo_tot_mio",
    },
    {
      name: "Margine",
      id: "margine",
    },
  ],
];

export { odv_pro_id_header_columns };
