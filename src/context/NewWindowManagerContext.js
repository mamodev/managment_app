import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const WindowManagerContext = React.createContext({});

let global_windows = {};

function getCenteredLocation(w, h) {
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;

  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;

  return `width=${w}, 
    height=${h}, 
    top=${top}, 
    left=${left}`;
}

export function WindowManagerProvider({ children }) {
  const window_key = window.windowManagerSession;
  const [windows, setWindows] = useState({});
  const [openInNewTab, setOpenInNewTab] = useState({ active: true, always: true });
  const navigate = useNavigate();

  const close = useCallback(
    (window_name) => {
      setWindows((old) => {
        const newWindows = { ...old };
        newWindows[window_name].close();
        delete newWindows[window_name];
        localStorage.setItem(window_key, JSON.stringify(Object.keys(newWindows)));
        return newWindows;
      });
    },
    [setWindows]
  );

  const updatedWindows = useCallback(
    (stored_windows) => {
      const newWindows = {};
      for (let window_name of stored_windows) {
        if (windows[window_name]) newWindows[window_name] = windows[window_name];
        else newWindows[window_name] = window.open("", window_name);
        //FIXME make window not appear in foreground
      }

      return newWindows;
    },
    [windows]
  );

  const open = useCallback(
    ({
      url,
      position = "center",
      w = 700,
      h = 500,
      name = "Figlia",
      params = "",
      minimal = "true",
      searchParams = {},
    }) => {
      //Get window dimentions
      let pos_dim = "";
      switch (position) {
        case "center":
          pos_dim = getCenteredLocation(w, h);
          break;
        default:
          pos_dim = `width=${w},height=${h}`;
      }

      const window_config = `scrollbars=no,status=no,location=no,resizable=0,toolbar=no,titlebar=no,menubar=no,${pos_dim}`;
      const window_name = openInNewTab.always ? name + " " + params : name;

      //close identical window if open
      if (window[window_name]) close(window_name);

      //build url
      //FIXME add url encoding
      let computedUrl = url;
      if (minimal && openInNewTab.active) searchParams.minimal = true;
      if (Object.keys(searchParams).length > 0) computedUrl += "?";
      for (const key of Object.keys(searchParams)) {
        computedUrl += `${key}=${searchParams[key]}&`;
      }

      if (!openInNewTab.active) {
        navigate(computedUrl);
        return;
      }

      //open new window
      const new_window = window.open(computedUrl, window_name, window_config);

      //Set window tile onLoad
      new_window.onload = () =>
        (new_window.document.getElementsByTagName("title")[0].innerText = window_name);

      new_window.windowManagerSession = window.windowManagerSession;

      setWindows((old) => {
        const newWindows = { ...old, [window_name]: new_window };
        localStorage.setItem("windows-" + window_key, JSON.stringify(Object.keys(newWindows)));
        return newWindows;
      });
    },
    [openInNewTab.active, openInNewTab.always, close, navigate]
  );

  const toggleOpenInNewTab = () => {
    setOpenInNewTab(({ active, always }) => {
      const newVal = { active: !active, always };
      localStorage.setItem("openInNewTab", JSON.stringify(newVal));
      return newVal;
    });
  };
  const toggleAlwaysOpenNewTab = () => {
    console.log("here");
    setOpenInNewTab(({ active, always }) => {
      const newVal = { active, always: !always };
      localStorage.setItem("openInNewTab", JSON.stringify(newVal));
      return newVal;
    });
  };

  const beforeUnload = () => {
    let stored_windows = JSON.parse(localStorage.getItem("windows-" + window_key));
    if (window.name === "") {
      for (const w of Object.values(global_windows)) w.close();
      localStorage.setItem("windows-" + window_key, "[]");
      localStorage.removeItem("windows-" + window_key);
    }

    if (stored_windows.some((e) => e === window.name)) {
      stored_windows = stored_windows.filter((e) => e !== window.name);
      localStorage.setItem("windows-" + window_key, JSON.stringify(stored_windows));
    }
  };

  const storageChange = useCallback(
    (event) => {
      if (event.key === "windows-" + window_key) {
        setWindows(updatedWindows(JSON.parse(event.newValue)));
      }
      if (event.key === "openInNewTab") setOpenInNewTab(JSON.parse(event.newValue));
    },
    [updatedWindows]
  );

  const closeAll = useCallback(() => {
    for (let w of Object.values(windows)) w.close();

    setWindows({});
    localStorage.setItem("windows-" + window_key, "[]");
  }, [openInNewTab, windows]);

  useEffect(() => {
    window.addEventListener("storage", storageChange);

    window.addEventListener("beforeunload", beforeUnload);

    checkLocalStorageDefaults();
    setOpenInNewTab(JSON.parse(localStorage.getItem("openInNewTab")));

    setWindows(updatedWindows(JSON.parse(localStorage.getItem("windows-" + window_key))));

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("storage", storageChange);
    };
  }, []);

  useEffect(() => (global_windows = windows), [windows]);

  function checkLocalStorageDefaults() {
    if (!localStorage.getItem("openInNewTab"))
      localStorage.setItem("openInNewTab", JSON.stringify({ active: true, always: true }));
    if (!localStorage.getItem("windows-" + window_key))
      localStorage.setItem("windows-" + window_key, JSON.stringify([]));
  }

  const focusAll = () => {
    for (const window_name of Object.keys(windows)) {
      window.open("", window_name);
    }
  };
  return (
    <WindowManagerContext.Provider
      value={{
        newWindow: open,
        toggleOpenInNewTab,
        toggleAlwaysOpenNewTab,
        closeAll,
        focusAll,
        openInNewTab: openInNewTab.active,
        openAlwaysNewTab: openInNewTab.always,
        openedWindows: Object.keys(windows).length,
        windows,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  return useContext(WindowManagerContext);
}
