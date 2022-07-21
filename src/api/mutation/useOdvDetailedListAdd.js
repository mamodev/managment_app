import { POST } from "api";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useMutation, useQueryClient } from "react-query";

export default function useOdvDetailedListAdd(options) {
  const { api } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation((data) => POST(api, { table: "odv_righe_cre", profile: "vend", data }), {
    ...options,
    onSuccess: (row, vars) => {
      //Query update with invalidation
      const key = KEYS.ODV_DETAILED_LIST(
        row.odv_id + "",
        row.tipo_riga === "V" || row.tipo_riga === "P" ? 'in.("V","P")' : 'in.("D")',
        row.struttura_id ? `eq.${row.struttura_id}` : undefined
      );

      queryClient.setQueryData(key, (old) => [...old, row]);
      //FIXME make more specific key
      queryClient.invalidateQueries(["ODV_PRO", "HEADER"]);
      options?.onSuccess(row, vars);
    },
  });
}
