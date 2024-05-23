import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate("/signin", { replace: true });
  };

  return (
    <div className="fixed top-0 left-0 h-full w-full bg-white z-[60]">
      <div className="lg:w-2/5 w-full fixed top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] p-8 bg-white rounded-lg">
        <div className="text-center text-3xl">😯</div>
        <div className="font-medium lg:text-xl text-base text-center text-red-500 mt-3 mb-5">
          Unauthorized user, Sign in to create survey
        </div>
        <button
          onClick={navigateHandler}
          className="block text-center w-4/5 mx-auto bg-black py-3 outline-none text-white text-base font-medium mt-4 rounded-lg"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
