import { blue, grey, purple } from "@mui/material/colors";

const { styled, Box } = require("@mui/material");

const DataGridContainer = styled(Box)(({ theme }) => ({
  "& .super-app-theme--link": {
    "&:hover": {
      fontSize: 16,
    },
    position: "relative",
    transition: ".2s ease-in-out",
    cursor: "pointer",
    color: theme.palette.primary.main,
    textDecoration: "underline",
  },

  "& input[aria-invalid='true']": {
    color: theme.palette.error.main,
  },
  "& .super-app-theme--project .MuiDataGrid-cell": {
    backgroundColor: purple[100],
  },
  "& .super-app-theme--select .MuiDataGrid-cell": {
    backgroundColor: "transparent",
  },

  "& .super-app-theme--select": {
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: blue[100],
    },

    transition: ".2s ease-in-out",
    cursor: "pointer",
  },

  "& .MuiDataGrid-cell ": {
    backgroundColor: grey[100],
    overflow: "visible",
  },

  "& .MuiDataGrid-cell.MuiDataGrid-cell--editing": {
    overflow: "visible",
  },

  "& .MuiDataGrid-cell--editable": {
    backgroundColor: "white",
  },
}));

export default DataGridContainer;
