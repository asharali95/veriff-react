import { useEffect, useState } from "react";
import "./App.css";
import Authentication from "./view/Auth/Authentication";
import VerificationScreen from "./view/verification-screen/index";
function App() {
  const [authData, setAuthData] = useState(null);
  useEffect(() => {
    var auth = window.localStorage.getItem("auth");
    auth && setAuthData(JSON.stringify(auth));
  }, []);
  return (
    <>
      {!authData && <Authentication />}
      {authData && <VerificationScreen />}
    </>
  );
}

export default App;
