import Hero from "../components/Hero";
import Header from "../components/Header";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import One from '../components/One'
import Test from '../components/Test'
import ContactUs from '../components/ContactUs'

export default function LandingPage() {
  useEffect(() => {
    AOS.init({ duration: 1500, once: false });
  });
  return (
    <main className="overflow-x-hidden relative">
      {/* Blue light effect - gradient from top-right to bottom-left, merging seamlessly with One section */}
      <div 
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '300vh',
          background: 'linear-gradient(210deg, rgba(1, 2, 212, 0.6) 0%, rgba(1, 2, 212, 0.4) 20%, rgba(1, 2, 212, 0.25) 40%, rgba(1, 2, 212, 0.15) 60%, rgba(1, 2, 212, 0.08) 80%, rgba(0, 0, 0, 0.3) 100%)',
          zIndex: 0,
        }}
      ></div>
      <img
        className="absolute top-0 right-0 opacity-100 -z-10"
        src="/gradient.png"
        alt="gradient-img"
      />
      <img
        className="absolute top-0 left-0 opacity-100 -z-10"
        src="/gradient.png"
        alt="gradient-img"
      />
      <Header />
      <Hero />
      <One></One>
      <div className="relative z-10 bg-black">
        <ContactUs></ContactUs>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 bg-black py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <p className="text-gray-400 text-sm md:text-base">
            Made with <span className="text-red-500">❤️</span> by Harsh Jai Prajwal Krish
          </p>
          <div className="powered-by-box inline-block border border-gray-400 px-4 py-2 rounded">
            <p className="text-gray-300 text-xs md:text-sm">
              Powered by Data Drifters
            </p>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            .powered-by-box {
              animation: floatBox 3s ease-in-out infinite;
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.3),
                          0 0 40px rgba(59, 130, 246, 0.4),
                          0 0 60px rgba(59, 130, 246, 0.2);
              background: rgba(0, 0, 0, 0.3);
              backdrop-filter: blur(10px);
            }
            
            @keyframes floatBox {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
            }
          `}}></style>
        </div>
      </footer>
    </main>
  );
}

