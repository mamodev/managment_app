import { Typography } from "@mui/material";

export default function Title({ children, ...props }) {
  return <Typography variant="h4" {...props}>{children}</Typography>;
}
