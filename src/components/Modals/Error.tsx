import { useNavigate } from "react-router-dom";

interface IError {
    message: string
}

const Error = (Props: IError) => {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="fixed top-0 left-0 h-full w-full bg-white z-[60]">
      <div className="lg:w-2/5 w-full fixed top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] p-8 bg-white rounded-lg">
        <div className="text-center text-3xl">😯</div>
        <div className="font-medium lg:text-xl text-base text-center text-red-500 mt-3 mb-5">
          {Props.message}.....
        </div>
        <button
          onClick={navigateHome}
          className="block text-center w-4/5 mx-auto bg-black py-3 outline-none text-white text-base font-medium mt-4 rounded-lg"
        >
          Go home
        </button>
      </div>
    </div>
  );
};

export default Error;
