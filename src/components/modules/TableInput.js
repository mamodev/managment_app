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
  Typography,
} from "@mui/material";
import DateInput from "components/base/DateInput";
import { formatDate, reverseDate } from "config/utils";
import { useCallback, useEffect, useState } from "react";
import ClientSelector from "./subjects/ClientSelector";
import ProviderSelector from "./subjects/ProviderSelector";
import SubjectSelector from "./subjects/SubjectSelector";

const preprocess = (data, { type }) => {
  switch (type) {
    case "subject":
    case "provider":
    case "client":
      return data.denom;
    case "date":
      if (data) return reverseDate(formatDate(data), "/");
      else return "Nessun valore";
    case "string":
    case "number":
      return data;
    default:
      return JSON.stringify(data);
  }
};

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
    case "client":
      return {
        component: ClientSelector,
        props: {},
        handleChange: standardInputHandleChange,
      };
    case "subject":
      return {
        component: SubjectSelector,
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
export default function TableInput({
  container = Paper,
  fields = [],
  onChange,
  initialState = {},
}) {
  const [state, setState] = useState(initialState);

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
    if (Object.keys(initialState).length !== 0) return;

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
                      value={state[e.field] ? state[e.field] : getDefaultValue(e.type)}
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

//TODO add endpoint validation (Utils)
export function VerticalInputTable({
  container = Paper,
  fields = [],
  onChange,
  initialState = {},
}) {
  const [state, setState] = useState(initialState);

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

  useEffect(() => setState(initialState), [initialState, fields]);

  useEffect(() => sendUpdates(state), [state, sendUpdates]);

  useEffect(() => {
    if (Object.keys(initialState).length !== 0) {
      return;
    }

    const newState = {};
    for (const { field, type } of fields) newState[field] = getDefaultValue(type);

    setState(newState);
  }, [setState, fields]);

  return (
    <TableContainer component={container}>
      <Table>
        <TableBody>
          {Object.keys(state).length !== 0 &&
            fields.map((e) => {
              const { component: Component, props, handleChange } = getInputComponent(e.type);

              return (
                <TableRow key={e.field}>
                  <HeaderCell sx={{ fontWeight: 600, backgroundColor: "primary.light" }}>
                    {e.headerName}
                  </HeaderCell>
                  <BodyCell>
                    {e.editable !== undefined && e.editable === false ? (
                      <Typography>
                        {state[e.field] ? preprocess(state[e.field], e) : "Nessun valore"}
                      </Typography>
                    ) : (
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
                        value={state[e.field] ? state[e.field] : getDefaultValue(e.type)}
                        onChange={handleChange(setState, e.field)}
                        autoComplete="off"
                      />
                    )}
                  </BodyCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
