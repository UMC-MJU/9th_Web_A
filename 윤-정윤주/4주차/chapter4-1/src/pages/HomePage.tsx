import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const HomePage = () => {
    return (
        <>
            <Navbar />
            <Outlet />  {/* 자식 컴포넌트가 렌더링 될 자리 */}
        </>
    );
}

export default HomePage;