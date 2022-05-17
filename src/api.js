//OPTIMIZE add limit to querys
//OPTIMIZE select param of GET querys
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
    key: ["ODV_PRO", "DETAILED_LIST", id],
    func: () =>
      GET(api, {
        table: "v_odv_righe",
        profile: "vend",
        odv_id: `eq.${id}`,
        ...filters,
      }),
    update: {
      func: (data) => POST(api, { table: "odv_righe_upd", profile: "vend", data }),
      revalidate: (data, queryClient) =>
        queryClient.setQueryData(["ODV_PRO", "DETAILED_LIST", id], (old) =>
          old.map((e) => {
            if (e.id === data?.id) return { ...e, ...data };
            else return e;
          })
        ),
    },
    remove: {
      func: (data) => POST(api, { table: "odv_righe_del", profile: "vend", data }),
      revalidate: (data, queryClient) => {
        queryClient.setQueryData(["ODV_PRO", "DETAILED_LIST", id], (old) =>
          old.filter((e) => e.id !== data.id)
        );
      },
    },

    //FIXME Bad request
    //TODO Aggiungere popup con causale
    cancel: {
      func: (data) => POST(api, { table: "odv_righe_ann", profile: "vend", data }),
      revalidate: (data, queryClient) =>
        queryClient.invalidateQueries(["ODV_PRO", "DETAILED_LIST", id]),
    },
    add: {
      func: (data) =>
        POST(api, {
          table: "odv_righe_cre",
          profile: "vend",
          data,
        }),
      revalidate: (data, queryClient) => {
        queryClient.setQueryData(["ODV_PRO", "DETAILED_LIST", id], (old) => [data, ...old]);
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

  SITES: (api, props, filters) => ({
    key: ["SITES"],
    func: () =>
      GET(api, {
        table: "sedi",
        select: "sede,dexb",
        profile: "core",
        ...filters,
      }),
  }),

  PRO_FOR_ODV: (api, { id }, filters = {}) => ({
    key: ["PRO_FOR_ODV", id, filters],
    func: () =>
      GET(api, {
        table: "v_pro_per_odv",
        profile: "vend",
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
            in_persona: null,
            in_nome: "",
            in_cognome: "",
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

  CONFIG: (api, props, filters) => ({
    key: ["CONFIG"],
    func: () => {
      return GET(api, { table: "rpc/config_attuale", profile: "dizi" });
    },
  }),

  ODA_FROM_ODV: (api, { id }, filters) => ({
    key: ["ODA_FROM_ODV", { id }],
    func: () => {
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
        queryClient.invalidateQueries(["ODA_FROM_ODV", { id }]);
        queryClient.invalidateQueries(["ODA_FROM_ODV_CONFIRM", { id }]);
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
};

export { endpoints, POST };
