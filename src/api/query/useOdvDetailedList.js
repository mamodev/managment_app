import { GET } from "api/functions";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useQuery } from "react-query";

export default function useOdvDetailedList(odv_id, row_type, struct_id) {
  const { api } = useAuthContext();
  const key = KEYS.ODV_DETAILED_LIST(odv_id, row_type, struct_id);
  const options = {
    table: "v_odv_righe",
    profile: "vend",
    odv_id: `eq.${odv_id}`,
    tipo_riga: row_type,
  };

  if (struct_id) options.struttura_id = struct_id;
  return useQuery(key, () => GET(api, options));
}
