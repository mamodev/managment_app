import { LinearProgress, Stack, styled } from "@mui/material";
import DataGridContainer from "components/layout/DataGridCotainer";
import { renderCellExpand, renderGridCellExpandEdit } from "components/modules/GridCellExpand";
import { useConfig } from "context/ConfigContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { isValid } from "config/utils";
import { DataGridPro, GridActionsCellItem, GridToolbarContainer } from "@mui/x-data-grid-pro";

//renderGridCellExpandEdit
function getEditCell(column) {
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

const CustomToolBar =
  (position = "start") =>
  ({ rows, toolbarActions, sx }) =>
    (
      <GridToolbarContainer sx={{ justifyContent: position, ...sx }}>
        {toolbarActions?.map((Element, i) => (
          <Element key={i} data={rows} />
        ))}
      </GridToolbarContainer>
    );

function CustomPagination() {
  return <div></div>;
}

export default function ApiDataList({
  columns: defaultColumns,

  data = [], //Dati con cui popolare la tabella
  rowMap = (e, i) => ({ id: i, ...e }), //Funzione che mappa i dati ricevuti in input (Per dare piu flessibilita)
  rowFilter = (e) => true,
  rowActions = [], //Pulsanti per azioni da aggiungere su ogni riga
  rowActionsPosition = "start", //definisce la posizione della colonna actions nela tabella
  rowActionsFilter = () => true,

  filterOutlet, //Componente che renderizza i filtri di query
  containerProps = {}, //Oggetto che contiene le proprietà dello stack esterno
  toolbarActions = [], //Aarray di componeneti che andranno sulla toolbar della tabella
  toolbarPosition = "start", //Proprietà justifyConetent del container
  onCellEditCommit, //Funzione chiamata quando viene fatta una modifica su una riga (a livello di cella)

  onSelectedObjectChange,
  onSelectionModelChange,
  componentsProps: { toolbarProps, ...componentsProps } = {},
  components,

  rowChange = () => {}, //Permette di accedere alle righe dal componente madre
  verbose = false, //Permette di vedere velocemente i dati che arrivano al componente in console
  commitMode = true,
  height = 500,
  autoHeight = true,
  disablePagination = true,
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
    if (rowActions.length > 0) {
      const actions = {
        field: "actions",
        type: "actions",
        headerName: "Azioni",
        cellClassName: () => "super-app-theme--actions",
        width: 60,
        getActions: (props) => {
          return rowActions
            .filter((e, i) => rowActionsFilter(e, i, props))
            .map(({ icon, func }) => (
              <GridActionsCellItem
                size="small"
                icon={icon(props)}
                label="action"
                onClick={() => func?.(props)}
              />
            ));
        },
      };

      if (rowActionsPosition === "start") setColumns([actions, ...defaultColumns]);
      else setColumns([...defaultColumns, actions]);
    } else setColumns(defaultColumns);
  }, [rowActionsPosition, rowActions]);

  //TODO update only if it really changes
  const cellEditCommitHandler = (params) => {
    let row;
    if (commitMode) row = data[rows.indexOf(rows.find((r) => r.id === params.id))];
    else row = rows[rows.indexOf(rows.find((r) => r.id === params.id))];

    if (row[params.field] !== params.value) onCellEditCommit?.(params, { ...row }, data);
  };

  const TableComponents = useMemo(() => {
    const tableComponents = {
      Toolbar: CustomToolBar(toolbarPosition),
    };
    if (disablePagination) tableComponents.Pagination = CustomPagination;
    return {
      ...tableComponents,
      ...components,
    };
  }, [toolbarPosition, components, disablePagination]);

  if (verbose) console.log(data);

  const gridRef = useRef();
  useEffect(() => {
    const licenseRef = gridRef.current?.children[0]?.children[1]?.children[2];
    if (licenseRef) licenseRef.innerHTML = "";
  });
  return (
    <Stack spacing={2} {...containerProps}>
      {filterOutlet}
      <DataGridContainer height={height} ref={gridRef}>
        <DataGridPro
          autoHeight={autoHeight}
          rowHeight={36}
          columns={columns}
          rows={rows.filter(rowFilter)}
          pageSize={rows.length}
          disableSelectionOnClick
          disableColumnFilter={true}
          disableColumnMenu
          components={TableComponents}
          componentsProps={{
            toolbar: { rows, toolbarActions, ...toolbarProps },
            ...componentsProps,
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
