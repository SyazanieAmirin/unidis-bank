export default function Header({ current_page }) {
    return (
        <div className="w-full max-w-[1200px] flex flex-row justify-between items-center px-4">
            <h2 className="font-bold text-3xl">{current_page}</h2>
            <div className="flex flex-row gap-14 items-center">
                <a href="/user-dashboard"><h3 className="transition-all hover:text-black/60 cursor-pointer text-black">Home</h3></a>
                <a href="/account-summary"><h3 className="transition-all hover:text-black/60 cursor-pointer text-black">Account Summary</h3></a>
                <a href="/transfer"><h3 className="transition-all hover:text-black/60 cursor-pointer text-black">Transfer</h3></a>
                <a href="/goals"><h3 className="transition-all hover:text-black/60 cursor-pointer text-black">Goals</h3></a>
                <a href="/statistics"><h3 className="transition-all hover:text-black/60 cursor-pointer text-black">Statistics</h3></a>
                <a href="/"><h3 className="transition-all border-none rounded-md bg-red-500 text-white px-2 py-1 hover:scale-90 cursor-pointer">Log Out</h3></a>
            </div>
        </div>
    )
}