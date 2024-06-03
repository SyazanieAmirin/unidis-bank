import React from 'react';

export default function InputField({ placeholder, isShowTitle, title, type, value, onChange }) {
    const isDisabled = type === 'disabled';

    return (
        <div className="flex flex-col gap-2 my-5 w-1/2">
            {isShowTitle && <p className={`text-lg font-bold ${isDisabled ? 'opacity-40' : ''}`}>{title}</p>}
            <input
                className={`w-full h-12 border-none rounded-md px-4 ${isDisabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-65' : 'bg-black text-white'}`}
                placeholder={placeholder}
                type={isDisabled ? 'text' : type} // Set type to 'text' if disabled
                value={value}
                onChange={onChange}
                disabled={isDisabled}
            />
        </div>
    );
}
