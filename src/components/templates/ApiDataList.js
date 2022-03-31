import { Stack } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import DataGridContainer from "components/layout/DataGridCotainer";
import { useEffect, useState } from "react";

function ToolBar({ rows, toolbarActions }) {
  return (
    <GridToolbarContainer>
      {toolbarActions?.map((Element, i) => (
        <Element key={i} data={rows} />
      ))}
    </GridToolbarContainer>
  );
}

export default function ApiDataList({
  columns: defaultColumns,
  data = [],
  pageSize = 10,
  filterOutlet,
  containerProps = {},
  toolbarActions = [],
  onCellEditCommit,
  rowActions = [],
  rowActionsPosition = "start",
  ...props
}) {
  const [columns, setColumns] = useState(defaultColumns);

  const rows = data.map((e, i) => ({ id: i, ...e }));

  useEffect(() => {
    if (rowActions.length === 0) {
      setColumns(defaultColumns);
      return;
    }
    const actions = {
      field: "actions",
      type: "actions",
      headerName: "Azioni",
      width: 100,
      getActions: (props) => {
        return rowActions.map(({ icon, func }) => (
          <GridActionsCellItem
            icon={icon}
            label="action"
            onClick={() => func(props)}
          />
        ));
      },
    };
    if (rowActionsPosition === "start") setColumns((old) => [actions, ...old]);
    else setColumns((old) => [...old, actions]);
  }, [rowActions, rowActionsPosition]);

  const cellEditCommitHandler = (params) =>
    onCellEditCommit?.(
      params,
      data[rows.indexOf(rows.find((r) => r.id === params.id))]
    );

  return (
    <Stack spacing={2} {...containerProps}>
      {filterOutlet}
      <DataGridContainer>
        <DataGrid
          {...props}
          rowHeight={40}
          columns={columns}
          rows={rows}
          pageSize={pageSize}
          rowsPerPageOptions={[pageSize]}
          disableSelectionOnClick
          disableColumnFilter={true}
          disableColumnMenu
          components={{
            Toolbar: ToolBar,
          }}
          componentsProps={{
            toolbar: { rows, toolbarActions },
          }}
          onCellEditCommit={cellEditCommitHandler}
        />
      </DataGridContainer>
    </Stack>
  );
}
