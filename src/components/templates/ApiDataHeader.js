import { LoadingButton } from "@mui/lab";
import { Button, Stack, Table, TableBody, TableContainer } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import NameValueInput from "components/modules/NameValueInput";
import { useConfig } from "context/ConfigContext";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { isValid } from "utils";

export default function ApiDataHeader({
  columns = [],
  onChange: change,
  endpoint = {
    func: (data) => console.log(data),
    revalidate: (data) => console.log(data),
  },
  data: defaultData,
  valueGet = (val) => (val === null ? "" : val),
  valueSet = (val) => (val === "" ? null : val),
  sx,
  fullWidth = false,
  ...props
}) {
  const [data, setData] = useState(null);
  const [edited, setEdited] = useState(false);
  const queryClient = useQueryClient();
  const { fields } = useConfig();
  const { mutate, isLoading } = useMutation(endpoint.func, {
    onSuccess: (data) => {
      endpoint.revalidate(data, queryClient);
      setEdited(false);
    },
    onError: (error) => {
      queryClient.defaultOptions.mutations.onError(error);
      setEdited(false);
      setData(defaultData?.reduce((object, next) => object));
    },
  });

  useEffect(() => {
    if (defaultData?.length > 0) setData(defaultData?.reduce((object, next) => object));
  }, [defaultData]);

  const changeData = (data) => {
    setData(data);
    setEdited(true);
  };

  const cancelHandler = () => {
    setEdited(false);
    if (defaultData?.length > 0) setData(defaultData?.reduce((object, next) => object));
  };

  const sendable = () => {
    for (const column of columns) {
      for (const field of column) {
        const err = field.valueGet
          ? !isValid(field.id, field.valueGet(data[field.id]), fields)
          : !isValid(field.id, valueGet(data[field.id]), fields);
        if (err) return true;
      }
    }
    return false;
  };

  return (
    <Stack
      {...props}
      direction="row"
      alignItems="start"
      justifyContent="space-between"
      sx={{
        width: fullWidth ? "100%" : "fit-content",
        border: 2,
        borderColor: grey[400],
        py: 2,
        px: 1,
        borderRadius: 4,
        position: "relative",
        ...sx,
      }}
    >
      {edited && (
        <Stack direction="row" spacing={1} sx={{ position: "absolute", bottom: -35, right: 10 }}>
          <LoadingButton
            loading={isLoading}
            disabled={sendable()}
            size="small"
            variant="contained"
            onClick={() => change(data, mutate)}
          >
            Salva
          </LoadingButton>
          <Button size="small" variant="contained" color="error" onClick={cancelHandler}>
            Annulla
          </Button>
        </Stack>
      )}
      {data &&
        columns.map((e, i) => (
          <TableContainer component={Box} sx={{ overflow: "hidden" }}>
            <Table>
              <TableBody>
                {e?.map((e, i) => (
                  <NameValueInput
                    multiline={e.multiline}
                    inputComponent={e.component}
                    name={e.nameid ? data[e.nameid] : e.name}
                    onChange={(val) =>
                      changeData((old) => {
                        const newData = { ...old };
                        newData[e.id] = e.valueSet ? e.valueSet(val) : valueSet(val);
                        return newData;
                      })
                    }
                    value={e.valueGet ? e.valueGet(data[e.id]) : valueGet(data[e.id])}
                    editable={e.editable}
                    error={
                      e.valueGet
                        ? !isValid(e.id, e.valueGet(data[e.id]), fields)
                        : !isValid(e.id, valueGet(data[e.id]), fields)
                    }
                    key={i}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
    </Stack>
  );
}
