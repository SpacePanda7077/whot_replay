import { FC, useEffect, useState } from "react";
import { logo, menu, close, apple } from "../assets";
import { navLinks } from "../constants";
import styles from "../style";
import { Navigate, useNavigate } from "react-router";

const Navbar: FC = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState("Home");
    const [toggle, setToggle] = useState(false);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setAuth(!(token == null || token == ""));
    }, []);

    const handleLogout = () => {
        localStorage.setItem("token", "");
        navigate("/login", { state: { prevPage: "/" } });
    };

    return (
        <div
            className={`sticky top-0 z-40 w-full ${styles.flexCenter} border-b border-navBorderColor bg-white`}
        >
            <div className={`${styles.boxWidth} ${styles.paddingX} mx-auto`}>
                <nav className="w-full flex py-6 justify-between items-center navbar h-[85px]">
                    <div
                        className={`flex-1 w-[110px] h-[28px]`}
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        <img src={logo} alt="whot" />
                    </div>

                    <div className={`lg:flex hidden ${styles.flexCenter}`}>
                        <ul className="list-none sm:flex hidden justify-center items-center flex-1">
                            {navLinks.map((nav, index) => (
                                <li
                                    key={nav.id}
                                    className={`font-poppins cursor-pointer text-[18px] text-black ${
                                        active === nav.title
                                            ? "font-bold"
                                            : "font-normal"
                                    } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
                                    onClick={() => setActive(nav.title)}
                                >
                                    <a href={`#${nav.id}`}>{nav.title}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {auth ? (
                        <div className="flex-1 flex justify-end">
                            <button
                                type="button"
                                className={`py-4 px-6 font-poppins font-medium text-[18px] text-white bg-black box-shadow rounded-full w-[171px] h-[59px]`}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex justify-end">
                            <button
                                type="button"
                                className={`py-4 px-6 font-poppins font-medium text-[18px] text-white bg-black box-shadow rounded-full w-[171px] h-[59px]`}
                                onClick={() =>
                                    navigate("/login", {
                                        state: {
                                            userName: "User",
                                            prevPage: "/",
                                        },
                                    })
                                }
                            >
                                Login
                            </button>
                        </div>
                    )}

                    <div className="lg:hidden flex justify-center items-center ml-4">
                        <img
                            src={toggle ? close : menu}
                            alt="menu"
                            className="w-[28px] h-[28px] "
                            onClick={() => setToggle(!toggle)}
                        />

                        <div
                            className={`${
                                !toggle ? "hidden" : "flex"
                            } p-6 bg-black-gradient absolute top-20 right-0 mx-2 my-1 min-w-[140px] rounded-md sidebar`}
                        >
                            <ul className="list-none flex justify-end items-start flex-1 flex-col">
                                {navLinks.map((nav, index) => (
                                    <li
                                        key={nav.id}
                                        className={`font-poppins font-medium cursor-pointer text-[16px] ${
                                            active === nav.title
                                                ? "text-white"
                                                : "text-dimWhite"
                                        } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                                    >
                                        <a href={`#${nav.id}`}>{nav.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;
