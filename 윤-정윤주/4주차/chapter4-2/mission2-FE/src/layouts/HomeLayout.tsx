import { Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <nav className="text-blue-600 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">UMC</h1>
            </nav>
            <main className="flex-1">
                {/* Outlet: 라우터의 children 경로가 여기에 렌더링 */}
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;