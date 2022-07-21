import { Box } from "@mui/material";
import useOdvStateItemMove from "api/mutation/useOdvStateItemMove";
import useOdvStateShippingGroupMove from "api/mutation/useOdvStateShippingGroupMove";
import useOdvStateSupplierMove from "api/mutation/useOdvStateSupplierMove";
import useOdvState from "api/query/useOdvState";
import ApiDataGrid from "components/templates/ApiDataGrid/ApiDataGrid";
import { useWindowManager } from "context/NewWindowManagerContext";
import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { odv_pro_state_summary } from "./columns";
import OdvStateCustomGroupCell from "./OdvStateCutomGroupCell";
import { generateOdvStateRows } from "./OdvStateRowFunctions";

export default function OdvProState() {
  const { id } = useParams();

  const { newWindow } = useWindowManager();
  const { data, isLoading } = useOdvState(id);

  const { mutate: moveShippingGroup, isLoading: isShippingGroupLoading } =
    useOdvStateShippingGroupMove();

  const { mutate: moveRow, isLoading: isRowLoading } = useOdvStateItemMove();
  const { mutate: moveSupplier, isLoading: isSupplierLoading } = useOdvStateSupplierMove();

  const handleRowReoder = useCallback(
    (type, reference, target) => {
      console.log("Reorder", type, reference, target);
      if (type === "gru_cons") {
        moveShippingGroup({
          in_gr_cons_id: reference.gru_cons_id,
          in_gr_fatt_id: target.gru_fatt_id,
          odv_id: id,
        });
      }
      if (type === "item") {
        moveRow({ in_riga_id: reference.riga_id, in_gr_cons_id: target.gru_cons_id, odv_id: id });
      }

      if (type === "supplier") {
        moveSupplier({
          items: reference.rows.map((in_riga_id) => ({
            in_riga_id,
            in_gr_cons_id: target.gru_cons_id,
          })),
          odv_id: id,
        });
      }
    },
    [moveRow, moveShippingGroup, moveSupplier, id]
  );

  const groupingColDef = useMemo(
    () => ({
      headerName: "Gruppo",
      cellClassName: "super-app-theme--group",
      renderCell: (params) => <OdvStateCustomGroupCell onRowMove={handleRowReoder} {...params} />,
      flex: 2,
      minWidth: 350,
    }),
    [handleRowReoder]
  );

  const rows = useMemo(() => generateOdvStateRows(data), [data]);
  return (
    <Box p={1}>
      <ApiDataGrid
        treeData
        loading={isLoading || isShippingGroupLoading || isRowLoading || isSupplierLoading}
        defaultGroupingExpansionDepth={2}
        rows={rows}
        columns={odv_pro_state_summary}
        groupingColDef={groupingColDef}
        getTreeDataPath={(row) => row.path}
      />
    </Box>
  );
}
