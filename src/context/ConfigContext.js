import { endpoints } from "api";
import { useSnackbar } from "notistack";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthContext } from "./AuthContext";
const ConfigContext = React.createContext({});

async function fetchConfig(api, func) {
  let res;
  try {
    res = await func();
    return res ? JSON.parse(res.replaceAll("£", '"')) : {};
  } catch (error) {
    console.error("Error while loading config endpoint");
    console.error(error);
    return {};
  }
}

function ConfigContextProvider({ children }) {
  const { api } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const { func } = useMemo(() => endpoints.CONFIG(api), [api]);
  const [config, setConfig] = useState(null);

  const updateConfig = useCallback((config) => {
    console.log(config);
    setConfig(config);
    localStorage.setItem("config", JSON.stringify(config));
  }, []);

  useEffect(() => {
    const load = async () => {
      const storedConfig = localStorage.getItem("config");
      if (storedConfig) {
        let jsonConfig;
        try {
          jsonConfig = JSON.parse(storedConfig);
          setConfig(jsonConfig);
        } catch (e) {
          updateConfig(await fetchConfig(api, func));
        }
      } else updateConfig(await fetchConfig(api, func));
    };
    load();
  }, [api, func, updateConfig]);

  const reloadConfig = useCallback(() => {
    const load = async () => {
      updateConfig(await fetchConfig(api, func));
      enqueueSnackbar("Configurazione caricata con successo", {
        variant: "success",
      });
    };
    load();
  }, [api, func, updateConfig, enqueueSnackbar]);

  return (
    <ConfigContext.Provider value={{ ...config, reloadConfig }}>
      {config && children}
    </ConfigContext.Provider>
  );
}

function useConfig() {
  return useContext(ConfigContext);
}

export { useConfig, ConfigContext, ConfigContextProvider };
