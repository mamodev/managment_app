import { LoadingButton } from "@mui/lab";
import { Button, Stack, Typography } from "@mui/material";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import { VerticalInputTable } from "components/modules/TableInput";
import ApiDataHeader from "components/templates/ApiDataHeader";
import { useAuthContext } from "context/AuthContext";
import { useWindowManager } from "context/NewWindowManagerContext";
import { useMutation, useQueryClient } from "react-query";
import {
  Outlet,
  useMatch,
  useNavigate,
  useParams,
  useResolvedPath,
  useSearchParams,
} from "react-router-dom";
import { odv_pro_id_header_columns } from "./header";

function NewHeader() {
  return (
    <Stack direction="row" pt={2} spacing={1} sx={{ alignItems: "start" }}>
      <VerticalInputTable fields={[]} initialState={{}} onChange={{}} />
    </Stack>
  );
}

export default function OdvProIdLayout() {
  const { id } = useParams();
  return (
    <Stack alignItems="center" p={2} px={4}>
      <Stack mt={4} spacing={4} width="100%">
        <ApiServer endpoint={endpoints.ODV_PRO_HEADER} params={{ id }}>
          <Title />
          <ApiDataHeader columns={odv_pro_id_header_columns} fullWidth />

          <OutletWithProps />
        </ApiServer>
      </Stack>
    </Stack>
  );
}

function Title({ data }) {
  data = data?.length > 0 && data?.reduce((object, next) => object);
  const navigate = useNavigate();
  const { openInNewTab } = useWindowManager();
  const state_resolved = useResolvedPath("/odv_pro/:id/state");
  const details_resolved = useResolvedPath("/odv_pro/:id/details");
  const match_state = useMatch({ path: state_resolved.pathname, end: true });
  const match_details = useMatch({
    path: details_resolved.pathname,
    end: true,
  });

  const [searchParams] = useSearchParams();
  const editing = searchParams.has("editing");

  const { id } = useParams();
  const queryClient = useQueryClient();
  const { api } = useAuthContext();
  const { func, revalidate } = endpoints.ODV_PRO_LIST(api).toOrder;

  const { mutate, loading } = useMutation(func, { onSuccess: () => revalidate(data, queryClient) });

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="h4">
        {data?.tipo_decod} {data?.numero} {match_state && "- situazione"}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        {match_details && (
          <>
            {data?.tipo_decod === "Ordine" && (
              <Button
                variant="outlined"
                onClick={() => navigate(`state/${openInNewTab ? "?minimal=true" : ""}`)}
              >
                Situazione
              </Button>
            )}

            {(data?.tipo_decod === "Preventivo" || data?.tipo_decod === "Bozza di progetto") && (
              <LoadingButton
                loading={loading}
                variant="outlined"
                onClick={() => mutate({ in_id: id })}
              >
                Trasforma in ordine
              </LoadingButton>
            )}

            {editing ? (
              <Button
                color="error"
                variant="contained"
                onClick={() => navigate(`details/${openInNewTab ? "?minimal=true" : ""}`)}
              >
                Esci da modifica
              </Button>
            ) : (
              <Button
                color="warning"
                variant="contained"
                onClick={() =>
                  navigate(`details/?editing=true&${openInNewTab ? "minimal=true" : ""}`)
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
            onClick={() => navigate(`details/?${openInNewTab ? "minimal=true" : ""}`)}
          >
            Dettagli
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

function OutletWithProps({ data }) {
  data = data?.length > 0 && data?.reduce((object, next) => object);

  return <Outlet context={data} />;
}
