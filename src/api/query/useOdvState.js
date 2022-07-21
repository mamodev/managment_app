import { GET } from "api/functions";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useQuery } from "react-query";
export default function useOdvState(odv_id) {
  const { api } = useAuthContext();
  const rowKey = KEYS.ODV_STATE(odv_id);

  return useQuery(rowKey, () =>
    GET(api, {
      table: "v_odv_righe_forma_riep",
      profile: "vend",
      odv_id: `eq.${odv_id}`,
    })
  );
}
