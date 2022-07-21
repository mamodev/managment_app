import { GET } from "api/functions";
import { KEYS } from "api/keys";
import { useAuthContext } from "context/AuthContext";
import { useQuery } from "react-query";

export default function useOdvDetailedListCancelDomain() {
  const { api } = useAuthContext();
  const key = KEYS.ODV_DETAILED_LIST_CANCEL_DOMAIN;

  return useQuery(key, () =>
    GET(api, {
      table: "caus_ann_odv",
      profile: "base",
    })
  );
}
