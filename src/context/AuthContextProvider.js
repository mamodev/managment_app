import axios from "axios";
import { useRef } from "react";
import AuthContext from "./AuthContext";

export default function AuthContextProvider({ children }) {
  const instance = axios.create({
    baseURL: "http://164.132.224.238:3000/",
    timeout: 1000,
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY29tbW9uX3VzZXIifQ.u7emJKa7Wgwyb2eJl8sl5ojQfdBk-Jne2TdeRWo3R9k",
    },
  });
  const api = useRef(instance);
  return (
    <AuthContext.Provider value={{ api: api.current }}>
      {children}
    </AuthContext.Provider>
  );
}
