import ProgressBar from "../../Global/ProgressBar"

export default function GoalsBox({ goalsName, goalsTarget, goalsCurrent }) {

    return (
        <div className="flex flex-col gap-5 bg-black text-white rounded-xl p-8 w-full transition-all hover:cursor-pointer hover:scale-95">
            <div className="flex flex-row justify-between gap-10">
                <h2 className="font-bold">{goalsName}</h2>
                <h3>{goalsTarget}</h3>
            </div>
            <div className="flex flex-row justify-between gap-10">
                <h2>{goalsCurrent}</h2>
                <h3>{goalsTarget}</h3>
            </div>
            <ProgressBar />
        </div>
    )
}