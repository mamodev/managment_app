import PageLayout from "components/layout/PageLayout";
import Home from "pages/home/Home";
import OdvPro from "pages/odv_pro/OdvPro";
import { Route, Routes } from "react-router-dom";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Home />} />
        <Route path="/odv_pro" element={<OdvPro />} />
      </Route>
    </Routes>
  );
}
