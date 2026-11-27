import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import Copyright from "./Copyright";
import Footer from "./Footer";

export enum NavBarStatus {
    None,
    Home,
    Service,
    About,
    BasicInfo,
}
interface LayoutProps {
    children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const menuItems = ["Home", "Service", "AboutUs"];
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const user = localStorage.getItem("auth");

        console.log("user", user);
        /*if(user == null || user == "")
          navigate("/");
        else
          navigate("/dashboard");*/

        console.log("App useEffect");
    }, []);

    const logOut = () => {
        localStorage.setItem("auth", "");
        navigate("/login", { state: { userName: "Daniel" } });
    };

    return (
        <div className="w-full">
            <Navbar />
            {children}
            <Footer />
            <Copyright />
        </div>
    );
};

export default Layout;
