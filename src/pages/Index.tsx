import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Layers } from "lucide-react";
import { ControlPanel } from "@/components/ControlPanel";
import { FabricSelector } from "@/components/FabricSelector";
import { MockupSelector } from "@/components/MockupSelector";
import { FabricCanvas } from "@/components/FabricCanvas";
import { OverlayManager } from "@/components/OverlayManager";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { mockups, fabrics } from "@/data/mockups";
import type {
  FabricSettings,
  ProductMockup,
  FabricTexture,
  DesignOverlay,
} from "@/types/fabric";
import { defaultFabricSettings } from "@/types/fabric";
import { toast } from "sonner";

const Index = () => {
  const [selectedMockup, setSelectedMockup] = useState<ProductMockup | null>(
    mockups[0],
  );
  const [selectedFabric, setSelectedFabric] = useState<FabricTexture | null>(
    fabrics[0],
  );
  const [settings, setSettings] = useState<FabricSettings>(
    defaultFabricSettings,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = useCallback(() => {
    const sourceCanvas = canvasRef.current;
    if (!sourceCanvas || !selectedMockup) return;

    // Create a new canvas at exactly 1080x1080
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1080;
    exportCanvas.height = 1080;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Fill with background color
    ctx.fillStyle = settings.backgroundColor || "white";
    ctx.fillRect(0, 0, 1080, 1080);

    // Draw the source canvas centered and scaled to fit
    const scale = Math.min(
      1080 / sourceCanvas.width,
      1080 / sourceCanvas.height,
    );
    const scaledWidth = sourceCanvas.width * scale;
    const scaledHeight = sourceCanvas.height * scale;
    const offsetX = (1080 - scaledWidth) / 2;
    const offsetY = (1080 - scaledHeight) / 2;

    ctx.drawImage(sourceCanvas, offsetX, offsetY, scaledWidth, scaledHeight);

    // Download the image
    const link = document.createElement("a");
    link.download = `fabric-preview-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
    toast.success("Image downloaded successfully!");
  }, [selectedMockup, settings.backgroundColor]);

  const handleUploadFabric = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const customFabric: FabricTexture = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          src,
          thumbnail: src,
        };
        setSelectedFabric(customFabric);
        toast.success("Custom fabric uploaded!");
      };
      reader.readAsDataURL(file);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [],
  );

  const handleReset = useCallback(() => {
    setSettings(defaultFabricSettings);
    toast.info("Settings reset to defaults");
  }, []);

  const handleAddOverlay = useCallback(
    (src: string) => {
      if (settings.overlays.length >= 3) {
        toast.error("Maximum 3 designs allowed");
        return;
      }

      const newOverlay: DesignOverlay = {
        id: `overlay-${Date.now()}`,
        src,
        x: 0,
        y: 0,
        scale: 1,
      };

      setSettings((prev) => ({
        ...prev,
        overlays: [...prev.overlays, newOverlay],
      }));
      toast.success("Design added!");
    },
    [settings.overlays.length],
  );

  const handleUpdateOverlay = useCallback(
    (id: string, updates: Partial<DesignOverlay>) => {
      setSettings((prev) => ({
        ...prev,
        overlays: prev.overlays.map((overlay) =>
          overlay.id === id ? { ...overlay, ...updates } : overlay,
        ),
      }));
    },
    [],
  );

  const handleRemoveOverlay = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      overlays: prev.overlays.filter((overlay) => overlay.id !== id),
    }));
    toast.info("Design removed");
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Fabric Previewer Section */}
      <div id="fabric-previewer" className="min-h-screen bg-black py-8">
        {/* Title and Subtitle */}
        <div className="container px-4 mb-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Fabric Visualizer
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Upload your fabric and apply it to products in real-time with full
              control
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 min-h-[calc(100vh-10rem)]">
            {/* Canvas Area */}
            <div className="panel overflow-hidden relative min-h-[400px] lg:min-h-0">
              <FabricCanvas
                mockup={selectedMockup}
                fabric={selectedFabric}
                settings={settings}
                canvasRef={canvasRef}
              />
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-thin lg:max-h-full">
              {/* Action Buttons */}
              <div className="panel p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadFabric}
                  className="hidden"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-gray-700 bg-white text-black hover:bg-white hover:scale-[1.02] transition-transform w-full"
                  >
                    <Upload className="w-4 h-4 mr-1.5" />
                    Upload
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={!selectedMockup}
                    className="bg-orange-500 hover:bg-orange-600 w-full"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Download
                  </Button>
                </div>
              </div>

              <MockupSelector
                mockups={mockups}
                selectedMockup={selectedMockup}
                onSelect={setSelectedMockup}
              />

              <FabricSelector
                fabrics={fabrics}
                selectedFabric={selectedFabric}
                onSelect={setSelectedFabric}
              />

              <ControlPanel
                settings={settings}
                onSettingsChange={setSettings}
                onReset={handleReset}
              />

              <OverlayManager
                overlays={settings.overlays}
                onAdd={handleAddOverlay}
                onUpdate={handleUpdateOverlay}
                onRemove={handleRemoveOverlay}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
