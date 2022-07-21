function getOdvStateRowPath(row) {
  let path = [row.gru_fatt_id];
  if (row.gru_cons_id) path = [...path, row.gru_cons_id];
  else return path;

  if (row.fornitore_dex) path = [...path, row.fornitore_dex];
  else return path;

  if (row.type === "item") path = [...path, row.id];

  return path;
}

function generateOdvStateRows(rows) {
  if (!rows) return [];
  const factGroup = {};
  const shippingGroup = {};
  const supplierGroup = {};

  for (let row of rows) {
    if (row.gru_fatt_id && !factGroup[row.gru_fatt_id])
      factGroup[row.gru_fatt_id] = {
        gru_fatt_id: row.gru_fatt_id,
        gru_fatt_nr: row.gru_fatt_nr,
        type: "gru_fatt",
        reference: { gru_fatt_id: row.gru_fatt_id },
      };

    if (row.gru_cons_id && !shippingGroup[row.gru_cons_id])
      shippingGroup[row.gru_cons_id] = {
        gru_fatt_id: row.gru_fatt_id,
        gru_cons_nr: row.gru_cons_nr,
        gru_cons_id: row.gru_cons_id,
        gru_cons_dex: row.gru_cons_dex,
        type: "gru_cons",
        dragText: `Gruppo consegna ${row.gru_cons_nr}`,
        reference: { gru_cons_id: row.gru_cons_id },
      };

    if (row.fornitore_dex && !supplierGroup[row.gru_cons_id + row.fornitore_dex])
      supplierGroup[row.gru_cons_id + row.fornitore_dex] = {
        gru_fatt_id: row.gru_fatt_id,
        gru_cons_id: row.gru_cons_id,
        fornitore_dex: row.fornitore_dex,
        type: "supplier",
        dragText: row.fornitore_dex,
        reference: { gru_cons_id: row.gru_cons_id, fornitore_dex: row.fornitore_dex },
      };
  }

  return [
    ...rows.map((e) => ({
      ...e,
      dragText: `${e.item}`,
      type: "item",
      reference: { riga_id: e.riga_id },
    })),
    ...Object.values(factGroup),
    ...Object.values(shippingGroup),
    ...Object.values(supplierGroup),
  ].map((e, i) => ({
    ...e,
    path: getOdvStateRowPath({ ...e, id: i }),
    id: i,
  }));
}

export { generateOdvStateRows, getOdvStateRowPath };
