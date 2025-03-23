/*
======================== USAGE ====================
Just call the component giving an array with completed goals and an
array with the goals to complete (Arrays must have the same size):

        <GoalsCard Progress={ProgressArray} Total={TotalArray}></GoalsCard>

======================== EXAMPLE ===================

        <GoalsCard Progress={[0, 3, 7]} Total={[7, 7, 7]}></GoalsCard>

 */

import { Cherry_Bomb_One } from "next/font/google";
import { Delicious_Handrawn } from "next/font/google";

const CherryBomb = Cherry_Bomb_One({
    subsets: ["latin"],
    weight: "400",
});

const DeliciousHandDrawn = Delicious_Handrawn({
    subsets: ["latin-ext"],
    weight: "400",
})

const GetCompletedGoalsAsPercentage = ({ Completed, Total }) => {
    return (Completed / Total) * 100;
};


const BuildDailyGoalsCardGoalListItem = ({Text, Completed, Total}) => {
    const progress = GetCompletedGoalsAsPercentage({ Completed, Total });
    return (
        <li id="DailyGoalListItem">
            <h3 id={"DailyGoalListTitle"} className={`font-bold text-4xl mb-2 ${DeliciousHandDrawn.className}`}>{Text}</h3>
            <section id={"DailyGoalListItemBody"} className="flex items-center gap-4">
                <div id={"GrayProgressBar"} className="flex-grow w-full bg-[#D9D9D9] rounded-full h-4 overflow-hidden">
                    <div id={"YellowProgressBar"} className="bg-[#FBAF00] h-full rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <h3 id={"NumericProgress"} className={`text-6xl inline-flex items-center align-middle pb-4 pl-1 ${DeliciousHandDrawn.className}`}>{Completed}/{Total}</h3>
            </section>
        </li>
    );
}

export default function GoalsCard({ Progress, Total }) {
    return (
            <section
                id="DailyGoalsCard"
                className="bg-[#FFDEB6] flex flex-col items-center border-6 border-[#FBAF00] rounded-xl
                       w-full max-w-2xl h-auto pt-3 px-6 md:px-10">
                <h2
                    id="DailyGoalsCardTitle"
                    className={`text-center text-7xl text-[#FBAF00] ${CherryBomb.className}
                            [text-shadow:8px_0px_0px_#372E55] [-webkit-text-stroke:1px_black]
                            border-black`}>
                    Daily goals
                </h2>
                <div className="w-full max-w-lg h-px bg-black mt-4"></div>
                <ul id="DailyGoalsCardGoalList" className="w-full space-y-2 mt-6 pb-24">
                    {Progress.map((completed, index) => (
                        <BuildDailyGoalsCardGoalListItem Text={"Complete Quizzes"} Completed={completed} Total={Total[index]} />
                    ))}
                </ul>
            </section>
    );
}