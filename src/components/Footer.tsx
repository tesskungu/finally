import { Zap } from "lucide-react";

export function Footer() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {/* Left Column */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold">FabricViz</span>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-8 max-w-md">
              Transform fabric selection with advanced visualization technology.
              Upload images, preview them on products, and fine-tune settings in
              real-time.
            </p>
          </div>

          {/* Right Column - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-400 hover:text-white transition-colors text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("fabric-previewer")}
                className="text-gray-400 hover:text-white transition-colors text-left"
              >
                Demo
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-gray-400 hover:text-white transition-colors text-left"
              >
                About
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2026 FabricViz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
