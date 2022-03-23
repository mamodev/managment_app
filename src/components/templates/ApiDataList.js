import { Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DataGridContainer from "components/layout/DataGridCotainer";

export default function ApiDataList({
  columns,
  data: rows,
  pageSize = 10,
  filterOutlet,
  containerProps = {},
}) {
  return (
    <Stack spacing={2} {...containerProps}>
      {filterOutlet}
      <DataGridContainer>
        <DataGrid
          rowHeight={40}
          columns={columns}
          rows={rows ? rows.map((e, i) => ({ id: i, ...e })) : []}
          pageSize={pageSize}
          rowsPerPageOptions={[pageSize]}
          disableSelectionOnClick
          disableColumnFilter={true}
          disableColumnMenu
        />
      </DataGridContainer>
    </Stack>
  );
}
