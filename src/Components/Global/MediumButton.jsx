export default function MediumButton({ text }) {
    return (
        <button class="w-1/3 h-14 bg-black text-white font-bold py-2 px-4 rounded-full transition-all hover:scale-95">
            {text}
        </button>
    )
}