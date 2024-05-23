import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const menu = useRef<HTMLDivElement>(null);
  const navItem = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuHandler = () => {
    menu.current?.classList.toggle("hamburger-toggle");
    navItem.current?.classList.toggle("hidden");
    document.body.classList.toggle("overflow-hidden");
  };

  const toggleMenuHandler = () => {
    menu.current?.classList.toggle("hamburger-toggle");
    navItem.current?.classList.toggle("hidden");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`text-white backdrop-blur-md bg-[#0B1120] border-[1px] border-slate-50 grid grid-cols-8 xl:gap-6 lg:h-[4.7rem] h-14 lg:items-center fixed lg:top-5 top-5 left-[50%] -translate-x-[50%] z-30 lg:px-8 sm:px-8 px-6 sm:w-4/5 lg:w-[88%] xl:w-[84%] 2xl:w-3/5 w-[93%] mx-auto rounded-full  ${
        isScrolled ? "bg-[#0B1120]" : ""
      }`}
    >
      <div className="bg-[#0B1120] lg:col-span-1 xl:col-span-2 col-span-2">
        <a
          href="/"
          className="lg:relative lg:-translate-y-[0.1rem] lg:top-0 lg:left-0 fixed top-3 left-4 flex flex-row items-center sm:gap-1 xl:gap-1 lg:gap-0 lg:text-3xl text-xl font-bold"
        >
          norw survey
        </a>
      </div>
      <div
        ref={navItem}
        className="bg-[#0B1120] xl:col-span-6 lg:col-span-7 col-span-8 lg:grid grid-cols-6 hidden lg:relative lg:top-0 lg:left-0 fixed -top-2 left-0 lg:h-16 h-[100vh] w-full z-20 lg:px-0 px-6 font-normal overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        <ul className="col-span-4 flex lg:flex-row flex-col lg:items-center items-start justify-center text-base lg:space-y-0 space-y-5 lg:mt-0 mt-10 text-[#DDDDDD]">
          <li>
            <a href="" className="py-2 lg:px-4 px-2 lg:mx-3">
              Use cases
            </a>
          </li>

          <li>
            <a href="" className="py-2 lg:px-4 px-2 lg:mx-3">
              Features
            </a>
          </li>
        </ul>
        <div className="col-span-2 flex flex-row lg:items-center items-center lg:justify-end justify-center lg:mt-0 mt-6 lg:mb-1 mb-8 mr-2">
          <Link
            onClick={toggleMenuHandler}
            to="/signup"
            className="text-white py-3 xl:px-8 lg:px-4 px-8 shadow-[4px_4px_0px_0px_#fff] rounded-full bg-[#0B1120] hover:shadow-[2px_2px_0px_0px_#94a3b8] transition-all duration-150 border-[1px] border-white"
          >
            Sign up
          </Link>
        </div>
      </div>

      <div ref={menu} className="lg:hidden block">
        <div
          onClick={menuHandler}
          className="fixed top-7 right-5 w-8 h-[2px] bg-white rounded-full before:w-8 before:h-[2px] before:bg-white before:rounded-full before:content-[''] before:absolute before:-translate-y-2 before:transition-all before:duration-150 after:w-8 after:h-[2px] after:bg-white after:rounded-full after:content-[''] after:absolute after:translate-y-2 after:transition-all after:duration-150 z-40"
        ></div>
      </div>
    </nav>
  );
};

export default NavBar;
