import PageLayout from "components/layout/PageLayout";
import PageLoader from "components/layout/PageLoader";
import ClientSelector from "components/modules/ClientSelector";
import ConfermaEmissioneODA from "pages/emissioneODA/conferma/ConfermaEmissioneODA";
import EmissioneODA from "pages/emissioneODA/EmissioneODA";
import React from "react";
import { Route, Routes } from "react-router-dom";

const Clienti = React.lazy(() => import("pages/clienti/Clienti"));
const ClientDetails = React.lazy(() => import("pages/clienti/[id]/ClientDetails"));
const Providers = React.lazy(() => import("pages/fornitori/Providers"));
const GruppoConsegna = React.lazy(() => import("pages/gruppo_consegna/GruppoConsegna"));
const GruppoFatturazione = React.lazy(() => import("pages/gruppo_fatturazione/GruppoFatturazione"));
const Home = React.lazy(() => import("pages/home/Home"));
const OdvPro = React.lazy(() => import("pages/odv_pro/OdvPro"));
const OdvProDetails = React.lazy(() => import("pages/odv_pro/[id]/details/OdvProDetails"));
const OdvProIdLayout = React.lazy(() => import("pages/odv_pro/[id]/OdvProIdLayout"));
const OdvProState = React.lazy(() => import("pages/odv_pro/[id]/state/OdvProState"));

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route
          index
          element={
            <PageLoader>
              <Home />
            </PageLoader>
          }
        />
        <Route path="odv_pro/*">
          <Route
            index
            element={
              <PageLoader>
                <OdvPro />
              </PageLoader>
            }
          />
          <Route
            path=":id/*"
            element={
              <PageLoader>
                <OdvProIdLayout />
              </PageLoader>
            }
          >
            <Route
              path="state"
              element={
                <PageLoader>
                  <OdvProState />
                </PageLoader>
              }
            />
            <Route
              path="details"
              element={
                <PageLoader>
                  <OdvProDetails />
                </PageLoader>
              }
            />
          </Route>
        </Route>
        <Route path="clienti/*">
          <Route
            index
            element={
              <PageLoader>
                <Clienti />
              </PageLoader>
            }
          />

          <Route
            path=":id"
            element={
              <PageLoader>
                <ClientDetails />
              </PageLoader>
            }
          />
        </Route>
        <Route path="fornitori/*">
          <Route
            index
            element={
              <PageLoader>
                <Providers />
              </PageLoader>
            }
          />
          <Route
            path=":id"
            element={
              <PageLoader>
                <ClientDetails />
              </PageLoader>
            }
          />
        </Route>

        <Route
          path="gruppo_fatturazione/:id"
          element={
            <PageLoader>
              <GruppoFatturazione />
            </PageLoader>
          }
        />
        <Route
          path="gruppo_consegna/:id"
          element={
            <PageLoader>
              <GruppoConsegna />
            </PageLoader>
          }
        />
        <Route
          path="emissione_oda/:id"
          element={
            <PageLoader>
              <EmissioneODA />
            </PageLoader>
          }
        />
        <Route
          path="emissione_oda/:id/conferma"
          element={
            <PageLoader>
              <ConfermaEmissioneODA />
            </PageLoader>
          }
        />
      </Route>
    </Routes>
  );
}
