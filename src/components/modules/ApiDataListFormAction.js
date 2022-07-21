import { Add } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import ApiDataForm from "components/templates/OldApiDataForm";
import { useState } from "react";

export default function ApiDataListFormAction({
  Icon = Add,
  tooltip = "azione",
  endpoint,
  fields = [],
  ...props
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title={tooltip} arrow>
        <Icon onClick={() => setOpen(true)} />
      </Tooltip>
      {open && (
        <ApiDataForm
          fields={fields}
          endpoint={endpoint}
          open={open}
          onClose={() => setOpen(false)}
          {...props}
        />
      )}
    </>
  );
}
//
