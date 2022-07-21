import { Delete, Restore, RestoreFromTrash } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import ApiSelector from "components/modules/ApiSelect";
import ApiDataList from "components/templates/ApiDataList";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovementAddRow from "./MovementAddRow";
import MovementHeader from "./MovementHeader";
import { headers } from "./movimento_headers";

//TODO add controls when there is reference active

function preprocessHeader(header) {
  if (header.controp_dex && header.controp_id)
    header.controp = { denom: header.controp_dex, id: header.controp_id };
  else header.controp = null;
  return header;
}
export default function Movimento({ headerData, rowsData, buttonRef, save }) {
  const [headerState, setHeaderSate] = useState(preprocessHeader(headerData));
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState({ maga: null, art: null });

  const hasReference = useMemo(() => rows.some((e) => !!e.riferimento), [rows]);

  const handleSaveEvent = useCallback(() => {
    save(headerState, rows);
  }, [save, headerState, rows]);

  useEffect(() => {
    if (buttonRef) buttonRef.onclick = handleSaveEvent;
  }, [buttonRef, handleSaveEvent]);

  const editingCloseHandler = () => setEditing({ mag: null, art: null });

  const [searchParams] = useSearchParams();

  const isEditing = useMemo(() => searchParams.has("editing"), [searchParams]);

  useEffect(
    () => setRows(rowsData.map((e) => ({ ...e, state: null, pre: null }))),
    [setRows, rowsData, isEditing]
  );

  const header = useMemo(
    () => <MovementHeader isEditing={isEditing} setHeaderSate={setHeaderSate} data={headerData} />,
    [isEditing, setHeaderSate, headerData]
  );

  const handleRowAdd = useCallback(
    (data) => {
      setRows((old) => [...old, createRow({ ...data, rowsLength: old.length })]);
    },
    [setRows]
  );

  const { rowActions, toolbarActions } = useMemo(
    () =>
      isEditing
        ? {
            rowActions: [
              {
                icon: (props) => (
                  <Tooltip title={props.row.state === "del" ? "Ripristina" : "Elimina riga"} arrow>
                    {props.row.state === "del" ? <RestoreFromTrash /> : <Delete />}
                  </Tooltip>
                ),
                func: (props) => {
                  setRows((old) => {
                    let i = -1;
                    for (let j = 0; j < old.length; ++j) if (old[j].id === props.id) i = j;

                    if (i !== -1) {
                      const newRows = [...old];
                      if (newRows[i].state === "del") {
                        newRows[i] = newRows[i].pre;
                      } else if (newRows[i].state === "add") {
                        newRows.splice(i, 1);
                      } else {
                        newRows[i].pre = { ...newRows[i] };
                        newRows[i].state = "del";
                      }
                      return newRows;
                    }
                    return old;
                  });
                },
              },
              {
                icon: () => (
                  <Tooltip title="Ripristina modifica" arrow>
                    <Restore />
                  </Tooltip>
                ),

                func: (props) =>
                  setRows((old) => {
                    let i = -1;
                    for (let j = 0; j < old.length; ++j) if (old[j].id === props.id) i = j;

                    if (i !== -1) {
                      const newRows = [...old];
                      newRows[i] = newRows[i].pre;
                      return newRows;
                    }
                    return old;
                  }),
              },
            ],
            toolbarActions: hasReference
              ? []
              : [() => <MovementAddRow onCreate={handleRowAdd} sede={headerData.sede} />],
          }
        : { rowActions: [], toolbarActions: [] },
    [isEditing, handleRowAdd, setRows, headerData, hasReference]
  );

  const handleCellEditCommit = ({ field, value }, row) => {
    setRows((old) => {
      let i = -1;
      for (let j = 0; j < old.length; ++j) if (old[j].id === row.id) i = j;

      if (i !== -1) {
        const newRows = [...old];
        newRows[i].pre = { ...newRows[i] };
        newRows[i][field] = value;
        if (!newRows[i].state) newRows[i].state = "upd";

        return newRows;
      }
      return old;
    });
  };

  return (
    <>
      <Typography variant="h6">
        <strong>{headerData.sede_dex}</strong> {headerData.tipo_doc_mag_dex}
      </Typography>
      {header}

      <Box mt={4}>
        <ApiDataList
          columns={headers(isEditing)}
          data={rows}
          toolbarActions={toolbarActions}
          rowActions={rowActions}
          rowActionsFilter={(e, i, { row }) => (i === 0 ? true : row.pre && row.state !== "del")}
          isCellEditable={({ row }) => row.state !== "del" && isEditing}
          onCellEditCommit={handleCellEditCommit}
          onCellDoubleClick={({ field, row: { id } }) => {
            if (field === "magazzino_dex" && isEditing) setEditing({ mag: id, art: null });
            else if (
              (field === "marchio" || field === "linea" || field === "codice" || field === "dex") &&
              isEditing
            )
              setEditing({ mag: null, art: id });
          }}
          getRowClassName={({ row }) => {
            if (row.state === "upd") return "super-app-theme--warning";
            if (row.state === "del") return "super-app-theme--error";
            if (row.state === "add") return "super-app-theme--success";
            else return "";
          }}
        />
      </Box>

      {editing.art && (
        <Dialog open={editing.art} fullWidth onClose={editingCloseHandler}>
          <DialogTitle>Modifica articolo</DialogTitle>

          <DialogContent>
            <ApiSelector
              placeholder="Cerca articolo..."
              endpoint={endpoints.PRODUCTS}
              title={null}
              onSelect={({ art_id, marchio, linea, art_dex, um, codice }) =>
                setRows((old) => {
                  let i = -1;
                  for (let j = 0; j < old.length; ++j) if (old[j].id === editing.art) i = j;

                  if (i !== -1) {
                    const newRows = [...old];
                    newRows[i].pre = { ...newRows[i] };
                    newRows[i].art_id = art_id;
                    newRows[i].linea = linea;
                    newRows[i].codice = codice;
                    newRows[i].marchio = marchio;
                    newRows[i].dex = art_dex;
                    newRows[i].um = um;
                    if (newRows[i].state !== "add") newRows[i].state = "upd";
                    editingCloseHandler();
                    return newRows;
                  }
                  return old;
                })
              }
              fields={[
                { field: "marchio", headerName: "Marchio" },
                { field: "linea", headerName: "Liena" },
                { field: "codice", headerName: "Codice" },
                { field: "cat_dex", headerName: "Categoria" },
                { field: "art_dex", headerName: "Descrizione" },
              ]}
              searchParams={["marchio", "linea", "cat_dex", "art_dex"]}
            />
          </DialogContent>

          <DialogActions>
            <Button color="error" onClick={editingCloseHandler}>
              Chiudi
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {editing.mag && (
        <Dialog open={editing.mag} fullWidth onClose={editingCloseHandler}>
          <DialogTitle>Modifica Magazzino</DialogTitle>

          <DialogContent>
            <ApiSelector
              placeholder="Cerca magazzino..."
              endpoint={endpoints.WAREHOUSES}
              title={null}
              onSelect={({ cod, dexm }) =>
                setRows((old) => {
                  let i = -1;
                  for (let j = 0; j < old.length; ++j) if (old[j].id === editing.mag) i = j;

                  if (i !== -1) {
                    const newRows = [...old];
                    newRows[i].pre = { ...newRows[i] };
                    newRows[i].magazzino = cod;
                    newRows[i].magazzino_dex = dexm;
                    if (newRows[i].state !== "add") newRows[i].state = "upd";
                    editingCloseHandler();
                    return newRows;
                  }
                  return old;
                })
              }
              fields={[
                { field: "sede", headerName: "Sede" },
                { field: "cod", headerName: "Codice" },
                { field: "dexm", headerName: "Descrizione" },
              ]}
              filters={{ sede: `eq.${headerData.sede}` }}
              searchParams={["dexm", "cod"]}
            />
          </DialogContent>

          <DialogActions>
            <Button color="error" onClick={editingCloseHandler}>
              Chiudi
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

function createRow({
  rowsLength,
  magazzino: { cod, dexm },
  articolo: { art_id, marchio, linea, art_dex, um, codice },
  qta,
  colli,
}) {
  return {
    state: "add",
    pre: null,
    mov_id: null,
    id: Math.random() * 10000,
    riga: rowsLength + 1,
    magazzino: cod,
    magazzino_dex: dexm,
    odv_riga_id: null,
    oda_riga_id: null,
    riferimento: null,
    art_id,
    marchio,
    linea,
    dex: art_dex,
    codice: codice,
    dex2: null,
    articolo: null,
    um,
    qta,
    nr_colli: colli,
    ubicaz_id: null,
  };
}
