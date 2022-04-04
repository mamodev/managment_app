import PageLayout from "components/layout/PageLayout";
import Clienti from "pages/clienti/Clienti";
import GruppoFatturazione from "pages/gruppo_fatturazione/GruppoFatturazione";
import Home from "pages/home/Home";
import OdvPro from "pages/odv_pro/OdvPro";
import OdvProDetails from "pages/odv_pro/[id]/details/OdvProDetails";
import OdvProIdLayout from "pages/odv_pro/[id]/OdvProIdLayout";
import OdvProState from "pages/odv_pro/[id]/state/OdvProState";
import { Route, Routes } from "react-router-dom";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Home />} />
        <Route path="odv_pro/*">
          <Route index element={<OdvPro />} />
          <Route path=":id/*" element={<OdvProIdLayout />}>
            <Route path="state" element={<OdvProState />} />
            <Route path="details" element={<OdvProDetails />} />
          </Route>
        </Route>
        <Route path="clienti/*">
          <Route index element={<Clienti />} />
        </Route>

        <Route
          path="gruppo_fatturazione/:id"
          element={<GruppoFatturazione />}
        />
      </Route>
    </Routes>
  );
}
