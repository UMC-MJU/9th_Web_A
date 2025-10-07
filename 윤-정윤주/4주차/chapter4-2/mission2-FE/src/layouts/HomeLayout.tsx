import { Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <nav>nav</nav>
            <main className="flex-1">
                {/* Outlet: 라우터의 children 경로가 여기에 렌더링 */}
                <Outlet />
            </main>
            <footer>footer</footer>
        </div>
    );
};

export default HomeLayout;