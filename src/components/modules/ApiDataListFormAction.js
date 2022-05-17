import { Add } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import ApiDataForm from "components/templates/ApiDataForm";
import { useState } from "react";

export default function ApiDataListFormAction({
  Icon = Add,
  tooltip = "azione",
  endpoint,
  ...props
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title={tooltip} arrow>
        <Icon onClick={() => setOpen(true)} />
      </Tooltip>
      <ApiDataForm
        fields={[]}
        endpoint={endpoint}
        open={open}
        onClose={() => setOpen(false)}
        {...props}
      />
    </>
  );
}
//
