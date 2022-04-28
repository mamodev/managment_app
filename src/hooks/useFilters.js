import { Button, Stack } from "@mui/material";
import { useState } from "react";

export default function useFilters(filters = []) {
  const [state, setState] = useState(filters.map((e) => e.defaultValue));
  const [query, setQuery] = useState({});

  const sendQuery = () => {
    setQuery((old) => {
      const newQuery = {};
      for (let i = 0; i < filters.length; ++i) {
        if (filters[i].defaultValue !== state[i]) {
          if (newQuery[filters[i].name] !== undefined) {
            if (Array.isArray(newQuery[filters[i].name]))
              newQuery[filters[i].name] = [
                ...newQuery[filters[i].name],
                filters[i].filterRender(state[i]),
              ];
            else
              newQuery[filters[i].name] = [
                newQuery[filters[i].name],
                filters[i].filterRender(state[i]),
              ];
          } else newQuery[filters[i].name] = filters[i].filterRender(state[i]);
        }
        newQuery.queryCount =
          old.queryCount !== undefined ? old.queryCount + 1 : 0;
      }
      return newQuery;
    });
  };
  const resetFilters = () => {
    setState(filters.map((e) => e.defaultValue));
  };

  const FilterOutlet = (
    <Stack
      onKeyUp={({ code }) => code === "Enter" && sendQuery()}
      direction="row"
      alignItems="center"
      sx={{ flexWrap: "wrap", rowGap: 2, gap: 2 }}
    >
      {filters.map((filter, i) => {
        return (
          <filter.component
            {...filter.componentProps}
            key={i}
            value={state[i]}
            onChange={(val) =>
              setState((old) => {
                const state = [...old];
                state[i] = val;
                return state;
              })
            }
          />
        );
      })}

      <Button
        variant="contained"
        onClick={sendQuery}
        sx={{ height: "fit-content" }}
      >
        Lista
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={resetFilters}
        sx={{ height: "fit-content" }}
      >
        Reset
      </Button>
    </Stack>
  );

  return { FilterOutlet, query };
}
