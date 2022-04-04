import { Stack, styled } from "@mui/material";
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

const StyledDataGrid = styled(DataGrid)({
  "& .MuiDataGrid-footerContainer": {
    minHeight: 0,
  },
});

function CustomPagination() {
  return <div></div>;
}

export default function ApiDataList({
  verbose = false,
  columns: defaultColumns,
  data = [],
  filterOutlet,
  containerProps = {},
  toolbarActions = [],
  onCellEditCommit,
  rowActions = [],
  rowActionsPosition = "start",
  ...props
}) {
  if (verbose) console.log(data);

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
        <StyledDataGrid
          autoHeight
          rowHeight={40}
          columns={columns}
          rows={rows}
          pageSize={rows.length}
          disableSelectionOnClick
          disableColumnFilter={true}
          disableColumnMenu
          components={{
            Toolbar: ToolBar,
            Pagination: CustomPagination,
          }}
          componentsProps={{
            toolbar: { rows, toolbarActions },
          }}
          onCellEditCommit={cellEditCommitHandler}
          {...props}
        />
      </DataGridContainer>
    </Stack>
  );
}
