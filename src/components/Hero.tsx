import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
    "/7.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const scrollToDemo = () => {
    const demoSection = document.getElementById("fabric-previewer");
    demoSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen bg-black text-white flex items-center justify-center px-4 overflow-hidden">
      <div className="container mx-auto max-w-[90%] text-center w-full flex flex-col items-center justify-center">
        {/* Welcome Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-4">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span className="text-sm text-gray-300">Welcome to FabricViz</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Visualize Fabrics{" "}
          <span className="text-orange-500">
            In
            <br className="md:hidden" /> Real Time
          </span>
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
          Upload your fabric design and instantly see how it looks on T-shirts,
          furniture, bedsheets, and more.
        </p>

        {/* Try Now Button */}
        <Button
          onClick={scrollToDemo}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-full mb-16"
        >
          Try Now
        </Button>

        {/* Hero Carousel */}
        <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
          <div className="relative w-full aspect-video bg-gray-900 max-h-64">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Fabric preview ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
