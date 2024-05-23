/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStoreAuth from "../store/features/auth";
import Loader from "../components/Loader/Loader";

type UserInput = {
  email: string;
  password: string;
};

interface MyStore {
  user: any[];
  loading: boolean;
  error: string | null;
  success: boolean;
  signUpWithEmailAndPassword: (payload: UserInput | any) => Promise<any>;
  cleanUpSuccessfulData: () => void;
}

const Signup = () => {
  const {
    loading,
    error,
    success,
    signUpWithEmailAndPassword,
    cleanUpSuccessfulData,
  } = useStoreAuth() as MyStore;

  const navigate = useNavigate();

  const userInput: UserInput = {
    email: "",
    password: "",
  };

  const [input, setInput] = useState(userInput);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const onChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (evt: FormEvent) => {
    evt.preventDefault();

    signUpWithEmailAndPassword(input);
  };

  useEffect(() => {
    if (success) {
      navigate("/dashboard", { replace: true });
    }
    return () => {
      cleanUpSuccessfulData();
    };
  }, [success, navigate, cleanUpSuccessfulData]);

  return (
    <>
      {loading && <Loader />}

      <section className="lg:px-16 sm:px-8 px-4 lg:py-24 py-24">
        <form
          onSubmit={submitHandler}
          className="lg:w-[44%] sm:w-[4/5] w-5/5 mx-auto sm:p-6 p-0 rounded-md mb-8"
        >
          <h1 className="text-center lg:text-2xl text-2xl font-semibold mb-5">
            Sign Up
          </h1>

          <div className="text-sm text-center text-red-400">{error}</div>
          <div className="mt-5">
            <input
              type="text"
              name="email"
              value={input.email}
              onChange={onChangeHandler}
              className="block w-full mt-1 outline-none border-[1px] bg-[#F3F7FE] border-[#D4DCF1] focus:border-[#0B1120] px-4 lg:py-[0.6rem] py-3 rounded-md placeholder:text-black placeholder:font-medium placeholder:text-base"
              placeholder="E-mail address"
              required
            />
          </div>
          <div className="relative mt-5">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              value={input.password}
              onChange={onChangeHandler}
              className="block w-full mt-1 outline-none border-[1px] bg-[#F3F7FE] border-[#D4DCF1] focus:border-[#0B1120] px-4 lg:py-[0.6rem] py-3 rounded-md placeholder:text-black placeholder:font-medium placeholder:text-base"
              placeholder="Password"
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center px-4 z-10 text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 stroke-[#0D2159] dark:stroke-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="dark:[&>path]:fill-[#BACAF5]"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 2.08325C7.31486 2.08325 6.65778 2.35542 6.17331 2.83989C5.68884 3.32436 5.41667 3.98144 5.41667 4.66659V6.58325H10.5833V4.66659C10.5833 3.98144 10.3112 3.32436 9.82669 2.83989C9.34222 2.35542 8.68514 2.08325 8 2.08325ZM12.0833 6.58325V4.66659C12.0833 3.58362 11.6531 2.54501 10.8874 1.77923C10.1216 1.01346 9.08297 0.583252 8 0.583252C6.91703 0.583252 5.87842 1.01346 5.11265 1.77923C4.34687 2.54501 3.91667 3.58362 3.91667 4.66659V6.58325H3.33333C2.18274 6.58325 1.25 7.51599 1.25 8.66659V13.3333C1.25 14.4838 2.18274 15.4166 3.33333 15.4166H12.6667C13.8173 15.4166 14.75 14.4838 14.75 13.3333V8.66659C14.75 7.51599 13.8173 6.58325 12.6667 6.58325H12.0833ZM3.33333 8.08325C3.01117 8.08325 2.75 8.34442 2.75 8.66659V13.3333C2.75 13.6554 3.01117 13.9166 3.33333 13.9166H12.6667C12.9888 13.9166 13.25 13.6554 13.25 13.3333V8.66659C13.25 8.34442 12.9888 8.08325 12.6667 8.08325H3.33333Z"
                    fill="#0D2159"
                  />
                </svg>
              )}
            </div>
          </div>

          <button
            disabled={loading}
            className={`w-full bg-[#0B1120] py-3 outline-none text-white text-base uppercase font-medium mt-6 mb-3 rounded-lg ${
              loading && "bg-[#3366FF]/35"
            }`}
          >
            Sign up
          </button>

          <div className="my-3 flex flex-row items-center justify-center gap-2">
            <div className="w-[30%] h-[2px] bg-[#0B1120]/35"></div>
            <div className="text-sm text-black dark:text-[#FBFAFC] font-semibold">
              Or
            </div>
            <div className="w-[30%] h-[2px] bg-[#0B1120]/35"></div>
          </div>

          <div className="w-full grid place-content-center text-base text-start mt-6">
            <div className="flex flex-row flex-wrap items-center justify-center space-x-2">
              <div className="text-black">Already have an account?</div>
              <Link
                to="/signin"
                className="font-medium text-[#4f6aad] underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Signup;
