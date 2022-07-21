//OPTIMIZE add limit to querys
//OPTIMIZE select param of GET querys

async function emptyGET() {
  return [];
}

async function GET(api, { table, profile, ...args }) {
  let query = table + (!!Object.keys(args).length ? "?" : "");
  for (let arg in args) {
    if (Array.isArray(args[arg])) {
      for (let subArg of args[arg]) {
        query += subArg ? `${arg}=${subArg}&` : "";
      }
    } else query += args[arg] ? `${arg}=${args[arg]}&` : "";
  }

  const response = await api.get(query, {
    headers: { "Accept-Profile": profile },
  });

  return response.data;
}

async function POST(api, { table, profile, data }) {
  const response = await api.post(`rpc/${table}`, data, {
    headers: { "Content-Profile": profile },
  });

  return response.data;
}

const endpoints = {
  ODV_PRO_LIST: (api, params = {}, filters = {}) => ({
    key: ["ODV_PRO", filters],
    func: () =>
      GET(api, {
        table: "v_odv",
        profile: "vend",
        ...filters,
      }),
    add: {
      func: (data) => POST(api, { table: "odv_cre", profile: "vend", data: data }),

      revalidate: (data, queryClient) => queryClient.invalidateQueries(["ODV_PRO"]),
    },
    toOrder: {
      func: (data) => POST(api, { table: "odv_assnum", profile: "vend", data: data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["ODV_PRO"]);
      },
    },
  }),

  ODV_PRO_HEADER: (api, { id }, filters = {}) => ({
    key: ["ODV_PRO", "HEADER", id],
    func: () =>
      GET(api, {
        table: "v_odv_con_tot",
        profile: "vend",
        odv_id: `eq.${id}`,
        ...filters,
      }),
  }),

  ODV_PRO_DETAILED_LIST: (api, { id }, filters = {}) => ({
    key: ["ODV_PRO", "DETAILED_LIST", id, filters],
    func: () =>
      GET(api, {
        table: "v_odv_righe",
        profile: "vend",
        odv_id: `eq.${id}`,
        ...filters,
      }),
    update: {
      func: (data) => POST(api, { table: "odv_righe_upd", profile: "vend", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["ODV_PRO", "DETAILED_LIST", id]);
        queryClient.invalidateQueries(["ODV_PRO", "HEADER", id]);
      },
    },
    move: {
      func: (data) => POST(api, { table: "odv_righe_del", profile: "vend", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["ODV_PRO", "DETAILED_LIST", id]);
      },
    },
    remove: {
      func: (data) => POST(api, { table: "odv_righe_sposta", profile: "vend", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["ODV_PRO", "DETAILED_LIST", id]);
        queryClient.invalidateQueries(["ODV_PRO", "HEADER", id]);
      },
    },

    //FIXME Bad request
    //TODO Aggiungere popup con causale
    cancel: {
      func: (data) => POST(api, { table: "odv_righe_ann", profile: "vend", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["ODV_PRO", "DETAILED_LIST", id]);
        queryClient.invalidateQueries(["ODV_PRO", "HEADER", id]);
      },
    },
    add: {
      func: (data) =>
        POST(api, {
          table: "odv_righe_cre",
          profile: "vend",
          data,
        }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["ODV_PRO", "DETAILED_LIST", id]);
        queryClient.invalidateQueries(["ODV_PRO", "HEADER", id]);
      },
    },
  }),

  ODV_PRO_SUMMARY_LIST: (api, { id }, filters = {}) => ({
    key: ["ODV_PRO", "SUMMARY_LIST", id],
    func: () =>
      GET(api, {
        table: "v_odv_righe_forma_riep",
        profile: "vend",
        odv_id: `eq.${id}`,
        ...filters,
      }),
  }),

  ODV_PRO_TYPE: (api, props, filters) => ({
    key: ["ODV_PRO_TYPE"],
    func: () =>
      GET(api, {
        table: "domini",
        select: "cod,dex",
        profile: "core",
        ambito: "eq.lista",
        dominio: "eq.tipo",
        ...filters,
      }),
  }),

  ODV_PRO_STATE: (api, props, filters) => ({
    key: ["ODV_PRO_STATE"],
    func: () =>
      GET(api, {
        table: "domini",
        select: "cod,dex",
        profile: "core",
        ambito: "eq.odv",
        dominio: "eq.stato",
        ...filters,
      }),
  }),
  ODV_PRO_STRUCTURE: (api, { id }, filters = {}) => ({
    key: ["ODV_PRO_STRUCTURE", id, filters],
    func: () =>
      GET(api, {
        table: "v_odv_strutt",
        profile: "vend",
        progetto_id: `eq.${id}`,
        ...filters,
      }),
  }),

  SITES: (api, props, filters) => ({
    key: ["SITES", filters],
    func: () =>
      GET(api, {
        table: "sedi",
        select: "sede,dexb",
        profile: "core",
        ...filters,
      }),
  }),

  SELLERS: (api, props, filters) => ({
    key: ["SELLERS"],
    func: () =>
      GET(api, {
        table: "v_persone_con_odv",
        profile: "core",
        ...filters,
      }),
  }),

  PRODUCTS: (api, props = {}, filters = {}) => ({
    key: ["PRODUCTS", filters],
    func: () =>
      GET(api, {
        table: "v_art_vend",
        profile: "base",
        ...filters,
      }),
  }),
  SHIPPING_GROUP: (api, { id }, filters = {}) => ({
    key: ["SHIPPING_GROUP", id],
    func: () => GET(api, { table: "v_odv_gru_cons", profile: "vend", id: `eq.${id}` }),
  }),
  BILLING_GROUP: (api, { id }, filters = {}) => ({
    key: ["BILLING_GROUP", id],
    func: () => GET(api, { table: "v_odv_gru_fatt", profile: "vend", id: `eq.${id}` }),
  }),

  BILLING_GROUP_ACC: (api, { id }, filters = {}) => ({
    key: ["BILLING_GROUP", id, "ACC"],
    func: () =>
      GET(api, {
        table: "odv_acconti",
        profile: "vend",
        gru_fatt_id: `eq.${id}`,
      }),
    add: {
      func: (data) =>
        POST(api, {
          table: "odv_acconti_cre",
          profile: "vend",
          data: { in_gru_fatt_id: id },
        }),
      revalidate: (data, queryClient) =>
        queryClient.invalidateQueries(["BILLING_GROUP", id, "ACC"]),
    },
    update: {
      func: (data) =>
        POST(api, {
          table: "odv_acconti_upd",
          profile: "vend",
          data,
        }),
      revalidate: (data, queryClient) => {},
    },
  }),

  CLIENTS: (api, props, filters = {}) => ({
    key: ["CLIENTS", filters],
    func: () =>
      GET(api, {
        table: "v_soggetti",
        profile: "base",
        tipo: "eq.C",
        ...filters,
      }),
    add: {
      func: (data) =>
        POST(api, {
          table: "soggetto_cre_upd",
          profile: "base",
          data: {
            in_operaz: "C",
            in_tipo: "C",
            in_id: null,
            in_tum: null,
            ...data,
          },
        }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["CLIENTS"]);
      },
    },
  }),
  CLIENT_DETAIL: (api, { id }, filters = {}) => ({
    key: ["CLIENT_DETAIL", id, filters],
    func: () =>
      GET(api, {
        table: "soggetti",
        profile: "base",
        select:
          "id,persona,ind_note,nome,cognome,denom,email,tipo,cfisc,piva,indirizzo,comune,provincia,cap,nazione,telefono,cellulare,pec",
        id: `eq.${id}`,
        ...filters,
      }),
    update: {
      func: (data) =>
        POST(api, {
          table: "soggetto_cre_upd",
          profile: "base",
          data: {
            in_operaz: "U",
            in_tum: null,
            ...data,
          },
        }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["CLIENT_DETAIL", id]);
      },
    },
  }),
  PROVIDERS: (api, props, filters = {}) => ({
    key: ["PROVIDERS", filters],
    func: () =>
      GET(api, {
        table: "v_soggetti",
        profile: "base",
        tipo: "eq.F",
        ...filters,
      }),
    add: {
      func: (data) =>
        POST(api, {
          table: "soggetto_cre_upd",
          profile: "base",
          data: {
            in_operaz: "C",
            in_tipo: "F",
            in_id: null,
            in_tum: null,
            ...data,
          },
        }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["PROVIDERS"]);
      },
    },
  }),
  PROVIDER_DETAIL: (api, { id }, filters = {}) => ({
    key: ["PROVIDER_DETAIL", id, filters],
    func: () =>
      GET(api, {
        table: "soggetti",
        profile: "base",
        select:
          "id,persona,ind_note,nome,cognome,denom,email,tipo,cfisc,piva,indirizzo,comune,provincia,cap,nazione,telefono,cellulare,pec",
        id: `eq.${id}`,
        ...filters,
      }),
    update: {
      func: (data) =>
        POST(api, {
          table: "soggetto_cre_upd",
          profile: "base",
          data: {
            in_operaz: "U",
            in_tum: null,
            ...data,
          },
        }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["CLIENT_DETAIL", id]);
      },
    },
  }),

  SUBJECTS: (api, props, filters = {}) => ({
    key: ["SUBJECTS", filters],
    func: () =>
      GET(api, {
        table: "v_soggetti",
        profile: "base",
        ...filters,
      }),
  }),

  CONFIG: (api, props, filters) => ({
    key: ["CONFIG"],
    func: () => {
      return GET(api, { table: "rpc/config_attuale", profile: "dizi" });
    },
  }),

  ODA_FROM_ODV: (api, { id }, filters) => ({
    key: ["ODA_FROM_ODV", { id }],
    func: () => {
      console.log("fetching");
      return GET(api, { table: "v_oda_da_odv", profile: "maga", odv_id: `eq.${id}` });
    },
    update: {
      func: ({ in_odv_riga_id, in_acquistare_qta }) =>
        POST(api, {
          table: "oda_da_odv_qta",
          profile: "maga",
          data: { in_odv_riga_id, in_acquistare_qta },
        }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["ODA_FROM_ODV"]);
        queryClient.invalidateQueries(["ODA_FROM_ODV_CONFIRM"]);
      },
    },
  }),

  ODA_FROM_ODV_CONFIRM: (api, { id }, filters) => ({
    key: ["ODA_FROM_ODV_CONFIRM", { id }],
    func: () => {
      return GET(api, { table: "v_oda_da_odv_conf", profile: "maga", odv_id: `eq.${id}` });
    },
    confirm: {
      func: (data) => POST(api, { table: "oda_da_odv_f", profile: "maga", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["ODA_FROM_ODV", { id }]);
      },
    },
  }),

  INCOM_FROM_ODA: (api, params = {}, filters = {}) => ({
    key: ["INCOM_FROM_ODA", filters],
    func: () => GET(api, { table: "v_oda_da_arrivare", profile: "maga", ...filters }),
    record: {
      func: (data) => POST(api, { table: "arr_da_forn_f", profile: "maga", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["INCOM_FROM_ODA"]);
        //TODO aggiungere nel futuro la rivalidazione dell'endpoint movimenti di magazzino
      },
    },
  }),

  DOCUMENTS: (api, params = {}, filters = {}) => ({
    key: ["DOCUMENTS"],
    func: () => GET(api, { table: "v_mov_test", profile: "maga", ...filters }),
  }),

  MOVEMENTS: (api, params = {}, filters = {}) => ({
    key: ["MOVEMENTS", params, filters],
    func: () => GET(api, { table: "v_mov_righe", profile: "maga", ...filters }),
    create: {
      func: ({ sede, causale_mov }) =>
        POST(api, {
          table: "mov_mag_cud_f",
          profile: "maga",
          data: {
            in_operaz: "C",
            in_testata: {
              id: null,
              numero: null,
              del: null,
              tipo_doc_mag: null,
              causale_mov,
              doc_est_nr: null,
              doc_est_data: null,
              data_mov: null,
              doc_int_ricev_id: null,
              sede,
              controp_id: null,
              ind_diverso_id: null,
              fatturare: null,
              fatt_sospesa: null,
              fatturato: null,
              note_interne: null,
              caus_annullam: null,
              data_annullam: null,
            },
            in_righe: [],
          },
        }),
      revalidate: () => {},
    },
  }),

  MOVEMENT: (api, { id }, filters = {}) => ({
    key: ["MOVEMENTS", id, filters],
    func: () => GET(api, { table: "v_mov_test", profile: "maga", mov_id: `eq.${id}`, ...filters }),
  }),

  MOVEMENT_DETAILS: (api, { id }, filters = {}) => ({
    key: ["MOVEMENTS", id, filters, "DETAILS"],
    func: () => {
      return GET(api, { table: "v_mov_test_cud", profile: "maga", id: `eq.${id}` });
    },
    update: {
      func: (data) => POST(api, { table: "mov_mag_cud_f", profile: "maga", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["MOVEMENTS"]);
      },
    },
  }),

  MOVEMENT_DETAILS_LIST: (api, { id }, filters = {}) => ({
    key: ["MOVEMENTS", id, filters, "DETAILS", "LIST"],
    func: () => GET(api, { table: "v_mov_righe_cud", profile: "maga", mov_id: `eq.${id}` }),
  }),

  LOCATION: (api, { id }, filters = {}) => ({
    key: ["LOCATION", id],
    func: () => GET(api, { table: "v_mov_arrivo_riferim", profile: "maga", ubicaz_id: `eq.${id}` }),
    save: {
      func: (data) => POST(api, { table: "ubic_di_rif", profile: "maga", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["LOCATION"]);
      },
    },
  }),

  MOVEMENT_LOCATION: (api, { id }, filters = {}) => ({
    key: ["MOVEMENTS", id, "LOCATION"],
    func: () => GET(api, { table: "v_mov_arrivo_riferim", profile: "maga", mov_id: `eq.${id}` }),
    save: {
      func: (data) => POST(api, { table: "ubic_di_rif", profile: "maga", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["MOVEMENTS"]);
      },
    },
  }),

  MOVEMENT_STATES: (api, params = {}, filters = {}) => ({
    key: ["MOVEMENTS", "STATES"],
    func: () =>
      GET(api, { table: "domini", profile: "core", ambito: "eq.movmag", dominio: "eq.stato_doc" }),
  }),

  MOVEMENT_CAUSALS: (api, params = {}, filters = {}) => ({
    key: ["MOVEMENTS", "CAUSALS"],
    func: () => GET(api, { table: "causali_mov", profile: "base" }),
  }),

  MOVEMENT_STOCKS: (api, params = {}, filters = {}) => ({
    key: ["MOVMENT", "STOCKS"],
    func: () => GET(api, { table: "v_giacenze", profile: "maga", ...filters }),
  }),

  WAREHOUSES: (api, params = {}, filters = {}) => ({
    key: ["WHEREHOUSES", params, filters],
    func: () => GET(api, { table: "magazzini", profile: "base", ...filters }),
  }),

  SHIPMENT_PLANNING: (api, { id }, filters = {}) => ({
    key: ["SHIPMENT_PLANNING", id],
    func: () =>
      GET(api, { table: "v_odv_pian_gr", profile: "pian", gru_cons_id: `eq.${id}`, ...filters }),
  }),

  SHIPMENT_PLANNING_LIST: (api, { id }, filters = {}) => ({
    key: ["SHIPMENT_PLANNING", id, "LIST"],
    func: () =>
      GET(api, { table: "v_odv_pian", profile: "pian", gru_cons_id: `eq.${id}`, ...filters }),
    update: {
      func: (data) => POST(api, { table: "odv_qta_preb", profile: "vend", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["SHIPMENT_PLANNING", id, "LIST"]);
        //FIXME this update isn't working
        queryClient.setQueryData(["SHIPMENT_PLANNING", id, "LIST"], (old) =>
          old.map((e) => (e.gru_cons_id === id ? { qta_prebolla: data.qta_prebolla, ...e } : e))
        );
      },
    },
    issue: {
      func: (data) => POST(api, { table: "mov_da_preb_f", profile: "maga", data }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["SHIPMENT_PLANNING"]);
      },
    },
  }),

  DOCUMENT_TYPE: (api, id, filters = {}) => ({
    key: ["DOCUMENT_TYPE", id, filters],
    func: () =>
      GET(api, {
        table: "v_tipi_doc_mag",
        profile: "base",
        cod: id ? `eq.${id}` : undefined,
        ...filters,
      }),
  }),

  PRODUCTS_DETAIL: (api, params = {}, filters = {}) => ({
    key: ["PRODUCTS_DETAILS"],
    func: () => {
      return GET(api, { table: "v_categ_e_art", profile: "base", ...filters });
    },
    update: {
      func: (data) =>
        POST(api, { table: "articolo_cud", profile: "base", data: { in_operaz: "U", ...data } }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["PRODUCTS_DETAILS"]);
      },
    },
    add: {
      func: (data) =>
        POST(api, { table: "articolo_cud", profile: "base", data: { in_operaz: "C", ...data } }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["PRODUCTS_DETAILS"]);
      },
    },
    delete: {
      func: (data) =>
        POST(api, { table: "articolo_cud", profile: "base", data: { in_operaz: "D", ...data } }),
      revalidate: (data, queryClient) => {
        queryClient.invalidateQueries(["PRODUCTS_DETAILS"]);
      },
    },
  }),

  EMPTY: () => ({
    key: ["EMPTY"],
    func: () => emptyGET(),
  }),
  IVA: (api, params = {}, filters = {}) => ({
    key: ["IVA", params, filters],
    func: () => GET(api, { table: "codici_iva", profile: "base", ...filters }),
  }),
  ACCOUNTING_CATEGORIES: (api, params = {}, filters = {}) => ({
    key: ["ACCOUNTING_CATEGORIES", params, filters],
    func: () => GET(api, { table: "categorie_contabili", profile: "base", ...filters }),
  }),

  PRODUCTS_TYPE: (api, params = {}, filters = {}) => ({
    key: ["PRODUCTS_TYPE", params, filters],
    func: () =>
      GET(api, {
        table: "domini",
        profile: "core",
        ambito: "eq.articolo",
        dominio: "eq.tipo",
        order: "seq",
        ...filters,
      }),
  }),

  UM: (api, params = {}, filters = {}) => ({
    key: ["UM", params, filters],
    func: () =>
      GET(api, {
        table: "domini",
        profile: "core",
        ambito: "eq.base",
        dominio: "eq.um",
        ...filters,
      }),
  }),
};

export { endpoints, POST };
