import React from "react";
import { Home } from "@mui/icons-material";
const Clienti = React.lazy(() => import("pages/clienti/Clienti"));
const ClientDetails = React.lazy(() => import("pages/clienti/[id]/ClientDetails"));
const Providers = React.lazy(() => import("pages/fornitori/Providers"));
const GruppoConsegna = React.lazy(() => import("pages/gruppo_consegna/GruppoConsegna"));
const GruppoFatturazione = React.lazy(() => import("pages/gruppo_fatturazione/GruppoFatturazione"));
const OdvPro = React.lazy(() => import("pages/odv_pro/OdvPro"));
const OdvProDetails = React.lazy(() => import("pages/odv_pro/[id]/details/OdvProDetails"));
const OdvProIdLayout = React.lazy(() => import("pages/odv_pro/[id]/OdvProIdLayout"));
const OdvProState = React.lazy(() => import("pages/odv_pro/[id]/state/OdvProState"));

//size = [x, y] = [width, height]
const PAGES = {
  HOME: {
    label: "Home",
    icon: Home,
    route: "/",
    component: React.lazy(() => import("pages/home/Home")),
    minSize: [null, null],
    maxSize: [null, null],
    defaultSize: [800, 1000],
    resizable: true,
  },
};

export { PAGES };
