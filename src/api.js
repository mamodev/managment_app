const verbose = false;

async function GET(api, { table, profile, ...args }) {
  let query = table + "?";
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
        table: "v_lista_testate",
        profile: "vend",
        select:
          "tipo_decod,numero,del,denom,sede,venditore,data_ult_modif,stato_dex, stato_cod,lista_testate_id",
        ...filters,
      }),
  }),

  ODV_PRO_HEADER: (api, { id }, filters = {}) => ({
    key: ["ODV_PRO", "HEADER", id],
    func: () =>
      GET(api, {
        table: "v_lista_testate_con_tot",
        select:
          "lista_testate_id,tipo_decod, numero,del, venditore, sede,denom, luogo, telefoni,prz_tot_non_ivato, prz_tot_ivato, costo_un_orig, margine",
        profile: "vend",
        lista_testate_id: `eq.${id}`,
        ...filters,
      }),
  }),

  ODV_PRO_DETAILED_LIST: (api, { id }, filters = {}) => ({
    key: ["ODV_PRO", "DETAILED_LIST", id],
    func: () => {
      if (verbose) console.log("refetch", ["ODV_PRO", "DETAILED_LIST", id]);
      return GET(api, {
        table: "v_lista_righe",
        profile: "vend",
        lista_testate_id: `eq.${id}`,
        select:
          "id,lista_testate_id,s1,s2,s3,s4,tr,art_id,marchio,linea,codice,dex,dex2,costo_un_orig,variaz_su_catal,ricar_su_prog,sconto_vend,costo_un_mio,prezzo_un_lordo,prezzo_un_netto,qta,um,cod_iva,prz_tot_ivato,gru_fatt_nr,gru_cons_nr,causale,prz_catal_est_ivato,categ_contab,b_s,prz_tot_non_ivato,margine,modif_marchio,modif_linea,modif_codice,modif_dex,modif_dex2,obblig_marchio,obblig_linea,obblig_codice,obblig_dex,obblig_dex2",
        ...filters,
      });
    },
  }),

  ODV_PRO_SUMMARY_LIST: (api, { id }, filters = {}) => ({
    key: ["ODV_PRO", "SUMMARY_LIST", id],
    func: () =>
      GET(api, {
        table: "v_lista_righe_forma_riep",
        select:
          "seq,item,dex,um,qta,prz_tot_ivato,stato_acquisto,gru_fatt_nr,gru_cons_nr,stato_consegna,lista_id,lista_testate_id,gru_fatt_id,gru_cons_id",
        profile: "vend",
        lista_testate_id: `eq.${id}`,
        ...filters,
      }),
  }),

  ODV_PRO_TYPE: (api, props, filters) => ({
    key: ["ODV_PRO_TYPE"],
    func: () =>
      GET(api, {
        table: "domini",
        select: "cod,note",
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
        select: "cod,note",
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
        select: "sede,dex",
        profile: "core",
        ...filters,
      }),
  }),

  PRO_FOR_ODV: (api, { id }, filters = {}) => ({
    key: ["PRO_FOR_ODV", { id }, filters],
    func: () =>
      GET(api, {
        table: "v_pro_per_odv",
        profile: "vend",
        ...filters,
      }),
  }),

  SELLERS: (api, props, filters) => ({
    key: ["SITES"],
    func: () =>
      GET(api, {
        table: "persone_con_odv",
        select: "id,denom",
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

  BILLING_GROUP: (api, { id }, filters = {}) => ({
    key: ["BILLING_GROUP", id],
    func: () =>
      GET(api, { table: "v_odv_gru_fatt", profile: "vend", id: `eq.${id}` }),
  }),
};

export { endpoints, POST };
