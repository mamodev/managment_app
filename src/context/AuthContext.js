import React, { useContext } from "react";

const AuthContext = React.createContext();
function useAuthContext() {
  return useContext(AuthContext);
}
export default AuthContext;
export { useAuthContext };
