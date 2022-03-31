import { TextField } from "@mui/material";
import React from "react";

function TextFilter({ value, onChange: setValue, placeholder, ...props }) {
  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      label={placeholder}
    />
  );
}

export default TextFilter;
