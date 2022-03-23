import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

function getCurrentTime() {
  const date = new Date();
  return date.toLocaleTimeString();
}

export default function Clock(props) {
  const [time, setTime] = useState(getCurrentTime());
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => setTime(getCurrentTime()), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <Typography sx={{ p: 1, textAlign: "center", fontWeight: 600 }}>
      {time}
    </Typography>
  );
}
