import "boxicons/css/boxicons.min.css";
import Aboutus from "./Aboutus";
import { useState } from "react";
import AuthModal from "./AuthModal";

const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.remove("hidden");
    } else {
      mobileMenu.classList.add("hidden");
    }
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="flex justify-end items-center py-4 px-4 lg:px-20">
        <h1
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
          className="text-3xl md:text-4xl lg:5xl font-light m-0"
        ></h1>
        <nav className="hidden md:flex items-center gap-12 ml-auto">
         
          <a
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration="1500"
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
            href="#Features"
          >
            FEATURES
          </a>
          <a
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration="2000"
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
            href="#ContactUs"
          >
            CONTACT US
          </a>
        
        </nav>
        <button 
          onClick={handleSignInClick}
          className="hidden md:block bg-[#a7a7a7] text-black py-3 px-8 rounded-full border-none font-medium transitions-all dutration-500 hover:bg-white cursor-pointer z-50 ml-4"
        >
          SignIn
        </button>
      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-3xl p-2  z-50"
      >
        <i className="bx  bx-menu"></i>
      </button>
      <div
        id="mobileMenu"
        className="hidden fixed top-16 bottom-0 right-0 left-0 p-5 md:hidden z-40 bg-black bg-opacity-70 backdrop-blur-md"
      >
        <nav className="flex flex-col gap-6 items-center">
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
            href="#"
          >
            About Us
          </a>
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
            href="#"
          >
            Features
          </a>
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
            href="#"
          >
            Company
          </a>
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
            href="#"
          >
            Resources
          </a>
        </nav>
      </div>
    </header>
    <AuthModal 
      isOpen={authModalOpen} 
      onClose={() => setAuthModalOpen(false)} 
      initialMode={authMode}
    />
    </>
  );
};

export default Header;
