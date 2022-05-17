import { Stack, styled } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbarContainer } from "@mui/x-data-grid";
import DataGridContainer from "components/layout/DataGridCotainer";
import { renderCellExpand, renderGridCellExpandEdit } from "components/modules/GridCellExpand";
import { useConfig } from "context/ConfigContext";
import { useEffect, useState } from "react";
import { isValid } from "config/utils";

//renderGridCellExpandEdit
function getEditCell(column) {
  console.log(column?.type);
  if (column?.type) return {};
  else return { renderEditCell: renderGridCellExpandEdit };
}
function addValidation(columns, fields) {
  let validatedColumns = columns.map((column) => ({
    renderCell: renderCellExpand,
    ...getEditCell(column),
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

const ToolBar =
  (position = "start") =>
  ({ rows, toolbarActions }) =>
    (
      <GridToolbarContainer sx={{ justifyContent: position }}>
        {toolbarActions?.map((Element, i) => (
          <Element key={i} data={rows} />
        ))}
      </GridToolbarContainer>
    );

const StyledDataGrid = styled(DataGrid)({
  "& .MuiDataGrid-footerContainer": {
    minHeight: 0,
  },
});

function CustomPagination() {
  return <div></div>;
}

export default function ApiDataList({
  columns: defaultColumns,

  data = [], //Dati con cui popolare la tabella
  rowMap = (e, i) => ({ id: i, ...e }), //Funzione che mappa i dati ricevuti in input (Per dare piu flessibilita)
  rowActions = [], //Pulsanti per azioni da aggiungere su ogni riga
  rowActionsPosition = "start", //definisce la posizione della colonna actions nela tabella

  filterOutlet, //Componente che renderizza i filtri di query
  containerProps = {}, //Oggetto che contiene le proprietà dello stack esterno
  toolbarActions = [], //Aarray di componeneti che andranno sulla toolbar della tabella
  toolbarPosition = "start", //Proprietà justifyConetent del container
  onCellEditCommit, //Funzione chiamata quando viene fatta una modifica su una riga (a livello di cella)

  onSelectedObjectChange,
  onSelectionModelChange,
  componentsProps,
  components,

  rowChange = () => {}, //Permette di accedere alle righe dal componente madre
  verbose = false, //Permette di vedere velocemente i dati che arrivano al componente in console
  ...props
}) {
  const { fields } = useConfig();
  const [columns, setColumns] = useState(addValidation(defaultColumns, fields));

  const [rows, setRows] = useState(data.map(rowMap));

  useEffect(() => {
    setRows(data.map(rowMap));
  }, [data, setRows]);

  useEffect(() => rowChange(rows), [rows, rowChange]);

  useEffect(() => {
    if (columns.length === defaultColumns.length && rowActions.length > 0) {
      const actions = {
        field: "actions",
        type: "actions",
        headerName: "Azioni",
        width: 100,
        getActions: (props) => {
          return rowActions.map(({ icon, func }) => (
            <GridActionsCellItem icon={icon(props)} label="action" onClick={() => func?.(props)} />
          ));
        },
      };
      if (rowActionsPosition === "start") setColumns((old) => [actions, ...old]);
      else setColumns((old) => [...old, actions]);
    }
  }, []);

  //TODO update only if it really changes
  const cellEditCommitHandler = (params) => {
    const row = data[rows.indexOf(rows.find((r) => r.id === params.id))];
    if (row[params.field] !== params.value) onCellEditCommit?.(params, row);
  };

  if (verbose) console.log(data);
  return (
    <Stack spacing={2} {...containerProps}>
      {filterOutlet}
      <DataGridContainer>
        <StyledDataGrid
          autoHeight
          rowHeight={30}
          columns={columns}
          rows={rows}
          pageSize={rows.length}
          disableSelectionOnClick
          disableColumnFilter={true}
          disableColumnMenu
          components={{
            Toolbar: ToolBar(toolbarPosition),
            Pagination: CustomPagination,
          }}
          componentsProps={{
            toolbar: { rows, toolbarActions },
          }}
          onCellEditCommit={cellEditCommitHandler}
          onSelectionModelChange={
            onSelectionModelChange
              ? onSelectedObjectChange
                ? (newSelectionModel) => {
                    onSelectionModelChange(newSelectionModel);
                    onSelectedObjectChange(
                      rows.filter((e, i) => newSelectionModel.find((e) => e === i))
                    );
                  }
                : onSelectionModelChange
              : undefined
          }
          {...props}
        />
      </DataGridContainer>
    </Stack>
  );
}

//FIXME il primo elemento della lista non viene selezionato
