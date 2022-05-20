import { blue, green, grey, purple, yellow } from "@mui/material/colors";

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
  "& .super-app-theme--warning .MuiDataGrid-cell": {
    backgroundColor: yellow[200],
  },
  "& .super-app-theme--warning .MuiDataGrid-cell--editable": {
    backgroundColor: yellow[100],
  },

  "& .super-app-theme--success .MuiDataGrid-cell": {
    backgroundColor: green[200],
  },
  "& .super-app-theme--success .MuiDataGrid-cell--editable": {
    backgroundColor: green[100],
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

  "& .super-app-theme--errorText": {
    color: theme.palette.error.main,
    fontWeight: "600",
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
