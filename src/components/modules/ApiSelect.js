import { Search } from "@mui/icons-material";
import {
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
import { debounce } from "config/utils";
import { useAuthContext } from "context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";

function createSearchFilter(filter, fields = [], operator = "or", comparator = "ilike") {
  if (fields.length === 0) return {};

  const format = (str) => `${str}.${comparator}.*${filter}*`;

  const create_string = (param1, param2) => `${operator}(${param1},${param2})`;

  const create_rec = (fields = []) => {
    if (fields.length === 1) return create_string(format(fields[0]), format(fields[0]));
    if (fields.length === 2) return create_string(format(fields[0]), format(fields[1]));
    if (fields.length > 2) {
      const [first, ...newFields] = fields;
      return create_string(format(first), create_rec(newFields));
    }
  };
  console.log(create_rec(fields).replace(operator, ""));
  return { or: create_rec(fields).replace(operator, "") };
}

export default function ApiSelector({
  onSelect: select,
  title,
  endpoint,
  actions,
  fields,
  searchParams,
  placeholder = "Cerca...",
  minHeight = 200,
  maxHeight = 400,
  filters = {},
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(null);
  const [list, setList] = useState([]);

  const { api } = useAuthContext();
  const { key, func } = endpoint(
    api,
    {},
    !!filter && filter !== " "
      ? { ...createSearchFilter(filter, searchParams), ...filters }
      : { ...filters }
  );
  const { data } = useQuery(key, func, { enabled: filter !== null });

  useEffect(() => {
    if (data) setList(data);
  }, [data]);

  const handleQueryChange = (e) => setQuery(e.target.value);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateFilter = useCallback(
    debounce((query) => setFilter(query)),
    [setFilter]
  );

  useEffect(() => updateFilter(query), [updateFilter, query]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        {title && <Box>{title}</Box>}

        <TextField
          value={query}
          sx={{ flex: 1, maxWidth: 800 }}
          onChange={handleQueryChange}
          placeholder={placeholder}
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

      <TableContainer sx={{ maxWidth: "100%", minHeight, maxHeight }} component={Box}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ boxShadow: 1 }}>
              {fields.map((e, i) => (
                <TableCell key={i} sx={{ fontWeight: 700 }}>
                  {e.headerName ? e.headerName : e.field}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row, i) => (
              <TableRow
                hover
                key={i}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  select(row);
                }}
              >
                {fields.map((e, i) => (
                  <TableCell key={i}>{row[e.field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

          {list.length === 0 && (
            <caption>
              <Typography sx={{ textAlign: "center", p: 2 }}>Nessun elemento</Typography>
            </caption>
          )}
        </Table>
      </TableContainer>
    </>
  );
}
