import { Search } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import CreateClient from "components/templates/CreateClient";
import { useAuthContext } from "context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

export default function ProviderSelector({ value, onChange: setValue, error = false, helperText }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState(null);
  const [list, setList] = useState([]);
  const textfieldRef = useRef();

  const { api } = useAuthContext();
  const { key, func } = endpoints.PROVIDERS(
    api,
    {},
    !!filter && filter !== " " ? { estremi: `like.*${filter.toLowerCase()}*` } : {}
  );
  const { data, refetch } = useQuery(key, func, { enabled: filter !== null });

  const search = () => {
    setFilter(textfieldRef.current.value);
  };

  useEffect(() => {
    if (data) setList(data);
  }, [data]);

  useEffect(() => open && refetch(), [open, refetch]);

  return (
    <Box>
      <Stack spacing={0.5}>
        <Box
          onClick={() => setOpen(true)}
          sx={{
            width: "fit-content",
            border: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            transition: ".2s ease-in-out",
            cursor: "pointer",
            borderColor: error ? "error.main" : "primary.main",
            color: error ? "error.main" : "primary.main",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          {value ? (
            <Typography>{value.denom}</Typography>
          ) : (
            <Typography>Seleziona fornitore</Typography>
          )}
        </Box>
        {helperText && (
          <Typography variant="caption" sx={{ pl: 1.5, color: error ? "error.main" : "black" }}>
            {helperText}
          </Typography>
        )}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Seleziona un fornitore</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
            <TextField
              inputRef={textfieldRef}
              placeholder="Cerca"
              autoComplete="off"
              size="small"
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
            <CreateClient callback={(params) => console.log(params)} />
          </Stack>
          <TableContainer sx={{ maxWidth: "100%" }} component={Box}>
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
          </TableContainer>
          {list.length === 0 && (
            <Typography sx={{ textAlign: "center", p: 2 }}>
              Nessun fornitore soddisfa i parametri di ricerca
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
