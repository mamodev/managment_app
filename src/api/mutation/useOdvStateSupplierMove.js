import { POST } from "api";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";

export default function useOdvStateSupplierMove(options) {
  const { api } = useAuthContext();
  const queryClient = useQueryClient();
  const { mutate: itemMutate, ...mutationObj } = useMutation(({ in_gr_cons_id, in_riga_id }) => {
    return POST(api, {
      table: "odv_gru_cons_ass",
      profile: "vend",
      data: { in_gr_cons_id, in_riga_id },
    });
  });

  const mutate = useCallback(
    ({ items = [], odv_id }) => {
      items.forEach((item) =>
        itemMutate(
          { ...item, odv_id },
          {
            ...options,
            onSuccess: (data, vars) => {
              const { odv_id } = vars;
              queryClient.invalidateQueries(KEYS.ODV_STATE(odv_id));

              options?.onSuccess(data, vars);
            },
          }
        )
      );
    },
    [itemMutate, options, queryClient]
  );
  return { ...mutationObj, mutate };
}
