import { POST } from "api";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useMutation, useQueryClient } from "react-query";

export default function useOdvDetailedListCancel(options) {
  const { api } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation(
    ({ in_id, in_caus_annullam }) => {
      return POST(api, {
        table: "odv_righe_ann",
        profile: "vend",
        data: { in_id, in_caus_annullam },
      });
    },
    {
      ...options,
      onSuccess: (row, vars) => {
        //Query update with invalidation
        const key = KEYS.ODV_DETAILED_LIST(
          row.odv_id + "",
          row.tipo_riga === "V" || row.tipo_riga === "P" ? 'in.("V","P")' : 'in.("D")',
          row.struttura_id ? `eq.${row.struttura_id}` : undefined
        );

        queryClient.setQueryData(key, (old) => {
          if (!old) return old;

          const newRows = [...old];
          let index = -1;
          for (let i = 0; i < newRows.length; ++i)
            if (newRows[i].id === row.id) {
              index = i;
              break;
            }

          if (index !== -1) newRows[index] = { ...newRows[index], ...row };
          return newRows;
        });
        //FIXME make more specific key
        queryClient.invalidateQueries(["ODV_PRO", "HEADER"]);
        options?.onSuccess(row, vars);
      },
    }
  );
}
