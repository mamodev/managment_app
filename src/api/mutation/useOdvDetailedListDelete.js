import { POST } from "api";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useMutation, useQueryClient } from "react-query";

export default function useOdvDetailedListDelete(options) {
  const { api } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }) => POST(api, { table: "odv_righe_del", profile: "vend", data: { in_id: id } }),
    {
      ...options,
      onSuccess: (data, row) => {
        //Query update with invalidation
        const key = KEYS.ODV_DETAILED_LIST(
          row.odv_id + "",
          row.tipo_riga === "V" || row.tipo_riga === "P" ? 'in.("V","P")' : 'in.("D")',
          row.struttura_id ? `eq.${row.struttura_id}` : undefined
        );

        queryClient.setQueryData(key, (old) => {
          if (!old) return old;
          return old.filter((e) => e.id !== row.id);
        });
        //FIXME make more specific key
        queryClient.invalidateQueries(["ODV_PRO", "HEADER"]);
        options?.onSuccess(data, row);
      },
    }
  );
}
