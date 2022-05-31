import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import AuthContext from "./AuthContext";

function formatMessage(msg) {
  return msg
    .replaceAll("Ã²", "ò")
    .replaceAll("Ã¨", "è")
    .replaceAll("Ã¬", "ì")
    .replaceAll("Ã¹", "ù")
    .replaceAll("Ã©", "é")
    .replaceAll("Ã", "à");
}
export default function AuthContextProvider({ children }) {
  const [sede, setSede] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const api = useRef(
    axios.create({
      baseURL: "http://164.132.224.238:3000/",
      timeout: 1000,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY29tbW9uX3VzZXIifQ.u7emJKa7Wgwyb2eJl8sl5ojQfdBk-Jne2TdeRWo3R9k",
      },
    })
  );

  useEffect(() => {
    api.current.interceptors.response.use(
      (response) => {
        const hasMessage = !!response.headers["out-msg"];
        const hasVariant = !!response.headers["out-rc"];

        if (hasMessage)
          enqueueSnackbar(
            formatMessage(response.headers["out-msg"]),
            hasVariant ? { variant: response.headers["out-rc"] } : {}
          );

        return response;
      },
      (error) => {
        const hasMessage = !!error.response.headers["out-msg"];
        const hasVariant = !!error.response.headers["out-rc"];

        if (hasMessage)
          enqueueSnackbar(
            formatMessage(error.response.headers["out-msg"]),
            hasVariant ? { variant: error.response.headers["out-rc"] } : { variant: "error" }
          );
        else enqueueSnackbar("C'è stato un errore!", { variant: "error" });
        return Promise.reject(error);
      }
    );

    api.current
      .get("sede_prove", {
        headers: { "Accept-Profile": "public" },
      })
      .then((response) => {
        setSede(response.data[0].sede);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ api: api.current, sede: sede, vendId: 1 }}>
      {sede && children}
    </AuthContext.Provider>
  );
}
