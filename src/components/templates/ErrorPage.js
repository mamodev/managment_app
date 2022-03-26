import { Stack, Typography } from "@mui/material";

export default function ErrorPage({ title, text }) {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ position: "absolute", height: "100%", width: "100%" }}
    >
      <Stack>
        <Typography variant="h3">{title}</Typography>
        <Typography variant="h6">{text}</Typography>
      </Stack>
    </Stack>
  );
}
