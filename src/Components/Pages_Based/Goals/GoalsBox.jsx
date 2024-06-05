import ProgressBar from "../../Global/ProgressBar"

export default function GoalsBox({ goalsName, goalsTarget, goalsCurrent }) {
    return (
        <div className="flex flex-col gap-5 bg-black text-white rounded-xl p-8 w-full transition-all hover:cursor-pointer hover:scale-95">
            <div className="flex flex-row justify-between gap-10">
                <h2 className="font-bold text-lg">{goalsName}</h2>
            </div>
            <div className="flex flex-row justify-between gap-10">
                <h2 className="font-bold">RM{goalsCurrent.toFixed(2)}</h2>
                <h3 className="font-bold">RM{goalsTarget.toFixed(2)}</h3>
            </div>
            <ProgressBar currentValue={goalsCurrent} maxValue={goalsTarget} />
        </div>
    )
}
