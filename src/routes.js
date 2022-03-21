import PageLayout from "components/layout/PageLayout";
import Home from "pages/home/Home";
import { Route, Routes } from "react-router-dom";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}
