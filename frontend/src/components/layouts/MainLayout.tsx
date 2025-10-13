import NavBar from "../NavBar";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        < div className="flex min-h-screen" >
            <NavBar />
            <main className="flex-1 p-6 bg-slate-50">
                <Outlet />
            </main>
        </div >
    );
}

export default MainLayout;