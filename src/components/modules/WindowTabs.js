import { Close } from "@mui/icons-material";
import { Grid, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useWindowManagerContext } from "context/WindowManagerContext";
import { useMemo } from "react";

export default function WindowTabs() {
  const { windows } = useWindowManagerContext();
  const windowTabs = useMemo(() => {
    const arr = [];
    for (const key in windows)
      arr.push({
        id: key,
        window: windows[key],
      });
    return arr;
  }, [windows]);

  return (
    <Grid
      container
      spacing={2}
      justifyContent="flex-start"
      ml={2}
      sx={{ maxWidth: "85%", flexWrap: "nowrap" }}
      columns={windowTabs.length}
    >
      {windowTabs.map((e) => {
        return (
          <Grid item key={e.id} sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                position: "relative",
                "&::after": {
                  content: '""',
                  width: "0px",
                  height: 2,
                  backgroundColor: "white",
                  position: "absolute",
                  bottom: -2,
                  left: 0,
                  transition: ".2s ease-in-out",
                },
                "&:hover::after": {
                  width: "calc(100% - 25px)",
                },
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  whiteSpace: "nowrap",
                  overflowX: "hidden",
                }}
                onClick={() => window.open("", e.id)}
              >
                <Typography>{e.id}</Typography>
              </Box>
              <IconButton
                size="small"
                color="inherit"
                onClick={() => e.window.close()}
              >
                <Close sx={{ fontSize: 15 }} />
              </IconButton>
            </Stack>
          </Grid>
        );
      })}
    </Grid>
  );
}
