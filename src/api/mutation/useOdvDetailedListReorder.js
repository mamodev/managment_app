import { POST } from "api";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useMutation, useQueryClient } from "react-query";

export default function useOdvDetailedListReorder(options) {
  const { api } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, target_id, position = false, row }) =>
      POST(api, {
        table: "odv_righe_sposta",
        profile: "vend",
        data: {
          in_id_da_spostare: id,
          in_id_dove: target_id,
          in_sotto: position,
        },
      }),
    {
      ...options,
      onSuccess: (data, { row, oldIndex, targetIndex, position }) => {
        const key = KEYS.ODV_DETAILED_LIST(
          row.odv_id + "",
          row.tipo_riga === "V" || row.tipo_riga === "P" ? 'in.("V","P")' : 'in.("D")',
          row.struttura_id ? `eq.${row.struttura_id}` : undefined
        );

        queryClient.setQueryData(key, (old) => {
          const newRows = [...old];
          if (position)
            for (let i = oldIndex; i < targetIndex; i++) {
              const temp = newRows[i];
              newRows[i] = newRows[i + 1];
              newRows[i + 1] = temp;
            }
          else
            for (let i = oldIndex; i > targetIndex; i--) {
              const temp = newRows[i];
              newRows[i] = newRows[i - 1];
              newRows[i - 1] = temp;
            }

          return newRows;
        });
        options?.onSuccess(data);
      },
    }
  );
}
