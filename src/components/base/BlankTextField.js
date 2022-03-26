import { styled, TextField } from "@mui/material";

const BlankTextField = styled(TextField)({
  "& .MuiInput-input": {
    "&.Mui-disabled": {
      color: "black",
      WebkitTextFillColor: "black",
    },
    padding: 0,
  },
  "& .MuiInput-root.Mui-disabled:before": {
    border: "none",
  },
  "& .MuiInput-root": {
    "&:before": {
      border: "none",
    },
  },
});

export default BlankTextField;
