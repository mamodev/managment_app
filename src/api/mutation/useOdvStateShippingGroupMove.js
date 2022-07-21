import { POST } from "api";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useMutation, useQueryClient } from "react-query";

export default function useOdvStateShippingGroupMove(options) {
  const { api } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation(
    ({ in_gr_cons_id, in_gr_fatt_id, odv_id }) => {
      return POST(api, {
        table: "odv_gru_fatt_ass",
        profile: "vend",
        data: { in_gr_cons_id, in_gr_fatt_id },
      });
    },
    {
      ...options,
      onSuccess: (data, vars) => {
        const { odv_id } = vars;
        queryClient.invalidateQueries(KEYS.ODV_STATE(odv_id));

        options?.onSuccess(data, vars);
      },
    }
  );
}
