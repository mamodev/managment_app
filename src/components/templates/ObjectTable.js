import styled from "@emotion/styled";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "600",
  padding: "8px 20px",
}));

const BodyCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 20px",
}));

const MultilineBodyCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 20px",
  border: 0,
}));

function convertArray(arr = []) {
  const final_res = [];
  let endedValues = false;

  while (!endedValues) {
    const temp = [];
    let found = false;
    for (const a of arr)
      if (a.length > 0) {
        temp.push(a.shift());
        found = true;
      } else temp.push("");

    if (found) final_res.push(temp);
    else endedValues = true;
  }

  return final_res;
}
export default function ObjectTable({ object, component = Paper, RowCell = BodyCell }) {
  const [values, setValues] = useState([]);

  const headers = Object.keys(object).map((e) => ({ val: e, props: object[e]?.props }));

  useEffect(
    () =>
      setValues(
        convertArray(
          Object.values(object).map((e) =>
            e?.val !== undefined ? (Array.isArray(e.val) ? e.val : [e.val]) : [e]
          )
        )
      ),
    [object]
  );

  return (
    <TableContainer component={component}>
      <Table>
        <TableHead sx={{ bgcolor: "primary.light" }}>
          <TableRow>
            {headers.map((e, i) => (
              <HeaderCell key={i}>{e.val}</HeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((e, i) => (
            <TableRow key={i}>
              {e.map((e, i) =>
                values.length > 1 ? (
                  <MultilineBodyCell key={i} {...headers[i]?.props}>
                    {e}
                  </MultilineBodyCell>
                ) : (
                  <RowCell key={i} {...headers[i]?.props}>
                    {e}
                  </RowCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
