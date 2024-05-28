import { Link } from "react-router-dom";

import LoginRegisterHeader from "../../Components/Pages_Based/Login_Register/LoginRegisterHeader";

import InputField from "../../Components/Global/InputField";
import MediumButton from "../../Components/Global/MediumButton";

export default function Login() {

    return (
        <div class="flex flex-col gap-10 items-center">
            <LoginRegisterHeader />

            {/* Login Form */}
            <div class="w-full max-w-[1200px] flex flex-col items-center">

                <h1 class="w-full text-center font-bold text-2xl">Login</h1>

                <InputField isShowTitle={true} title="Username" placeholder="Input your username here" type="text" />
                <InputField isShowTitle={true} title="Password" placeholder="Input your password here" type="password" />

                <p class="my-14">Do not have an account? <Link to={"/register"}><span class="text-blue-600 font-bold hover:cursor-pointer">Please click here</span></Link></p>
                <MediumButton text="Login" />
            </div>

        </div>
    )
}