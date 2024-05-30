import React from 'react';

export default function InputField({ placeholder, isShowTitle, title, type, value, onChange }) {
    return (
        <div className="flex flex-col gap-2 my-5 w-1/2">
            {isShowTitle && <p className="text-lg font-bold">{title}</p>}
            <input
                className="w-full h-12 border-none bg-black text-white rounded-md px-4"
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
