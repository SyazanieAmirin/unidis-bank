import Header from "../../Components/Global/Header"
import DuitNowQrImage from "../../assets/duitnowqr.jpg"

export default function DuitNow() {
    return (
        <div className="min-h-screen flex flex-col items-center py-5">
            <Header current_page="DuitNow (QR)" />
            <h1 className="mt-10 font-bold">This is your DuitNow (QR). Please save it and send to others to start receiving money!</h1>
            <img src={DuitNowQrImage} alt="DuitNow QR" className="mt-8 h-[10%] w-[10%]" />
        </div>
    )
}