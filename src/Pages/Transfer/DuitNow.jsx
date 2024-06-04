import Header from "../../Components/Global/Header"
import DuitNowQrImage from "../../assets/duitnowqr.jpg"

export default function DuitNow() {
    return (
        <div className="min-h-screen flex flex-col items-center py-5">
            <Header current_page="DuitNow (QR)" />
            <img src={DuitNowQrImage} alt="DuitNow QR" className="mt-10 h-[10%] w-[10%]" />
        </div>
    )
}