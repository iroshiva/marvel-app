import "../../App.css";
import ErrorPage from "../ErrorPage";
import Footer from "../Footer";
import Header from "../Header";
import Landing from "../Landing";
import Login from "../Login";
import Signup from "../Signup";
import Welcome from "../Welcome";

import { Routes, Route } from "react-router-dom";
import ForgetPassword from "../ForgetPassword";

import { IconContext } from "react-icons";

function App() {
  return (
    <IconContext.Provider value={{ style: { verticalAlign: "middle" } }}>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </IconContext.Provider>
  );
}

export default App;
