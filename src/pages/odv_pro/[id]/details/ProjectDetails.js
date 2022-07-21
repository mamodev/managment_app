import { Settings } from "@mui/icons-material";
import { Box, Button, debounce } from "@mui/material";
import { useDialog } from "context/DialogContext";
import { useCallback, useEffect, useMemo, useRef } from "react";
import SectionManager from "./SectionManager";
import ProductsDataGrid from "./ProductsDataGrid";
import { odv_pro_id_row_details } from "./columns";
import useOdvProjectStructure from "api/query/useOdvProjectStructure";
import Accordition from "components/base/Accordition";

export default function ProjectDetails({ odv_id, project_id, setHeigth }) {
  const { openDialog } = useDialog();

  const { data, isSuccess } = useOdvProjectStructure(odv_id, project_id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceResize = useCallback(
    debounce(() => setHeigth(containerRef.current.offsetHeight), 10),
    []
  );

  const containerRef = useRef();
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new ResizeObserver(debounceResize);
    observerRef.current.observe(containerRef.current);

    return () => observerRef.current.disconnect();
  }, [debounceResize]);

  const sectionsManager = useMemo(
    () => <SectionManager data={isSuccess ? data : []} />,
    [isSuccess, data]
  );
  const manageSections = useMemo(
    () => (
      <Button
        size="small"
        startIcon={<Settings />}
        onClick={() => openDialog("Add section", sectionsManager, { fullWidth: true })}
      >
        {isSuccess ? "Gestisci categorie" : "Caricamento..."}
      </Button>
    ),
    [openDialog, sectionsManager, isSuccess]
  );

  return (
    <Box sx={{ width: "100%", maxHeight: "100%", overflow: "hidden" }}>
      <Box
        ref={containerRef}
        sx={{ maxHeight: "100%", overflow: "hidden", bgcolor: "primary.light" }}
      >
        {manageSections}

        {isSuccess &&
          data.map((e, i) => (
            <Accordition key={i} name={e.dex}>
              <Box pl={5} pr={2} pb={1}>
                <ProductsDataGrid
                  rowType='in.("D")'
                  projectId={project_id}
                  structId={`eq.${e.struttura_id}`}
                  columns={odv_pro_id_row_details}
                />
              </Box>
            </Accordition>
          ))}
      </Box>
    </Box>
  );
}
