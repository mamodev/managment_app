import { getEndpoint } from "api";
import AuthContext from "context/AuthContext";
import { useContext } from "react";
import { useQuery } from "react-query";

export default function ApiFilterServer({
  query,
  children: Children,
  dataName = "data",
  mapData = (e) => e,
  ...props
}) {
  const { api } = useContext(AuthContext);
  const { key, func } = getEndpoint(api, query);

  const { isSuccess, data } = useQuery(key, func);
  const dataEncoded = {};
  dataEncoded[dataName] = data?.map(mapData);
  return <>{isSuccess && <Children {...props} {...dataEncoded} />}</>;
}
