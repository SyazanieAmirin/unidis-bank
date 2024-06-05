export default function ProgressBar({ currentValue, maxValue }) {
    const percentage = (currentValue / maxValue) * 100;

    return (
        <div>
            <div className="w-full h-3 bg-white rounded-full">
                <div
                    className="h-3 bg-blue-600 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
