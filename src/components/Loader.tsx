import { Oval } from "react-loader-spinner";

export default function LoadingState() {
    return (
        <div className="fixed top-0 left-0  z-2000000 w-full h-full bg-black/60 flex flex-col gap-4 justify-center items-center">
            <div></div>
            <Oval
                height={250}
                width={250}
                color="#3498db"
                secondaryColor="#f3f3f3"
                strokeWidth={3}
                visible={true}
                ariaLabel="oval-loading"
            />
            <p className="text-center text-white text-xl font-bold">
                Checking Transaction ...
            </p>
        </div>
    );
}

