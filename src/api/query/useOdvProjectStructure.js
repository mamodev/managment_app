import { GET } from "api/functions";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useQuery } from "react-query";

export default function useOdvProjectStructure(odv_id, project_id) {
  const { api } = useAuthContext();
  const key = KEYS.ODV_DETAILED_LIST_PROJECT_STRUCTURE(odv_id, project_id);

  return useQuery(key, () =>
    GET(api, {
      table: "v_odv_strutt",
      profile: "vend",
      progetto_id: `eq.${project_id}`,
    })
  );
}
