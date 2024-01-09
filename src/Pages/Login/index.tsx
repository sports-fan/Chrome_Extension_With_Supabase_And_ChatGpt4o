import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import FormLine from "../../components/FormLine";
import { Button } from "../../components/GeneralButton";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginInterface {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
}

const Login = ({ setIsLoggedIn }: LoginInterface) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('')

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>({});

  const handleSignIn = useCallback(
    (data: LoginFormData) => {
      try {
        setIsSubmitting(true);
        const { email, password } = data;
        chrome.runtime.sendMessage(
          {
            action: "loginWithEmailPassword",
            email,
            password,
          },
          (response) => {
            if (response.error) {
              console.log("response.error", response.error);
              setErrorMsg(response.error)
              setIsSubmitting(false);
            } else {
              console.log("response", response);
              if (response){
                // Kazuo: please have some notification system
                // so that when the password is wrong or anything
                // that make the response false, show a warning
                setErrorMsg('')
                setIsSubmitting(false);
                setIsLoggedIn(true)
              }else{
                // something is wrong that made the response falses
                setErrorMsg('Invalid login credentials')
                setIsSubmitting(false);
              }
            }
          }
        );
      } catch (ex) {
        console.log(ex, "kkkkkkkk");
      }
    },
    [setIsLoggedIn]
  );

  return (
    <div className=" w-5/6 bg-cream p-8 rounded-lg shadow-md">
      <div className="w-full flex justify-end pb-4">
        <a href="https://0xeden.com/signup" target="_blank" rel="noreferrer" className="text-base">{'Sign up >>'}</a>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-2xl font-bold text-gray-800 mb-2">Welcome to Eden</p>
        <p className="text-lg text-gray-700">Please log in</p>
      </div>
      <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
        <FormLine
          title="Email:"
          id="email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
          placeholder="Your email address here"
          required
          className="w-full p-2 border rounded-lg bg-white focus:border-blue-300 focus:ring focus:ring-blue-200"
        />
        <FormLine
          title="Password:"
          id="password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
          placeholder="Your password here"
          required
          className="w-full p-2 border rounded-lg bg-white focus:border-blue-300 focus:ring focus:ring-blue-200"
        />
        <p className="text-base text-red-700">{errorMsg}</p>
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
