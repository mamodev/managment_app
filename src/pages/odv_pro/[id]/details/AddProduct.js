import { Add } from "@mui/icons-material";
import { Box, Button, Dialog } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CreateProductDialog from "./CreateProductDialog";

export default function AddProduct(project, section) {
  return ({ data }) => <AddProductDialog data={data} project={project} section={section} />;
}

function AddProductDialog({ project, section }) {
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  return (
    <Box>
      <Button startIcon={<Add />} size="small" onClick={() => setOpen(true)}>
        Aggiungi articolo
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <CreateProductDialog
          id={id}
          project={project}
          section={section}
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
        />
      </Dialog>
    </Box>
  );
}
