const { styled, Box } = require("@mui/material");

const DataGridContainer = styled(Box)(({ theme }) => ({
  height: 510,
  maxHeight: "60vh",
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
}));

export default DataGridContainer;
