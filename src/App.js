import { useEffect, useState } from "react";
import "./App.css";
import Authentication, { ResetForm } from "./view/Auth/Authentication";
import VerificationScreen from "./view/verification-screen/index";
import {useNavigate} from "react-router-dom"

import {
  Routes,
  Route,
  Link
} from "react-router-dom";
function App() {
  const [authData, setAuthData] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    var auth = window.localStorage.getItem("auth");
    auth && navigate("/app")
  }, []);
  return (
    <>
      
    <Routes>
    <Route path="/" element={<Authentication/>}/>
      <Route path="/forgot-password/:token" element={<ResetForm navigate={navigate}/>}/>
      <Route path="/app" element={<VerificationScreen/>}/>
          
    </Routes>
      </>
   
  );
}

export default App;
