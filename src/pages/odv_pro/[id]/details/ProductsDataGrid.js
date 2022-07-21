import { Close, Delete, Restore } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import useOdvDetailedListDelete from "api/mutation/useOdvDetailedListDelete";
import useOdvDetailedListReorder from "api/mutation/useOdvDetailedListReorder";
import useOdvDetailedMutation from "api/mutation/useOdvDetailedMutation";
import useOdvDetailedList from "api/query/useOdvDetailedList";
import ApiDataGrid from "components/templates/ApiDataGrid/ApiDataGrid";
import { reverseDate } from "config/utils";
import { useDialog } from "context/DialogContext";
import deepEqual from "deep-equal";
import { useCallback, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AddProduct from "./AddProduct";
import CancelLineDialog from "./CancelLineDialog";
import RestoreLineDialog from "./RestoreLineDialog";
import ProjectDetails from "./ProjectDetails";

//Contant vars and functions
const getRowClassName = ({ row }) => {
  if (row.caus_annullam) return "super-app-theme--foreground-error";
  if (row.tipo_riga === "P") return "super-app-theme--project";
};

export default function ProductsDataGrid({ rowType, structId, projectId, columns = [] }) {
  //Getting url params
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editing = useMemo(() => searchParams.has("editing"), [searchParams]);
  //Get dialog context
  const { openDialog, closeDialog } = useDialog();
  //Fetching data for the table
  const { data, isSuccess, isLoading: dataLoading } = useOdvDetailedList(id, rowType, structId);

  //Mutations
  const { mutate: changeRowOrder } = useOdvDetailedListReorder();
  const { mutateAsync: updateRow, isLoading: rowUpdating } = useOdvDetailedMutation();
  const { mutate: deleteRow, isLoading: rowDeleting } = useOdvDetailedListDelete();

  //States
  const [detailPanelHeight, setDetailsPanelHeight] = useState({});

  //EventHandler
  const handleRowOrderChange = useCallback(
    ({ oldIndex, targetIndex }) => {
      const oldRow = data[oldIndex];
      const targetRow = data[targetIndex];
      changeRowOrder({
        id: oldRow.id,
        target_id: targetRow.id,
        position: oldIndex < targetIndex,
        oldIndex,
        targetIndex,
        row: oldRow,
      });
    },
    [changeRowOrder, data]
  );

  const handleRowUpdate = useCallback(
    async (row, old) => {
      console.log(row);
      if (deepEqual(row, old)) return old;
      try {
        if (row.prezzo_un_netto !== old.prezzo_un_netto) row.sconto_vend = null;
        else if (row.sconto_vend !== old.sconto_vend) row.prezzo_un_netto = null;
        else if (row.prezzo_un_lordo !== old.prezzo_un_lordo) {
          row.sconto_vend = 0;
          row.prezzo_un_netto = null;
        }
        await updateRow(row);
        return row;
      } catch {
        return old;
      }
    },
    [updateRow]
  );

  //DataGrid Components and Props
  const getDetailPanelContent = useCallback(
    ({ row }) => {
      return row.tipo_riga === "P" ? (
        <ProjectDetails
          editing={editing}
          odv_id={id}
          project_id={row.id}
          setHeigth={(height) => {
            setDetailsPanelHeight((old) => ({ ...old, [row.id]: height }));
          }}
        />
      ) : null;
    },
    [setDetailsPanelHeight, editing, id]
  );

  const getDetailPanelHeight = useCallback(
    ({ row }) => (detailPanelHeight[row.id] ? detailPanelHeight[row.id] : 0),
    [detailPanelHeight]
  );

  const isCellEditable = useCallback(
    ({ field, row }) => {
      if (!editing) return false;
      if (row.caus_annullam) return false;

      switch (field) {
        case "marchio":
          return row.modif_marchio;
        case "linea":
          return row.modif_linea;
        case "codice":
          return row.modif_codice;
        case "dex":
          return row.modif_dex;
        case "dex2":
          return row.modif_dex2;
        default:
          return true;
      }
    },
    [editing]
  );

  const rowActions = useMemo(() => {
    return [
      {
        icon: ({ row }) => (
          <Tooltip arrow title={`Elimina riga ${row.marchio} ${row.linea} ${row.codice}`}>
            <Delete />
          </Tooltip>
        ),
        func: ({ row }) => deleteRow(row),
      },
      {
        icon: ({ row }) =>
          row.caus_annullam ? (
            <Tooltip
              arrow
              title={`Ripristina, ${row.caus_annullam_dex} ${reverseDate(row.data_annullam, "/")}`}
            >
              <Restore />
            </Tooltip>
          ) : (
            <Tooltip arrow title={`Anulla riga`}>
              <Close />
            </Tooltip>
          ),
        func: ({ row }) =>
          row.caus_annullam
            ? openDialog(
                "restore_line",
                <RestoreLineDialog row={row} onClose={() => closeDialog("restore_line")} />
              )
            : openDialog(
                "cancel_line",
                <CancelLineDialog row={row} onClose={() => closeDialog("cancel_line")} />
              ),
      },
    ];
  }, [deleteRow, openDialog, closeDialog]);

  const toolbarActions = useMemo(
    () => (editing ? [AddProduct(projectId, structId)] : []),
    [editing, structId, projectId]
  );

  const rows = useMemo(
    () =>
      isSuccess
        ? data.map((e, i) => ({
            ...e,
            total: (e.costo_un_mio * e.qta).toFixed(2),
            __reorder__: `${e.marchio} ${e.linea} ${e.codice} ${e.dex}`,
          }))
        : [],
    [isSuccess, data]
  );

  const expandComponents = structId ? {} : { getDetailPanelHeight, getDetailPanelContent };

  return (
    <ApiDataGrid
      loading={dataLoading || rowUpdating || rowDeleting}
      rows={rows}
      columns={columns}
      processRowUpdate={handleRowUpdate}
      isCellEditable={isCellEditable}
      rowReordering={editing}
      onRowOrderChange={handleRowOrderChange}
      rowActions={rowActions}
      toolbarActions={toolbarActions}
      getRowClassName={getRowClassName}
      pinnedColumns={{ right: ["actions"] }}
      columnVisibilityModel={{ actions: editing }}
      {...expandComponents}
    />
  );
}
