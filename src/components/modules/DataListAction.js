import { IconButton } from "@mui/material";

export default function DataListAction({ icon, loading, func, ...props }) {
  console.log(icon);
  return <IconButton>{icon}</IconButton>;
}
