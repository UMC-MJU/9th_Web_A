import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar";

const RootLayOut = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default RootLayOut;
