import { AddRounded } from "@mui/icons-material";
import { Box, Stack, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  gridFilteredDescendantCountLookupSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid-pro";
import { CloseSquare, MinusSquare, PlusSquare } from "components/base/Icons";
import { isNavigationKey } from "config/utils";
import { useMemo } from "react";

const CustomGridTreeDataGroupingCell = (props) => {
  const { id, field, rowNode, setRows, creating } = props;

  const apiRef = useGridApiContext();
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector
  );

  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

  const handleKeyDown = (event) => {
    if (event.key === " ") {
      event.stopPropagation();
    }
    if (isNavigationKey(event.key) && !event.shiftKey) {
      apiRef.current.publishEvent("cellNavigationKeyDown", props, event);
    }
  };

  const handleClick = (event) => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation();
  };

  const Icon = useMemo(() => {
    if (rowNode.childrenExpanded) return MinusSquare;
    else if (filteredDescendantCount > 0) return PlusSquare;
    else return CloseSquare;
  }, [rowNode, filteredDescendantCount]);

  const header = useMemo(
    () => (
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
        sx={{ flex: 1, height: "100%" }}
      >
        {props.row?.cat_dex || rowNode.groupingKey}
        {props.row?.associabile && (
          <Tooltip title={`Aggiungi articolo in ${props.row.cat_dex}`} arrow>
            <AddRounded
              onClick={() =>
                !creating &&
                setRows((old) => {
                  let index = -1;
                  for (let i = 0; i < old.length; ++i) if (old[i].id === props.row.id) index = i;

                  if (index !== -1) {
                    const newRows = [...old];
                    const id = "9999" + parseInt(Math.random() * 10000);
                    const newRow = {
                      id,
                      path: [...props.row.path, id],
                      creating: true,
                      cat_dex: "Nuovo articolo",
                      art_id: null,
                      tipo_art_dex: null,
                      cat_id: newRows[index].cat_id,
                      marchio: null,
                      linea: null,
                      codice: null,
                      art_dex: null,
                      dex2: null,
                      um: null,
                      cod_iva: null,
                      categ_cont_dex: null,
                      dex_fissa: null,
                      stato_dex: null,
                      sequenza: null,
                    };
                    if (index + 1 !== newRows.length - 1) {
                      const newArray = [];
                      for (let i = 0; i < newRows.length; ++i) {
                        if (i === index + 1) newArray.push(newRow);
                        else if (i < index + 1) newArray.push(newRows[i]);
                        else newArray.push(newRows[i - 1]);
                      }
                      return newArray;
                    } else newRows.push(newRow);
                    return newRows;
                  } else return old;
                })
              }
              sx={{
                fontSize: 18,
                cursor: "pointer",
                "&:hover": creating ? { color: "primary.main" } : {},
                color: creating ? grey[200] : grey[500],
              }}
            />
          </Tooltip>
        )}
      </Stack>
    ),
    [rowNode, props, setRows, creating]
  );
  return (
    <Stack direction="row" sx={{ height: "100%", px: 1 }}>
      <Box sx={{ height: "100%", display: "flex", direction: "row" }}>
        {rowNode.depth > 0 &&
          [...Array(rowNode.depth).keys()].map((e, i) => (
            <div
              key={i}
              style={{
                height: "100%",
                borderLeft: "1px dashed black",
                marginLeft: 6,
                marginRight: 7,
              }}
            >
              &nbsp;
            </div>
          ))}
      </Box>

      {filteredDescendantCount > 0 ? (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ height: "100%", flex: 1 }}>
          <Icon tabIndex={-1} onClick={handleClick} onKeyDown={handleKeyDown} />
          {header}
        </Stack>
      ) : (
        <>
          {props?.row?.art_id ? (
            <span />
          ) : (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ height: "100%", flex: 1 }}>
              <Icon tabIndex={-1} />
              {header}
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
};

export { CustomGridTreeDataGroupingCell };
