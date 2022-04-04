import { Button, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import NameValueInput from "components/modules/NameValueInput";
import { useEffect, useState } from "react";

export default function ApiDataHeader({
  columns = [],
  data: defaultData,
  sx,
  ...props
}) {
  const [data, setData] = useState(null);
  const [edited, setEdited] = useState(false);
  useEffect(() => {
    if (defaultData?.length > 0)
      setData(defaultData?.reduce((object, next) => object));
  }, [defaultData]);

  const changeData = (data) => {
    setData(data);
    setEdited(true);
  };

  const cancelHandler = () => {
    setEdited(false);
    if (defaultData?.length > 0)
      setData(defaultData?.reduce((object, next) => object));
  };
  return (
    <Stack
      {...props}
      direction="row"
      alignItems="start"
      justifyContent="space-between"
      sx={{
        ...sx,
        border: 2,
        borderColor: grey[400],
        py: 2,
        px: 5,
        borderRadius: 4,
        position: "relative",
      }}
    >
      {edited && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ position: "absolute", bottom: 10, right: 10 }}
        >
          <Button size="small" variant="contained">
            Salva
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={cancelHandler}
          >
            Annulla
          </Button>
        </Stack>
      )}
      {data &&
        columns.map((e, i) => (
          <Stack key={i}>
            {e?.map((e, i) => (
              <NameValueInput
                inputComponent={e.component}
                name={e.nameid ? data[e.nameid] : e.name}
                onChange={(val) =>
                  changeData((old) => {
                    const newData = { ...old };
                    newData[e.id] = val;
                    return newData;
                  })
                }
                value={
                  e.valueFormatter ? e.valueFormatter(data[e.id]) : data[e.id]
                }
                editable={e.editable}
                key={i}
              />
            ))}
          </Stack>
        ))}
    </Stack>
  );
}
