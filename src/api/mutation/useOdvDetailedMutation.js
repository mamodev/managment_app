import { POST } from "api";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useMutation, useQueryClient } from "react-query";

export default function useOdvDetailedMutation(options) {
  const { api } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation(
    (row) => {
      const data = {
        in_id: row.id,
        in_linea: row.linea,
        in_codice: row.codice,
        in_dex: row.dex,
        in_dex2: row.dex2,
        in_prezzo_un_lordo: row.prezzo_un_lordo,
        in_sconto_vend: row.sconto_vend !== undefined ? row.sconto_vend : null,
        in_prezzo_un_netto: row.prezzo_un_netto !== undefined ? row.prezzo_un_netto : null,
        in_qta: row.qta,
        in_tum: null,
      };
      return POST(api, { table: "odv_righe_upd", profile: "vend", data });
    },
    {
      ...options,
      onSuccess: (data, row) => {
        console.log(row);
        //Query update with invalidation
        const key = KEYS.ODV_DETAILED_LIST(
          row.odv_id + "",
          row.tipo_riga === "V" || row.tipo_riga === "P" ? 'in.("V","P")' : 'in.("D")',
          row.struttura_id ? `eq.${row.struttura_id}` : undefined
        );

        console.log(key);
        queryClient.setQueryData(key, (old) => {
          if (!old) return old;

          const newRows = [...old];
          let index = -1;
          for (let i = 0; i < newRows.length; ++i)
            if (newRows[i].id === row.id) {
              index = i;
              break;
            }

          if (index !== -1) newRows[index] = { ...newRows[index], ...data };
          return newRows;
        });
        //FIXME make more specific key
        queryClient.invalidateQueries(["ODV_PRO", "HEADER"]);

        options?.onSuccess(data, row);
      },
    }
  );
}
