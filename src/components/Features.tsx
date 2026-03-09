import { Palette, Zap, Download } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Palette,
      title: "Realistic Previews",
      description:
        "See your fabric designs on various products with realistic rendering and lighting.",
    },
    {
      icon: Zap,
      title: "Instant Visualization",
      description:
        "Upload your design and see real-time previews on multiple mockups instantly.",
    },
    {
      icon: Download,
      title: "Save & Download",
      description:
        "Save your fabric designs securely to your account and download high-quality images anytime.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-black text-white">
      <div className="container mx-auto max-w-[90%]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful <span className="text-orange-500">Features</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to visualize your fabric designs on real
            products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[90%] mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-orange-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
