import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Upload, Save } from "lucide-react";
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
import { LoginModal } from "@/components/LoginModal";
import { mockups, fabrics } from "@/data/mockups";
import type {
  FabricSettings,
  ProductMockup,
  FabricTexture,
  DesignOverlay,
} from "@/types/fabric";
import { defaultFabricSettings } from "@/types/fabric";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const Index = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [designLoaded, setDesignLoaded] = useState(false);
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);

  const loadDesign = useCallback(async (designId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to load design");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/designs/${designId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const design = response.data.design;
      console.log("Loaded design:", design);

      // Load mockup
      const mockup = mockups.find((m) => m.id === design.settings.mockup);
      if (mockup) {
        setSelectedMockup(mockup);
      }

      // Load fabric - check if it's from the fabric list
      const fabricId = design.settings.fabric;
      if (fabricId) {
        const fabric = fabrics.find((f) => f.id === fabricId);
        if (fabric) {
          setSelectedFabric(fabric);
        }
      }

      // Load fabric settings - include all properties from defaultFabricSettings
      setSettings({
        scale: design.settings.scale ?? 1,
        rotation: design.settings.rotation ?? 0,
        offsetX: design.settings.offsetX ?? 0,
        offsetY: design.settings.offsetY ?? 0,
        brightness: design.settings.brightness ?? 1,
        contrast: design.settings.contrast ?? 1,
        backgroundColor: design.settings.backgroundColor ?? "#ffffff",
        productColor: design.settings.productColor ?? null,
        tileX: 1,
        tileY: 1,
        opacity: 1,
        overlays: [],
      });

      // Trigger a re-render by toggling designLoaded
      setDesignLoaded(true);
      setTimeout(() => setDesignLoaded(false), 100);

      // Set current design ID for updating
      setCurrentDesignId(design.id || design._id);

      toast.success("Design loaded!");
    } catch (error) {
      console.error("Failed to load design:", error);
      toast.error("Failed to load design");
    }
  }, []);

  // Load design from URL parameter
  useEffect(() => {
    const designId = searchParams.get("design");
    if (designId) {
      loadDesign(designId);
    } else {
      // Clear current design ID when no design in URL
      setCurrentDesignId(null);
    }
  }, [searchParams, loadDesign]);

  const handleDownload = useCallback(() => {
    const sourceCanvas = canvasRef.current;
    if (!sourceCanvas || !selectedMockup) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1080;
    exportCanvas.height = 1080;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Use white background if no color is set
    ctx.fillStyle = settings.backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, 1080, 1080);

    // Calculate scale to ensure product occupies 80% of the 1080px canvas
    // 80% of 1080 = 864px minimum
    const minSize = 1080 * 0.8;
    const scaleToFit = Math.min(
      1080 / sourceCanvas.width,
      1080 / sourceCanvas.height,
    );
    const scaleToCover =
      minSize / Math.min(sourceCanvas.width, sourceCanvas.height);

    // Use the larger scale to ensure 80% coverage, but cap at fit-to-canvas
    const scale = Math.min(Math.max(scaleToCover, scaleToFit), 1);

    const scaledWidth = sourceCanvas.width * scale;
    const scaledHeight = sourceCanvas.height * scale;
    const offsetX = (1080 - scaledWidth) / 2;
    const offsetY = (1080 - scaledHeight) / 2;

    ctx.drawImage(sourceCanvas, offsetX, offsetY, scaledWidth, scaledHeight);

    const link = document.createElement("a");
    link.download = `fabric-preview-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png", 1.0);
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

  const handleSave = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");

      // Capture thumbnail from canvas
      const sourceCanvas = canvasRef.current;
      let thumbnail = "";
      if (sourceCanvas) {
        const thumbCanvas = document.createElement("canvas");
        thumbCanvas.width = 200;
        thumbCanvas.height = 200;
        const ctx = thumbCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = settings.backgroundColor || "white";
          ctx.fillRect(0, 0, 200, 200);
          const scale = Math.min(
            200 / sourceCanvas.width,
            200 / sourceCanvas.height,
          );
          const scaledWidth = sourceCanvas.width * scale;
          const scaledHeight = sourceCanvas.height * scale;
          const offsetX = (200 - scaledWidth) / 2;
          const offsetY = (200 - scaledHeight) / 2;
          ctx.drawImage(
            sourceCanvas,
            offsetX,
            offsetY,
            scaledWidth,
            scaledHeight,
          );
          thumbnail = thumbCanvas.toDataURL("image/png");
        }
      }

      const designData = {
        name: selectedMockup?.name || "Custom Design",
        settings: {
          fabric: selectedFabric?.id,
          mockup: selectedMockup?.id,
          scale: settings.scale,
          rotation: settings.rotation,
          offsetX: settings.offsetX,
          offsetY: settings.offsetY,
          brightness: settings.brightness,
          contrast: settings.contrast,
          backgroundColor: settings.backgroundColor,
          productColor: settings.productColor,
        },
        thumbnail,
      };

      // If we have a currentDesignId, update the existing design
      // Otherwise, create a new design
      if (currentDesignId) {
        await axios.put(
          `http://localhost:5000/api/designs/${currentDesignId}`,
          designData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success("Design updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/designs", designData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Design saved successfully!");
      }
    } catch (error) {
      toast.error("Failed to save design");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Features />

      <div id="fabric-previewer" className="min-h-screen bg-black py-8">
        <div className="container mx-auto max-w-[90%] px-4 mb-8">
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

        <div className="container mx-auto max-w-[90%]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 min-h-[calc(100vh-10rem)]">
            <div className="panel overflow-hidden relative min-h-[400px] lg:min-h-0">
              <FabricCanvas
                mockup={selectedMockup}
                fabric={selectedFabric}
                settings={settings}
                canvasRef={canvasRef}
              />
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-thin lg:max-h-full">
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
                  <Button
                    onClick={handleSave}
                    disabled={!selectedMockup || isSaving}
                    variant="outline"
                    className="border-gray-700 bg-white text-black hover:bg-white hover:scale-[1.02] transition-transform w-full"
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    {isSaving
                      ? "Saving..."
                      : currentDesignId
                        ? "Update"
                        : "Save"}
                  </Button>
                </div>
              </div>

              <MockupSelector
                mockups={mockups}
                selectedMockup={selectedMockup}
                onSelect={setSelectedMockup}
                disabled={!!currentDesignId}
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

      <FAQ />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleSave}
      />
      <Footer />
    </div>
  );
};

export default Index;
