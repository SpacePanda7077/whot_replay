import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <>
            <div className="absolute w-full h-full flex justify-center items-center">
                <Outlet />
            </div>
        </>
    );
}

