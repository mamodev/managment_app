import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AuthContext from "./AuthContext";

//profile public
export default function AuthContextProvider({ children }) {
  const [sede, setSede] = useState(null);

  const instance = axios.create({
    baseURL: "http://164.132.224.238:3000/",
    timeout: 1000,
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY29tbW9uX3VzZXIifQ.u7emJKa7Wgwyb2eJl8sl5ojQfdBk-Jne2TdeRWo3R9k",
    },
  });

  const api = useRef(instance);
  useEffect(() => {
    instance
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
