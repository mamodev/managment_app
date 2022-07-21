const headers = (editing) => [
  {
    headerName: "Riga",
    field: "riga",
    type: "number",
    flex: 0.25,
  },
  {
    headerName: "Magazzino",
    field: "magazzino_dex",
    flex: 1.5,
    cellClassName: () => (editing ? "MuiDataGrid-cell--editable" : ""),
  },
  {
    headerName: "Riferimento",
    field: "riferimento",
    flex: 3,
  },
  {
    headerName: "Marchio",
    field: "marchio",
    flex: 2,
    cellClassName: () => (editing ? "MuiDataGrid-cell--editable" : ""),
  },
  {
    headerName: "Linea",
    field: "linea",
    flex: 1,
    cellClassName: () => (editing ? "MuiDataGrid-cell--editable" : ""),
  },
  {
    headerName: "Codice",
    field: "codice",
    flex: 1,
    cellClassName: () => (editing ? "MuiDataGrid-cell--editable" : ""),
  },
  {
    headerName: "Descrizione",
    field: "dex",
    flex: 2,
    cellClassName: () => (editing ? "MuiDataGrid-cell--editable" : ""),
  },
  {
    headerName: "Um",
    field: "um",
    flex: 0.25,
  },
  {
    headerName: "Qta",
    field: "qta",
    flex: 0.5,
    minWidth: 60,
    type: "number",
    editable: true,
  },
  {
    headerName: "Nr. Colli",
    field: "nr_colli",
    type: "number",
    editable: true,
    minWidth: 80,
    flex: 0.5,
  },
];

const get_field2 = (isEditing, data) => [
  {
    headerName: "Documento ricevuto",
    field: "doc_est_nr",
    type: "string",
    editable: isEditing && data?.abil_doc_ricevuto,
  },
  {
    headerName: "Del",
    field: "doc_est_data",
    type: "date",
    editable: isEditing && data?.abil_doc_ricevuto,
  },
];

const get_field1 = (isEditing, data) => [
  {
    headerName: "Causale",
    field: "causale_dex",
    type: "string",
    editable: false,
  },
  {
    headerName: "Controparte",
    field: "controp",
    type:
      data.tipo_soggetto_controp === "F"
        ? "provider"
        : data.tipo_soggetto_controp === "C"
        ? "client"
        : "subject",

    editable: isEditing,
  },
  {
    headerName: "Indirizzo invio se diverso",
    field: "ind_invio_se_div",
    type: "string",
    editable: isEditing && data?.abil_ind_se_diverso,
  },
];

const get_field3 = (isEditing) => [
  {
    headerName: "Trasferim. ricevuto",
    field: "trasf_ricevuto_nr",
    type: "string",
    editable: false,
  },
  {
    headerName: "Fatturazione",
    field: "fatturazione",
    editable: false,
    type: "string",
  },
  {
    headerName: "Note interne",
    field: "note_interne",
    type: "string",
    editable: isEditing,
  },
];

export { headers, get_field1, get_field2, get_field3 };
