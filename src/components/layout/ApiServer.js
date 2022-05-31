import AuthContext from "context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function ApiServer({
  endpoint,
  children,
  singleMode,
  filters: { queryCount, ...filters } = {},
  params,
  verbose = false,
}) {
  const { api } = useContext(AuthContext);
  const { key, func } = endpoint(api, params, filters);
  const { data, isFetching, refetch } = useQuery(key, func);

  const [dataState, setDataState] = useState(null);

  useEffect(() => {
    if (!isFetching) {
      if (singleMode) {
        if (Array.isArray(data) && data.length > 0) {
          setDataState(data[0]);
          if (verbose) console.log(data);
        } else setDataState({});
      } else {
        setDataState(data);
        if (verbose) console.log(data);
      }
    }
  }, [data, isFetching]);

  useEffect(() => refetch(), [queryCount]);
  return (
    <>
      {dataState &&
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              data: dataState,
            });
          }
          return child;
        })}
    </>
  );
}
