export default function FiveRecentTransactions({ title }) {
    return (
        <div class="bg-black h-auto w-1/2 rounded-md flex flex-col px-7 py-4 gap-3">
            <h1 class="font-bold text-white">{title}</h1>
            <div class="flex flex-row justify-between text-white px-5">
                <p>TRANSFER to AINA ANYSSA'</p>
                <div class="flex flex-row justify-between text-white gap-3">
                    <p>RM 5.20</p>
                    <p>27 January, 2024</p>
                </div>
            </div>
            <div class="flex flex-row justify-between text-white px-5">
                <p>TRANSFER to AFIQAH KAMAL</p>
                <div class="flex flex-row justify-between text-white gap-3">
                    <p>RM 5.20</p>
                    <p>27 January, 2024</p>
                </div>
            </div>
        </div>
    )
}