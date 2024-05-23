import { Link } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

const Home = () => {
  return (
    <>
      <NavBar />
      <section className="relative hero-bg inset-0 h-screen w-full bg-[#0B1120] text-white bg-[size:60px_60px]">
        <div className="lg:px-28 sm:px-8 px-4 lg:py-36 py-36 gap-8">
          <div className="lg:w-3/5 w-full mx-auto lg:mt-24 mt-16 text-center">
            <h1 className="lg:text-5xl text-4xl font-black text-white">
              Create Survey forms with ease!
            </h1>
            <h2 className="lg:text-lg text-lg text-[#C3C3C3] font-normal mt-8 mb-12 lg:w-4/5 w-full mx-auto">
              Sign up and start using{" "}
              <span className="underline decoration-wavy">norw forms</span> to
              experience form creation process that delights you.
            </h2>
            <Link
              to="/create"
              className="text-white py-4 xl:px-8 lg:px-8 px-10 shadow-[4px_4px_0px_0px_#fff] rounded-full bg-[#0B1120] hover:shadow-[2px_2px_0px_0px_#94a3b8] transition-all duration-150 border-[1px] border-white"
            >
              try now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
