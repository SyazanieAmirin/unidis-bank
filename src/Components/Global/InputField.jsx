export default function InputField({ placeholder, isShowTitle, title, type }) {

    return (
        <>
            <div class="flex flex-col gap-2 my-5 w-1/2">
                {isShowTitle && <p className="text-lg font-bold">{title}</p>}
                <input class="w-full h-12 border-none bg-black text-white rounded-md px-4" placeholder={placeholder} type={type} />
            </div>
        </>
    )
}