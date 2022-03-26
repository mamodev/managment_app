import { Stack } from "@mui/material";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import DataGridContainer from "components/layout/DataGridCotainer";

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
  columns,
  data: rows,
  pageSize = 10,
  filterOutlet,
  containerProps = {},
  toolbarActions = [],
  ...props
}) {
  return (
    <Stack spacing={2} {...containerProps}>
      {filterOutlet}
      <DataGridContainer>
        <DataGrid
          {...props}
          rowHeight={40}
          columns={columns}
          rows={rows ? rows.map((e, i) => ({ ...e, id: i })) : []}
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
        />
      </DataGridContainer>
    </Stack>
  );
}
