import { endpoints } from "api";
import { useAuthContext } from "context/AuthContext";
import { useQuery } from "react-query";

export default function useDomains() {
  const { api } = useAuthContext();
  const { key: IVA_KEY, func: IVA_FUNC } = endpoints.IVA(api, {}, { aliq: "gt.0" });
  const { key: UM_KEY, func: UM_FUNC } = endpoints.UM(api);
  const { key: PRODUCTS_KEY, func: PRODUCTS_FUNC } = endpoints.PRODUCTS_TYPE(api);
  const { key: CAT_KEY, func: CAT_FUNC } = endpoints.ACCOUNTING_CATEGORIES(api);

  const { data: products } = useQuery(PRODUCTS_KEY, PRODUCTS_FUNC);
  const { data: iva } = useQuery(IVA_KEY, IVA_FUNC);
  const { data: um } = useQuery(UM_KEY, UM_FUNC);
  const { data: cat } = useQuery(CAT_KEY, CAT_FUNC);

  return { products, iva, um, cat };
}
