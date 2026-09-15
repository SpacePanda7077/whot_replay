import Header from "../../components/header/Header";
import About from "./about";
import Experience from "./experience";
import KeyFeatures from "./key-features";
import Landing from "./Landing";

export default function WhotAfrica() {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center mt-30 text-white/70 ">
                <Landing />
                <KeyFeatures />
                <Experience />
                <About />
            </div>
        </>
    );
}

