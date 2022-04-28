import AuthContext from "context/AuthContext";
import { useContext } from "react";
import { useQuery } from "react-query";

export default function ApiFilterServer({
  endpoint,
  filters,
  params,
  children: Children,
  dataName = "data",
  mapData = (e) => e,
  ...props
}) {
  const { api } = useContext(AuthContext);
  const { key, func } = endpoint(api, params, filters);

  const { isSuccess, data } = useQuery(key, func);
  const dataEncoded = {};
  dataEncoded[dataName] = data?.map(mapData);

  if (!dataEncoded[dataName]) dataEncoded[dataName] = [];
  return <>{isSuccess && <Children {...props} {...dataEncoded} />}</>;
}
