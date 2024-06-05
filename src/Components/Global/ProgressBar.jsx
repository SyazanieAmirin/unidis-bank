export default function ProgressBar({ currentValue, maxValue }) {
    return (
        <div>
            <div className="w-full h-3 bg-white rounded-full">
                <div className="h-3 bg-blue-600 rounded-full w-1/2"></div>
            </div>
        </div>
    )
}