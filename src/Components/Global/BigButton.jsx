export default function BigButton({ title, onClick }) {
    return (
        <button className="bg-black text-white w-1/2 h-16 rounded-full font-bold transition-all hover:scale-95" onClick={onClick}>
            {title}
        </button>
    );
}