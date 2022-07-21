import { yellow } from "@mui/material/colors";
import { Box } from "@mui/system";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { endpoints } from "api";
import DataGridContainer from "components/layout/DataGridCotainer";
import { CustomGridTreeDataGroupingCell } from "components/modules/CustomGridTreeDataGroupingCell";
import { useAuthContext } from "context/AuthContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { article_columns } from "./columns";
import useDomains from "./useDomains";

function getTreePath(row) {
  const path = [row.piano, ...row.cat_seq.split(".")];
  if (row.art_id) path.push(row.id);
  return path;
}

function useColumns(deleteRow) {
  const [columns, setColumns] = useState([]);
  const { products, iva, um, cat } = useDomains();

  useEffect(() => {
    if (products && iva && um && cat) {
      setColumns(article_columns(products, iva, um, cat, deleteRow));
    }
  }, [products, iva, um, cat, deleteRow]);

  return columns;
}

export default function ProductsTable({ data, filters = {} }) {
  const { api } = useAuthContext();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);

  const { func: updateFunc, revalidate: revalidateUpdate } = endpoints.PRODUCTS_DETAIL(api).update;
  const { mutateAsync: update, isLoading: isUpdating } = useMutation(updateFunc, {
    onSuccess: (data) => revalidateUpdate(data, queryClient),
  });

  const { func: createFunc, revalidate: revalidateCreate } = endpoints.PRODUCTS_DETAIL(api).add;
  const { mutateAsync: create, isLoading: isCreating } = useMutation(createFunc, {
    onSuccess: (data) => revalidateCreate(data, queryClient),
  });
  const { func: deleteFunc, revalidate: revalidateDelete } = endpoints.PRODUCTS_DETAIL(api).delete;
  const { mutate: deleteRow, isLoading: isDeleting } = useMutation(deleteFunc, {
    onSuccess: (data) => revalidateDelete(data, queryClient),
  });

  const columns = useColumns(deleteRow);

  const [rows, setRows] = useState(
    data.map((e, i) => {
      const row = { ...e, id: i };
      row.path = getTreePath(row);
      if (row.cat_dex) row.cat_dex = row.cat_dex.replaceAll("-", "").replaceAll("|", "");
      return row;
    })
  );

  useEffect(
    () =>
      setRows(
        data.map((e, i) => {
          const row = { ...e, id: i };
          row.path = getTreePath(row);
          if (row.cat_dex) row.cat_dex = row.cat_dex.replaceAll("-", "").replaceAll("|", "");
          return row;
        })
      ),
    [data]
  );

  const containerRef = useRef();

  const groupingColDef = useMemo(
    () => ({
      headerName: "Categoria",
      cellClassName: "super-app-theme--group",
      renderCell: (params) => (
        <CustomGridTreeDataGroupingCell setRows={setRows} creating={creating} {...params} />
      ),
      flex: 1.5,
      minWidth: 250,
      maxWidth: 300,
    }),
    [setRows, creating]
  );

  const filterModel = useMemo(() => {
    let items = [];
    for (let key of Object.keys(filters))
      if (filters[key])
        items.push({ id: key, columnField: key, operatorValue: "is", value: filters[key] });

    console.log(items);
    return {
      items,
    };
  }, [filters]);

  const processRowUpdate = useCallback(
    async (newRow) => {
      const product = {
        in_id: newRow.art_id,
        in_tipo_art_dex: newRow.tipo_art_dex,
        in_fare_oda: null,
        in_categ_id: newRow.cat_id,
        in_marchio: newRow.marchio,
        in_linea: newRow.linea,
        in_codice: newRow.codice,
        in_dex: newRow.art_dex,
        in_dex2: newRow.dex2,
        in_um: newRow.um,
        in_cod_iva: newRow.cod_iva,
        in_categ_cont_dex: newRow.categ_cont_dex,
        in_dex_fissa: newRow.dex_fissa,
        in_stato_dex: newRow.stato_dex,
        in_seq_entro_categ: newRow.sequenza,
        //TODO add tum
        in_tum: null,
      };

      if (newRow.creating) {
        let data = await create(product);
        delete newRow.creating;
        return { ...newRow, ...data };
      } else await update(product);

      return newRow;
    },
    [update, create]
  );

  useEffect(() => {
    setCreating((creating) => {
      const someCreating = rows.some((e) => e.creating);
      if (someCreating !== creating) return someCreating;
      else return creating;
    });
  }, [rows]);

  return (
    <Box ref={containerRef} sx={{ flex: 1, minHeight: 600 }}>
      <DataGridContainer
        height={600}
        sx={{
          "& .MuiDataGrid-cell.MuiDataGrid-cell--editing": { bgcolor: yellow[100] },
          "& .MuiDataGrid-cell.MuiDataGrid-cell--editing .MuiInputBase-root": {
            fontSize: "inherit",
            border: "none",
          },
        }}
      >
        <DataGridPro
          treeData
          editMode="row"
          rowHeight={28}
          processRowUpdate={processRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          columns={columns}
          filterModel={filterModel}
          defaultGroupingExpansionDepth={-1}
          getTreeDataPath={(row) => row.path}
          getRowClassName={({ row }) => {
            if (row.creating) return "super-app-theme--warning";
          }}
          getCellClassName={({ row, field }) => {
            if (field !== "__tree_data_group__" && !row.art_id && !row.creating)
              return "super-app-theme--hide";
          }}
          isCellEditable={({ row }) => {
            const creating = rows.some((e) => e.creating);
            if ((row.art_id || row.creating) && ((creating && row.creating) || !creating))
              return true;
            else return false;
          }}
          initialState={{ pinnedColumns: { left: ["__tree_data_group__"], right: ["actions"] } }}
          rows={rows}
          disableColumnMenu={true}
          autoHeight={false}
          groupingColDef={groupingColDef}
          disablePagination={true}
          hideFooter
        />
      </DataGridContainer>
    </Box>
  );
}
