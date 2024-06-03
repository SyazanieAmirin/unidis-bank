import React from 'react';

export default function InputField({ placeholder, isShowTitle, title, type, value, onChange, limitMax, limitMin }) {
    const isDisabled = type === 'disabled';

    // Handle the onChange event to enforce the limitMax and limitMin constraints
    const handleChange = (e) => {
        let newValue = e.target.value;

        // If limitMax is defined, ensure the value does not exceed it
        if (limitMax !== undefined && newValue.length > limitMax) {
            newValue = newValue.slice(0, limitMax);
        }

        // If limitMin is defined, ensure the value is not less than it
        if (limitMin !== undefined && newValue.length < limitMin) {
            newValue = newValue.padEnd(limitMin, ' '); // Pad with spaces to meet the minimum length
        }

        onChange({ ...e, target: { ...e.target, value: newValue } });
    };

    return (
        <div className="flex flex-col gap-2 my-5 w-1/2">
            {isShowTitle && <p className={`text-lg font-bold ${isDisabled ? 'opacity-40' : ''}`}>{title}</p>}
            <input
                className={`w-full h-12 border-none rounded-md px-4 ${isDisabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-65' : 'bg-black text-white'}`}
                placeholder={placeholder}
                type={isDisabled ? 'text' : type} // Set type to 'text' if disabled
                value={value}
                onChange={handleChange}
                disabled={isDisabled}
            />
        </div>
    );
}
