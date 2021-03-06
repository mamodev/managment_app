import { LoadingButton } from "@mui/lab";
import { Grid, Stack } from "@mui/material";
import { useConfig } from "context/ConfigContext";
import { isValid } from "date-fns";
import { useEffect, useState } from "react";

export default function Form({
  bypassValidation = false,
  loading,
  fields = [],
  send = () => {},
  sendText = "Invia",
  actions = [],
}) {
  const { fields: validationFields } = useConfig();
  const isValidField = (id, val) => {
    if (bypassValidation) return false;
    const decodedID = id.includes("in_") ? id.split("in_")[1] : id;
    return !isValid(decodedID, val, validationFields);
  };
  const [values, setValues] = useState(fields.map((e) => e.defaultValue));

  const isSendable = () => {
    let sendable = true;
    fields
      .map((e, i) => ({ ...e, i: i }))
      .filter((e) => {
        if (!e.conditionallyRendered) return true;

        const { id, value } = e.conditionallyRendered;

        const fieldIndex = fields.indexOf(fields.find((e) => e.id === id));

        return values[fieldIndex] === value;
      })
      .forEach((e, i) => {
        if (!e.include && e.required && values[e.i] === e.defaultValue) {
          sendable = false;
        }
      });
    return sendable;
  };

  useEffect(() => setValues(fields.map((e) => e.defaultValue)), [fields]);

  return (
    <Stack spacing={4}>
      <Grid container rowSpacing={2} columnSpacing={5}>
        {fields
          .map((e, i) => ({ ...e, i: i }))
          .filter((e) => {
            if (!e.conditionallyRendered) return true;

            const { id, value } = e.conditionallyRendered;

            const fieldIndex = fields.indexOf(fields.find((e) => e.id === id));

            if (fieldIndex === -1) return true;
            else if (fields[fieldIndex].valueGet) {
              if (Array.isArray(value)) {
                for (const v of value) {
                  if (fields[fieldIndex].valueGet(values[fieldIndex]) === v) return true;
                }
                return false;
              }
              return fields[fieldIndex].valueGet(values[fieldIndex]) === value;
            } else return values[fieldIndex] === value;
          })
          .map((e, i) => {
            return (
              <Grid item key={i} xs={e.xs ? e.xs : 12}>
                <e.Component
                  error={!e.valueGet && isValidField(e.id, values[e.i])}
                  required={!!e.required}
                  helperText={
                    e.required && values[e.i] === e.defaultValue
                      ? "Questo campo ?? obbligatorio"
                      : !e.valueGet && isValidField(e.id, values[e.i])
                      ? "Formato invalido"
                      : null
                  }
                  onChange={(val) =>
                    setValues((old) => {
                      const newState = [...old];
                      newState[e.i] = val;
                      return newState;
                    })
                  }
                  value={values[e.i]}
                  {...e.componentProps}
                />
              </Grid>
            );
          })}
      </Grid>
      <Stack direction="row" spacing={2} justifyContent="end">
        <LoadingButton
          loading={loading}
          disabled={!isSendable()}
          variant="contained"
          onClick={() => {
            let data = {};
            const filteredFields = fields
              .map((e, i) => ({
                id: e.id,
                include: e.include,
                value: e.valueGet ? e.valueGet(values[i]) : values[i] === "" ? null : values[i],
              }))
              .filter((e) => e.include === undefined);

            for (let f of filteredFields) data[f.id] = f.value;

            send(data);
          }}
        >
          {sendText}
        </LoadingButton>
        {actions}
      </Stack>
    </Stack>
  );
}
