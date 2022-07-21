import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";

const {
  Dialog,
  Box,
  Typography,
  Stack,
  TextField,
  styled,
  TableCell,
  tableCellClasses,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
} = require("@mui/material");
const { grey } = require("@mui/material/colors");
const { useState } = require("react");

export default function FindProduct({ isOpen, onClose }) {
  const [filters, setFilters] = useState({
    marchio: "",
    cat: "",
    desc: "",
  });
  return (
    <Dialog open={isOpen} onClose={() => onClose()}>
      <Box sx={{ p: 3 }}>
        <Typography mb={1} sx={{ fontWeight: 600 }}>
          Seleziona filtri
        </Typography>
        <Stack direction="row" mb={2} spacing={2}>
          <TextField
            value={filters.marchio}
            onChange={(e) => setFilters((old) => ({ ...old, marchio: e.target.value }))}
            label="Marchio"
          />
          <TextField
            value={filters.cat}
            onChange={(e) => setFilters((old) => ({ ...old, cat: e.target.value }))}
            label="Categoria"
          />
          <TextField
            value={filters.desc}
            onChange={(e) => setFilters((old) => ({ ...old, desc: e.target.value }))}
            label="Descrizione"
          />
        </Stack>
        <ApiServer
          endpoint={endpoints.PRODUCTS}
          filters={{
            marchio: filters.marchio === "" ? undefined : `ilike.${filters.marchio.toUpperCase()}*`,
            cat_dex: filters.cat === "" ? undefined : `ilike.*${filters.cat.toUpperCase()}*`,
            art_dex: filters.desc === "" ? undefined : `ilike.*${filters.desc.toUpperCase()}*`,
            limit: "10",
          }}
        >
          <ProductTable onSelect={onClose} />
        </ApiServer>
      </Box>
    </Dialog>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    userSelect: "none",
  },
}));

function ProductTable({ data, onSelect }) {
  return (
    <TableContainer sx={{ border: 1, minHeight: "300px" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>Marchio</StyledTableCell>
            <StyledTableCell>Linea</StyledTableCell>
            <StyledTableCell>Codice</StyledTableCell>
            <StyledTableCell>Categoria</StyledTableCell>
            <StyledTableCell>Descrizione</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((e, i) => (
            <TableRow
              onClick={() => onSelect(e)}
              key={i}
              sx={{
                cursor: "pointer",
                transition: ".1s ease-in-out",
                "&:hover": {
                  bgcolor: grey[300],
                },
              }}
            >
              <StyledTableCell>{e.marchio}</StyledTableCell>
              <StyledTableCell>{e.linea}</StyledTableCell>
              <StyledTableCell>{e.codice}</StyledTableCell>
              <StyledTableCell>{e.cat_dex}</StyledTableCell>
              <StyledTableCell>{e.art_dex}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
