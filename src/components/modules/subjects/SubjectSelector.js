import { Colorize, Search } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { debounce } from "config/utils";
import { useAuthContext } from "context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";

const boxStyle = (error) => ({
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
});

export default function SubjectSelector({
  value,
  onChange: setValue,
  error = false,
  helperText,
  title = "Seleziona un soggetto",
  buttonText = "Seleziona soggetto",
  endpoint = endpoints.SUBJECTS,
  actions = [],
}) {
  const [open, setOpen] = useState(false);

  return (
    <Stack spacing={0.5}>
      <Box onClick={() => setOpen(true)} sx={boxStyle(error)}>
        {value ? (
          <Typography>{value.denom}</Typography>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>{buttonText}</Typography>
            <Colorize />
          </Stack>
        )}
      </Box>

      {helperText && (
        <Typography variant="caption" sx={{ pl: 1.5, color: error ? "error.main" : "black" }}>
          {helperText}
        </Typography>
      )}

      {open && (
        <SubjectSelectorDialog
          open={open}
          onClose={() => setOpen(false)}
          setValue={setValue}
          title={title}
          endpoint={endpoint}
          actions={actions}
        />
      )}
    </Stack>
  );
}

function SubjectSelectorDialog({ open, onClose: close, setValue, title, endpoint, actions }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(null);
  const [list, setList] = useState([]);

  const { api } = useAuthContext();
  const { key, func } = endpoint(
    api,
    {},
    !!filter && filter !== " " ? { estremi: `ilike.*${filter}*` } : {}
  );
  const { data } = useQuery(key, func, { enabled: filter !== null });

  useEffect(() => {
    if (data) setList(data);
  }, [data]);

  const handleQueryChange = (e) => setQuery(e.target.value);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateFilter = useCallback(
    debounce((query) => setFilter(query)),
    []
  );

  useEffect(() => updateFilter(query), [updateFilter, query]);

  return (
    <Dialog open={!!open} onClose={close} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: "primary.main", fontWeight: 500, color: "common.white" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {title}
          <TextField
            value={query}
            sx={{ flex: 1, maxWidth: 800 }}
            onChange={handleQueryChange}
            placeholder="Cerca..."
            autoComplete="off"
            size="small"
            InputProps={{
              sx: { bgcolor: "common.white" },
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          {actions}
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <TableContainer sx={{ maxWidth: "100%", minHeight: 500 }} component={Box}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ boxShadow: 1 }}>
                {["Nome", "Indirizzo", "Contatti", "Codice fiscale", "Comune"].map((e, i) => (
                  <TableCell key={i} sx={{ fontWeight: 700 }}>
                    {e}
                  </TableCell>
                ))}
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
                    close();
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

            {list.length === 0 && (
              <caption>
                <Typography sx={{ textAlign: "center", p: 2 }}>
                  Nessun soggetto soddisfa i parametri di ricerca
                </Typography>
              </caption>
            )}
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={close}>
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
