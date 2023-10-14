import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/Home";

function ApplicationNavigation() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default ApplicationNavigation;
