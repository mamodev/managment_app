import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function PageLayout({children}) {
    return (<Box>
        <Outlet/>
    </Box>)
}