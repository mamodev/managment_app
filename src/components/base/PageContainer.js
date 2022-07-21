import { Box } from "@mui/material";

export default function PageContainer({ children }) {
  return (
    <Box p={4} spacing={2}>
      {children}
    </Box>
  );
}
