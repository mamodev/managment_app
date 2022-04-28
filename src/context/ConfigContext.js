import { endpoints } from "api";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useAuthContext } from "./AuthContext";
const ConfigContext = React.createContext({});

function ConfigContextProvider({ children }) {
  const { api } = useAuthContext();
  const { key, func } = endpoints.CONFIG(api);
  const { data } = useQuery(key, func);

  const decodedConfig = data
    ? JSON.parse(data.replaceAll("£", '"'))
    : undefined;

  return (
    <ConfigContext.Provider value={decodedConfig}>
      {decodedConfig && children}
    </ConfigContext.Provider>
  );
}

function useConfig() {
  return useContext(ConfigContext);
}

export { useConfig, ConfigContext, ConfigContextProvider };
