import { Link } from "react-router-dom";

import LoginRegisterHeader from "../../Components/Pages_Based/Login_Register/LoginRegisterHeader";

import InputField from "../../Components/Global/InputField";
import MediumButton from "../../Components/Global/MediumButton";

export default function Register() {
    return (
        <div class="flex flex-col gap-10 items-center">
            <LoginRegisterHeader />

            {/* Login Form */}
            <div class="w-full max-w-[1200px] flex flex-col items-center">

                <h1 class="w-full text-center font-bold text-2xl">Register</h1>

                <InputField isShowTitle={true} title="Username" placeholder="Input your username here" type="text" />
                <InputField isShowTitle={true} title="Password" placeholder="Input your password here" type="password" />
                <InputField isShowTitle={true} title="Confirm Password" placeholder="Type again your password" type="password" />

                <p class="my-14">Already have an account? <Link to={"/"}><span class="text-blue-600 font-bold hover:cursor-pointer">Please click here</span></Link></p>
                <MediumButton text="Register" />
            </div>

        </div>
    )
}