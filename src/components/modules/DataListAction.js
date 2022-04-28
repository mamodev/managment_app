import { IconButton } from "@mui/material";

export default function DataListAction({ icon, loading, func, ...props }) {
  return <IconButton>{icon}</IconButton>;
}
