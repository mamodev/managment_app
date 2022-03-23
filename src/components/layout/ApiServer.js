import { getEndpoint } from "api";
import AuthContext from "context/AuthContext";
import React, { useContext } from "react";
import { useQuery, useQueryClient } from "react-query";

export default function ApiServer({ query, children }) {
  const { api } = useContext(AuthContext);
  const { key, func } = getEndpoint(api, query);
  const { data, isSuccess } = useQuery(key, func);
  const client = useQueryClient();

  const invalidate = () => {
    client.invalidateQueries(key);
  };

  return (
    <>
      {isSuccess &&
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              data,
              invalidate: invalidate,
            });
          }
          return child;
        })}
    </>
  );
}
