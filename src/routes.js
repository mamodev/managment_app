import React from "react";
import PageLayout from "components/layout/PageLayout";
import PageLoader from "components/layout/PageLoader";
import { Route, Routes } from "react-router-dom";

//TODO add lazy loading to this imports
import ConfermaEmissioneODA from "pages/emissioneODA/conferma/ConfermaEmissioneODA";
import EmissioneODA from "pages/emissioneODA/EmissioneODA";
import Documenti from "pages/documenti/Documenti";
import RegistrazioneArrivi from "pages/registrazione_arrivi/RegistrazioneArrivi";
import RegistrazioneUbicazioni from "pages/registrazione_ubicazioni/RegistrazioneUbicazioni";
import Giacenze from "pages/giacenze/Giacenze";
import Movimenti from "pages/movimenti/Movimenti";
import Ubicazione from "pages/ubicazione/Ubicazione";
import PianifSped from "pages/pianif_sped/PianifSped";
import MovimentoCreate from "pages/movimenti/[id]/MovimentoCreate";
import MovimentoEdit from "pages/movimenti/[id]/MovimentoEdit";
import Articoli from "pages/articoli/Articoli";

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

        <Route
          path="articoli"
          element={
            <PageLoader>
              <Articoli />
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

        {/*OPTIMIZE potrebbe andare tutto sotto url /magazzino/...*/}
        <Route
          path="giacenze"
          element={
            <PageLoader>
              <Giacenze />
            </PageLoader>
          }
        />

        <Route path="movimenti/*">
          <Route
            index
            element={
              <PageLoader>
                <Movimenti />
              </PageLoader>
            }
          />
          <Route
            path="create"
            element={
              <PageLoader>
                <MovimentoCreate />
              </PageLoader>
            }
          />
          <Route
            path=":id"
            element={
              <PageLoader>
                <MovimentoEdit />
              </PageLoader>
            }
          />
        </Route>
        <Route
          path="registrazione_arrivi"
          element={
            <PageLoader>
              <RegistrazioneArrivi />
            </PageLoader>
          }
        />
        <Route
          path="registrazione_arrivi"
          element={
            <PageLoader>
              <RegistrazioneArrivi />
            </PageLoader>
          }
        />
        <Route
          path="registrazione_ubicazioni/:id"
          element={
            <PageLoader>
              <RegistrazioneUbicazioni />
            </PageLoader>
          }
        />
        <Route path="documenti/*">
          <Route
            index
            element={
              <PageLoader>
                <Documenti />
              </PageLoader>
            }
          />
        </Route>
        <Route path="ubicazione/:id">
          <Route
            index
            element={
              <PageLoader>
                <Ubicazione />
              </PageLoader>
            }
          />
        </Route>
        <Route path="pianif_sped/:id">
          <Route
            index
            element={
              <PageLoader>
                <PianifSped />
              </PageLoader>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
