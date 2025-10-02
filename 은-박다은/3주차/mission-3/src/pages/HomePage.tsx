import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default HomePage;
