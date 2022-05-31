import {
  debounce,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DateInput from "components/base/DateInput";
import { useCallback, useEffect, useState } from "react";
import ProviderSelector from "./subjects/ProviderSelector";

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "600",
  padding: "8px 20px",
}));

const BodyCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 20px",
}));

const textFieldHandleChange = (setState, field) => (e) =>
  setState((old) => {
    const state = { ...old };
    state[field] = e.target.value;
    return state;
  });

const standardInputHandleChange = (setState, field) => (val) =>
  setState((old) => {
    const state = { ...old };
    state[field] = val;
    return state;
  });

function getInputComponent(type) {
  switch (type?.toLowerCase()) {
    case "string":
      return {
        component: TextField,
        props: { size: "small" },
        handleChange: textFieldHandleChange,
      };
    case "number":
      return {
        component: TextField,
        props: { type: "number", size: "small" },
        handleChange: textFieldHandleChange,
      };
    case "date":
      return {
        component: DateInput,
        props: { inputProps: { size: "small" } },
        handleChange: standardInputHandleChange,
      };
    case "provider":
      return {
        component: ProviderSelector,
        props: {},
        handleChange: standardInputHandleChange,
      };
    default:
      return {
        component: TextField,
        props: { size: "small" },
        handleChange: textFieldHandleChange,
      };
  }
}

function getDefaultValue(type) {
  switch (type?.toLowerCase()) {
    case "string":
      return "";
    case "number":
      return "";
    case "date":
      return null;
    case "provider":
      return null;
    default:
      return "";
  }
}

//TODO add endpoint validation (Utils)
export default function TableInput({ container = Paper, fields = [], onChange }) {
  const [state, setState] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sendUpdates = useCallback(
    debounce((val) => {
      let sendable = true;
      for (let { field, required, type } of fields)
        if (required && val[field] === getDefaultValue(type)) {
          sendable = false;
          break;
        }

      onChange?.({ ...val, sendable });
    }),
    [fields]
  );

  useEffect(() => sendUpdates(state), [state, sendUpdates]);

  useEffect(() => {
    const newState = {};
    for (const { field, type } of fields) newState[field] = getDefaultValue(type);

    setState(newState);
  }, [setState, fields]);

  return (
    <TableContainer component={container}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead sx={{ bgcolor: "primary.light" }}>
          <TableRow>
            {fields.map((e) => (
              <HeaderCell key={e.field} sx={{ fontWeight: 600 }}>
                {e.headerName}
              </HeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {Object.keys(state).length !== 0 &&
              fields.map((e) => {
                const { component: Component, props, handleChange } = getInputComponent(e.type);
                return (
                  <BodyCell key={e.field}>
                    <Component
                      {...props}
                      {...e.props}
                      error={e.required && state[e.field] === getDefaultValue(e.type)}
                      helperText={
                        e.required && state[e.field] === getDefaultValue(e.type)
                          ? "Campo necessario"
                          : undefined
                      }
                      placeholder={e.headerName}
                      value={state[e.field]}
                      onChange={handleChange(setState, e.field)}
                      autoComplete="off"
                    />
                  </BodyCell>
                );
              })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
