import { DataGridPro, GridActionsCellItem, GridToolbarContainer } from "@mui/x-data-grid-pro";
import { CircularProgress, LinearProgress, Stack, Typography } from "@mui/material";
import DataGridContainer from "components/layout/DataGridCotainer";
import { useCallback, useEffect, useRef, useState } from "react";
import { renderCellExpand } from "components/modules/GridCellExpand";
import { isValid } from "config/utils";
import { useConfig } from "context/ConfigContext";

export default function ApiDataGrid({
  filterOutlet,
  height = "fit-content",
  dataGridContainerProps,
  columns: defaultColumns,
  components,
  containerProps,
  rowActions,
  toolbarActions,
  loading,
  ...props
}) {
  const { fields } = useConfig();

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    let newColumns = addValidation(defaultColumns, fields);
    if (rowActions && rowActions.length > 0) {
      newColumns = [
        ...newColumns,
        {
          field: "actions",
          type: "actions",
          headerName: "Azioni",
          cellClassName: () => "super-app-theme--actions",
          width: 60,
          getActions: (props) => {
            return rowActions.map(({ icon, func }) => (
              <GridActionsCellItem
                size="small"
                icon={icon(props)}
                label="action"
                onClick={() => func?.(props)}
              />
            ));
          },
        },
      ];
    }
    setColumns(newColumns);
  }, [defaultColumns, fields, rowActions]);

  //LICENSE KEY OVERLAY REMOVER
  const gridRef = useRef();
  const dataGridRef = useRef();
  useEffect(() => {
    let licenseRef = dataGridRef.current?.getElementsByClassName("MuiDataGrid-main")[0]?.children;
    if (licenseRef && licenseRef.length) {
      licenseRef = licenseRef[licenseRef.length - 2];
      if (licenseRef) licenseRef.innerHTML = "";
    }
  });

  const CustomToolbar = useCallback(() => {
    return (
      <GridToolbarContainer>
        {toolbarActions?.map((Action, i) => (
          <Action key={i} />
        ))}
      </GridToolbarContainer>
    );
  }, [toolbarActions]);

  const rowEditingRef = useRef();
  const handleCellEditStart = ({ id }, e) => {
    if (rowEditingRef.current) e.defaultMuiPrevented(true);
    else rowEditingRef.current = id;
  };

  const handleCellEditStop = ({ id }, e) => {
    rowEditingRef.current = null;
  };

  useEffect(() => {
    if (loading) document.body.style.cursor = "wait";
    else document.body.style.cursor = "default";
  }, [loading]);
  return (
    <Stack spacing={2} {...containerProps}>
      {filterOutlet}
      <DataGridContainer {...dataGridContainerProps} height={height} ref={gridRef}>
        <DataGridPro
          ref={dataGridRef}
          loading={loading}
          columns={columns}
          rowHeight={30}
          editMode="row"
          onRowEditStart={handleCellEditStart}
          onRowEditStop={handleCellEditStop}
          experimentalFeatures={{ newEditingApi: true }}
          hideFooter
          autoHeight
          autoPageSize
          headerHeight={40}
          components={{
            Toolbar: CustomToolbar,
            ...components,
          }}
          {...props}
        />
      </DataGridContainer>
    </Stack>
  );
}

function addValidation(columns, fields) {
  let validatedColumns = columns.map((column) => ({
    renderCell: renderCellExpand,
    // ...getEditCell(column),
    ...column,
    preProcessEditCellProps: (params) => {
      const pre_processed = column.preProcessEditCellProps
        ? column.preProcessEditCellProps(params).error
        : false;

      return {
        ...params.props,
        error: !isValid(column.field, params.props.value, fields) || pre_processed,
      };
    },
  }));
  return validatedColumns;
}
