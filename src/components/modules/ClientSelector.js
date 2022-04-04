import { Search } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import { useAuthContext } from "context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

export default function ClientSelector({ value, onChange: setValue }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState(null);
  const [list, setList] = useState([]);
  const textfieldRef = useRef();

  const { api } = useAuthContext();
  const { key, func } = endpoints.CLIENTS(
    api,
    {},
    !!filter && filter !== " "
      ? { estremi: `like.*${filter.toLowerCase()}*` }
      : {}
  );
  const { data, refetch } = useQuery(key, func, { enabled: filter !== null });

  const search = () => {
    setFilter(textfieldRef.current.value);
  };

  useEffect(() => {
    if (data) setList(data);
  }, [data]);

  useEffect(() => open && refetch(), [open]);

  console.log(filter, data);
  return (
    <Box>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          width: "fit-content",
          border: 1,
          px: 2,
          py: 1,
          borderRadius: 4,
          transition: ".2s ease-in-out",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.02)",
            color: "primary.main",
            borderColor: "primary.main",
          },
        }}
      >
        {value ? (
          <Typography>{value.denom}</Typography>
        ) : (
          <Typography>Seleziona un cliente</Typography>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Seleziona un cliente</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={textfieldRef}
            placeholder="Cerca"
            autoComplete="off"
            onKeyUp={(e) => e.code === "Enter" && search()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={search}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Indirizzo</TableCell>
                <TableCell>Contatti</TableCell>
                <TableCell>Cofice Fiscale</TableCell>
                <TableCell>Comune</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((e, i) => (
                <TableRow
                  hover
                  key={i}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setValue(e);
                    setOpen(false);
                  }}
                >
                  <TableCell>{e.denom}</TableCell>
                  <TableCell>{e.indirizzo_full}</TableCell>
                  <TableCell>{e.contatti}</TableCell>
                  <TableCell>{e.cf_piva}</TableCell>
                  <TableCell>{e.comune_search}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {list.length === 0 && (
            <Typography sx={{ textAlign: "center", p: 2 }}>
              Nessun cliente soddisfa i parametri di ricerca
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpen(false)}>
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
