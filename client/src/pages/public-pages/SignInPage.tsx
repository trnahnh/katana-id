import logo from "/logo.svg";
import { SignInForm } from "@/components/signin/SignInForm"

const SignInPage = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-25 md:mt-50 mx-10 md:mx-0">
      <div className="flex flex-col items-center gap-1 text-center mb-4">
        <img src={logo} className="w-20" />
        <h1 className="text-2xl font-bold pt-5">Sign in to KatanaID</h1>
      </div>
      <SignInForm />
    </div>
  )
}

export default SignInPage