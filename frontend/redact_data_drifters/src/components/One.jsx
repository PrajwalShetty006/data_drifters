import React, { useState } from "react";

export default function StickyBoxSection() {
  const [videoErrors, setVideoErrors] = useState({});

  const cardData = [
    {
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      fallbackImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzYzODA4OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Real-time Analytics Dashboard",
      description: "Monitor your retail performance with live data visualization. Track sales, inventory, and customer behavior in real-time with intuitive dashboards that update instantly."
    },
    {
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      fallbackImage: "https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0c3xlbnwxfHx8fDE3NjM3MzAyMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Data Visualization & Insights",
      description: "Transform complex data into clear, actionable insights. Our advanced visualization tools help you understand trends, patterns, and opportunities in your retail data."
    },
    {
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      fallbackImage: "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM3NDk3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "AI-Powered Forecasting",
      description: "Leverage artificial intelligence to predict future sales and demand. Our AI engine analyzes historical data and market trends to provide accurate forecasts and recommendations."
    },
    {
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      fallbackImage: "https://images.unsplash.com/photo-1633307057722-a4740ba0c5d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMGluc2lnaHRzJTIwZ3JhcGh8ZW58MXx8fHwxNzYzODA4OTE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Customer Intelligence",
      description: "Identify and segment your customers with precision. Discover VIP customers, detect churn risks, and understand customer behavior patterns to enhance loyalty and retention."
    },
  ];

  const handleVideoError = (index) => {
    setVideoErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section className="relative min-h-screen pb-10 pt-20 px-4 md:px-8 lg:px-20" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0.6) 60%, #000 100%)' }}>
      <div id="Features" className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        {cardData.map((card, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
              data-aos={isEven ? "fade-right" : "fade-left"}
              data-aos-delay={index * 300}
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
            >
              {/* Video */}
              <div className="feature-video w-full md:w-1/2 h-[300px] md:h-[400px] lg:h-[500px] bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
                {videoErrors[index] ? (
                  <img
                    src={card.fallbackImage}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={card.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => handleVideoError(index)}
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              
              {/* Text Content */}
              <div className="feature-text w-full md:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">
                  {card.title}
                </h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
