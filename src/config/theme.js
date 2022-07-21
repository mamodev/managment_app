const { createTheme } = require("@mui/material");

const defaultTheme = createTheme({});

const theme = createTheme({
  ...defaultTheme,
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1300,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      ...defaultTheme.palette.primary,
      light: "#E6F4F1",
    },
    white: {
      main: "white",
      contrastText: "#1976d2",
    },
  },
});

export default theme;
