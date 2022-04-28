import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const WindowManagerContext = React.createContext({});

function useWindowManagerContext() {
  return useContext(WindowManagerContext);
}

function getCenteredLocation(w, h) {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth;

  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;

  return `width=${w}, 
  height=${h}, 
  top=${top}, 
  left=${left}`;
}

function WindowManagerContextProvider({ children }) {
  const navigate = useNavigate();
  const [firstLoad, setFirstLoad] = useState(true);
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [openAlwaysNewTab, setOpenAlwaysNewTab] = useState(false);
  const [windows, setWindows] = useState({});

  const removeWindow = (key) => {
    setWindows((old) => {
      const newWindows = { ...old };
      delete newWindows[key];
      return newWindows;
    });
  };
  function open({
    url,
    minimal = true,
    w = 700,
    h = 500,
    center = true,
    name = "Figlia",
    params = "",
  }) {
    if (openInNewTab) {
      let pos_dim = `width=${w},height=${h}`;
      if (center) pos_dim = getCenteredLocation(w, h);
      let config = `scrollbars=no,status=no,location=no,resizable=0,toolbar=no,titlebar=no,menubar=no,${pos_dim}`;

      const key = openAlwaysNewTab ? name + " " + params : name;
      if (windows[key]) windows[key].close();

      const newWindow = window.open(
        `${url}${minimal ? "?minimal=true" : ""}`,
        key,
        config
      );

      newWindow.onload = () =>
        (newWindow.document.getElementsByTagName("title")[0].innerText = key);
      newWindow.openNewWindow = window.openNewWindow
        ? window.openNewWindow
        : open;

      setWindows((old) => {
        const newWindows = { ...old };
        newWindows[key] = newWindow;
        return newWindows;
      });

      newWindow.addEventListener("beforeunload", () => removeWindow(key));
    } else navigate(url);
  }

  useEffect(() => {
    const storedOpenInNewtab = localStorage.getItem("openInNewTab");
    if (storedOpenInNewtab === undefined)
      localStorage.setItem("openInNewTab", true);
    else setOpenInNewTab(storedOpenInNewtab === "true");

    const storedOpenAlwaysNewTab = localStorage.getItem("openAlwaysNewTab");
    if (storedOpenAlwaysNewTab === undefined)
      localStorage.setItem("openAlwaysNewTab", false);
    else setOpenAlwaysNewTab(storedOpenAlwaysNewTab === "true");

    let openedWindows = localStorage.getItem("openedWindow");
    if (openedWindows) {
      const activeWindows = {};
      openedWindows = JSON.parse(openedWindows);
      for (const windowName of openedWindows) {
        let w = window.open("", windowName);
        if (w.document.location.href === "about:blank") {
          w.close();
          w = undefined;
        }
        if (w) {
          activeWindows[windowName] = w;
          activeWindows[windowName].addEventListener("beforeunload", () =>
            removeWindow(windowName)
          );
        }
      }

      setWindows(activeWindows);
    }

    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (!window.openNewWindow && !firstLoad) {
      const arr = [];
      for (let window in windows) {
        arr.push(windows[window].name);
      }
      localStorage.setItem("openedWindow", JSON.stringify(arr));
    }
  }, [windows, firstLoad]);

  const changeOpenInNewTab = useCallback(
    () =>
      setOpenInNewTab((old) => {
        localStorage.setItem("openInNewTab", !old);
        return !old;
      }),
    []
  );

  const changeOpenAlwaysNewTab = useCallback(
    () =>
      setOpenAlwaysNewTab((old) => {
        localStorage.setItem("openAlwaysNewTab", !old);
        return !old;
      }),
    []
  );

  function focusAll() {
    for (let name in windows) {
      window.open("", name);
    }
  }

  function closeAll() {
    for (let window in windows) {
      const w = windows[window];
      delete windows[window];
      w.close();
    }
  }

  return (
    <WindowManagerContext.Provider
      value={{
        newWindow: window.openNewWindow ? window.openNewWindow : open,
        toggleOpenInNewTab: changeOpenInNewTab,
        toggleOpenAlwaysNewTab: changeOpenAlwaysNewTab,
        focusAll,
        closeAll,
        openInNewTab,
        openAlwaysNewTab,
        openedWindows: Object.keys(windows).length,
        windows: windows,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export default WindowManagerContext;
export { WindowManagerContextProvider, useWindowManagerContext };
