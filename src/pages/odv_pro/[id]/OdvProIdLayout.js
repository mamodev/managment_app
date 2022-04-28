import { Button, Stack, Typography } from "@mui/material";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiDataHeader from "components/templates/ApiDataHeader";
import { useWindowManagerContext } from "context/WindowManagerContext";
import {
  Outlet,
  useMatch,
  useNavigate,
  useParams,
  useResolvedPath,
  useSearchParams,
} from "react-router-dom";
import { odv_pro_id_header_columns } from "./header";

export default function OdvProIdLayout() {
  const { id } = useParams();
  return (
    <Stack alignItems="center" p={2}>
      <Stack mt={4} spacing={4} width="100%">
        <ApiServer endpoint={endpoints.ODV_PRO_HEADER} params={{ id }}>
          <Title />
          <ApiDataHeader columns={odv_pro_id_header_columns} />
          <OutletWithProps />
        </ApiServer>
      </Stack>
    </Stack>
  );
}

function Title({ data }) {
  data = data?.length > 0 && data?.reduce((object, next) => object);
  const navigate = useNavigate();
  const { openInNewTab } = useWindowManagerContext();
  const state_resolved = useResolvedPath("/odv_pro/:id/state");
  const details_resolved = useResolvedPath("/odv_pro/:id/details");
  const match_state = useMatch({ path: state_resolved.pathname, end: true });
  const match_details = useMatch({
    path: details_resolved.pathname,
    end: true,
  });

  const [searchParams] = useSearchParams();
  const editing = searchParams.has("editing");

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography variant="h4">
        {data?.tipo_decod} {data?.numero}
      </Typography>
      {match_details && (
        <>
          {data?.tipo_decod === "Ordine" && (
            <Button
              variant="outlined"
              onClick={() =>
                navigate(`state/${openInNewTab ? "?minimal=true" : ""}`)
              }
            >
              Situazione
            </Button>
          )}

          {editing ? (
            <Button
              color="error"
              variant="contained"
              onClick={() =>
                navigate(`details/${openInNewTab ? "?minimal=true" : ""}`)
              }
            >
              Esci da modifica
            </Button>
          ) : (
            <Button
              color="warning"
              variant="contained"
              onClick={() =>
                navigate(
                  `details/?editing=true&${openInNewTab ? "minimal=true" : ""}`
                )
              }
            >
              Modifica
            </Button>
          )}
        </>
      )}
      {match_state && (
        <Button
          variant="outlined"
          onClick={() => navigate("details/?minimal=true")}
        >
          Dettagli
        </Button>
      )}
    </Stack>
  );
}

function OutletWithProps({ data }) {
  data = data?.length > 0 && data?.reduce((object, next) => object);

  return <Outlet context={data} />;
}
