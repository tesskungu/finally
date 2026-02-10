import { Palette } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const scrollToDemo = () => {
    const demoSection = document.getElementById("fabric-previewer");
    demoSection?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">FabricViz</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-gray-300 hover:text-white transition-colors"
          >
            FAQ
          </button>
        </div>

        {/* CTA Button */}
        <Button
          onClick={scrollToDemo}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6"
        >
          Try Now
        </Button>
      </div>
    </nav>
  );
}
