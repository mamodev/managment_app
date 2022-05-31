import { Animation } from "@devexpress/dx-react-chart";
import { Chart, Legend, PieSeries } from "@devexpress/dx-react-chart-material-ui";

import { Add, ArrowForward, Delete } from "@mui/icons-material";
import {
  Button,
  debounce,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { green, grey, yellow } from "@mui/material/colors";
import { Box } from "@mui/system";
import ObjectTable from "components/templates/ObjectTable";
import { useCallback, useEffect, useRef, useState } from "react";

function MyChart({ list = [], width = 250 }) {
  const data = list.map((e) => ({ argument: e.ubic, value: e.colli }));

  return (
    <Chart data={data} width={width} height="fit-content">
      <Legend />
      <Animation />
      <PieSeries innerRadius={0.5} valueField="value" argumentField="argument" />
    </Chart>
  );
}

export default function Location({ ubicazioni, riferimento, colli_arrivati, onChange: change }) {
  const [list, setList] = useState(null);
  const [subtotal, setSubtotal] = useState(0);

  const firstTimeRef = useRef(true);
  useEffect(() => {
    if (list) {
      if (!firstTimeRef.current) {
        change({ in_ubicaz: list });
      } else {
        firstTimeRef.current = false;
      }
    }
  }, [list]);

  useEffect(() => {
    firstTimeRef.current = true;
    if (Array.isArray(ubicazioni)) setList(ubicazioni);
  }, [ubicazioni]);

  const changeUbic = useCallback(
    (index, ubic) =>
      setList((old) => {
        const newList = [...old];
        newList[index].ubic = ubic;
        return newList;
      }),
    [setList]
  );

  const changeColli = useCallback(
    (index, colli) =>
      setList((old) => {
        const newList = [...old];
        newList[index].colli = Number(colli);
        return newList;
      }),
    [setList]
  );

  const calculate_subTotal = useCallback(
    debounce((list, setSubtotal) =>
      setSubtotal(
        list && list.length > 0 ? list.map((e) => Number(e.colli)).reduce((p, n) => p + n) : 0
      )
    ),
    []
  );

  useEffect(() => calculate_subTotal(list, setSubtotal), [list, calculate_subTotal]);

  return (
    <Paper sx={{ bgcolor: "white" }}>
      <ObjectTable
        component={({ children }) => <Box sx={{ borderRadius: 2 }}>{children}</Box>}
        object={{
          "Nr ODA": "Manca",
          Riferimento: riferimento,
          "Colli arrivati": colli_arrivati,
          "Colli ubicati": {
            val: subtotal,
            props: {
              sx: {
                color:
                  subtotal > colli_arrivati
                    ? "red"
                    : subtotal === colli_arrivati
                    ? green[700]
                    : yellow[900],
              },
            },
          },
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="center" spacing={"7%"}>
        {list && (
          <List sx={{ mt: 1, width: "fit-content" }}>
            {Array.isArray(list) &&
              list.map((e, i) => (
                <ListItem
                  sx={{
                    border: 1,
                    bgcolor: "common.white",
                    borderColor: grey[300],
                    borderRadius: 2.5,
                    my: 1,
                  }}
                  key={i}
                  secondaryAction={
                    <IconButton
                      color="error"
                      onClick={() => setList((old) => old.filter((e, index) => i !== index))}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <ArrowForward />
                  </ListItemIcon>
                  <Stack direction="row" spacing={2} mr={3}>
                    <TextField
                      variant="standard"
                      error={e.ubic === ""}
                      value={e.ubic}
                      onChange={(e) => changeUbic(i, e.target.value)}
                      size="small"
                      placeholder="Ubicazione"
                    />
                    <TextField
                      variant="standard"
                      value={e.colli}
                      type="number"
                      size="small"
                      placeholder="Colli"
                      onChange={(e) => changeColli(i, e.target.value)}
                    />
                  </Stack>
                </ListItem>
              ))}

            {list && Array.isArray(list) && list.length > 0 && (
              <Button
                sx={{ width: "fit-content" }}
                startIcon={<Add />}
                onClick={() => setList((old) => [...old, { ubic: "", colli: 0 }])}
              >
                Aggiungi...
              </Button>
            )}
          </List>
        )}

        {list && Array.isArray(list) && list.length > 0 && (
          <Box pb={3}>
            <MyChart list={list ? list : []} />
          </Box>
        )}
      </Stack>

      <Stack justifyContent="center" alignItems="center" direction="row">
        {(!list || (list && list?.length === 0)) && (
          <Box p={2}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setList((old) => [{ ubic: "", colli: 0 }])}
            >
              Aggiungi ubicazione
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
