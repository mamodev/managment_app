const { Typography, Stack, Box } = require("@mui/material");
const { grey } = require("@mui/material/colors");
const { useState } = require("react");
const { MinusSquare, PlusSquare } = require("./Icons");

export default function Accordition({ name, children }) {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ borderBottom: 1, borderColor: grey[300] }}>
      <Stack
        direction="row"
        alignItems="center"
        px={2}
        spacing={1}
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen((open) => !open)}
      >
        {open ? <MinusSquare /> : <PlusSquare />}
        <Typography sx={{ fontSize: 15 }}>{name}</Typography>
      </Stack>

      {open && children}
    </Box>
  );
}
