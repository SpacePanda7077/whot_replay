import { IoTrashOutline } from "react-icons/io5";
interface Prop {
    id: string;
    team: string;
    odd: number;
}
export default function Accumulated_Match_Info({ id, team, odd }: Prop) {
    return (
        <>
            <div className="flex justify-between items-center text-sm p-2 bg-[#1A0310] rounded-lg">
                <div className="flex flex-col">
                    <h2 className="text-white">
                        Match #{id}. Team {team.toLocaleUpperCase()}
                    </h2>
                    <p className="text-xs">{odd}x · Pari-Mutuel</p>
                </div>
                <IoTrashOutline size={20} />
            </div>
        </>
    );
}

