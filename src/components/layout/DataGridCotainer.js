import { blue, green, grey, red, yellow } from "@mui/material/colors";

const { styled, Box } = require("@mui/material");

const DataGridContainer = styled(Box)(({ theme, height }) => ({
  height: height,
  backgroundColor: theme.palette.common.white,
  position: "relative",
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
    backgroundColor: theme.palette.primary.light,
  },
  "& .super-app-theme--warning .MuiDataGrid-cell": {
    backgroundColor: yellow[200],
  },
  "& .super-app-theme--warning .MuiDataGrid-cell--editable": {
    backgroundColor: yellow[100],
  },

  "& .super-app-theme--hide .MuiDataGrid-booleanCell[data-value='false']": {
    backgroundColor: grey[100],
    color: grey[100],
  },

  "& .super-app-theme--group.MuiDataGrid-cell": {
    backgroundColor: theme.palette.primary.light,
    display: "block",
    padding: 0,
  },

  "& .super-app-theme--group.MuiDataGrid-cell--editable": {
    backgroundColor: theme.palette.primary.light,
  },

  "& .super-app-theme--success .MuiDataGrid-cell": {
    backgroundColor: green[200],
  },
  "& .super-app-theme--success .MuiDataGrid-cell--editable": {
    backgroundColor: green[100],
  },
  "& .super-app-theme--error .MuiDataGrid-cell": {
    backgroundColor: red[200],
  },
  "& .super-app-theme--error .MuiDataGrid-cell--editable": {
    backgroundColor: red[100],
  },
  "& .super-app-theme--foreground-error .MuiDataGrid-cell": {
    color: red[300],
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

  "& .super-app-theme--actions .MuiDataGrid-actionsCell": { gridGap: 0 },
}));

export default DataGridContainer;
