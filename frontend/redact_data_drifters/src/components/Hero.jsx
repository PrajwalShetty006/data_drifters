import Spline from "@splinetool/react-spline";
import { useState } from "react";
import AuthModal from "./AuthModal";

const Hero = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    setAuthModalOpen(true);
  };

  return (
    <>
      <main className="flex lg:mt-20 flex-col lg:flex-row items-center justify-between min-h-[calc(90vh-6rem)] relative overflow-hidden">
        <div
          data-aos="fade-right"
          data-aos-offset="300"
          data-aos-easing="ease-in-sine"
          className="max-w-xl ml-[5%] z-20 mt-[90%] md:mt-[50%] lg:mt-[-2rem] relative"
        >
          <div className="relative w-[95%] sm:w-48 h-10 bg-gradient-to-r from-[#0102d4] to-[#0102d4] shadow-[0_0_15px_rgba(255,255,0.4)] rounded-full ">
            <div className="absolute inset-[3px] bg-black rounded-full flex items-center justify-center gap-1">
              <i className="bx  bx-diamond"></i>
              INTRODUCING
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider my-6">
            CHAIN FORECAST
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold tracking-wider my-6">
            Smarter Insights. Stronger Loyalty.
          </h2>
          <p className="text-base sm:text-lg tracking-wider text-gray-400 max-w-[25rem] lg:max-w-[30rem]">
            RetailMind transforms raw retail transactions into powerful sales
            predictions and customer intelligence. Its AI engine forecasts demand
            with precision and identifies top customer segments like VIPs and
            churn risks. A dynamic dashboard visualizes trends, segments, and
            recommendations instantly. Blockchain-based hashing ensures all
            insights are transparent, auditable, and trustworthy.
          </p>
          <div className="flex  mt-12">
            <a
              onClick={handleGetStartedClick}
              className="border border-[#2a2a2a] py-2 sm:py-3 px-8 sm;px-10 rounded-full sm:text-lg text_sm font-semibold tracking-wieder transition-all duration-300 hover:bg-black bg-gray-300 text-black hover:text-white flex gap-2 justify-center items-center"
              href="#"
            >
              GetStarted
              <i className="bx  bx-link-external"></i>
            </a>
          </div>
        </div>
        <Spline
          data-aos="fade-zoom-in"
          data-aos-easing="ease-in-back"
          data-aos-delay="300"
          data-aos-offset="0"
          data-aos-duration="3000"
          className="absolute lg:top-0 top-[-20%] bottom-0 lg:left-[25%] sm:left-[-2%] h-full  "
          scene="https://prod.spline.design/mukxe6b-LpsAUHnD/scene.splinecode"
        />
      </main>
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode="signup"
      />
    </>
  );
};

export default Hero;
