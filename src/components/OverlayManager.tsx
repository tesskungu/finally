import { useRef } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { X, Plus } from "lucide-react";
import type { DesignOverlay } from "@/types/fabric";

interface OverlayManagerProps {
  overlays: DesignOverlay[];
  onAdd: (src: string) => void;
  onUpdate: (id: string, updates: Partial<DesignOverlay>) => void;
  onRemove: (id: string) => void;
}

export function OverlayManager({
  overlays,
  onAdd,
  onUpdate,
  onRemove,
}: OverlayManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      onAdd(src);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="panel p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Design Overlays ({overlays.length}/3)
        </h3>
        {overlays.length < 3 && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-8"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Design
            </Button>
          </>
        )}
      </div>

      {overlays.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Add logos or designs to overlay on your fabric
        </p>
      )}

      {overlays.map((overlay, index) => (
        <div
          key={overlay.id}
          className="border border-border rounded-lg p-3 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Design {index + 1}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(overlay.id)}
              className="h-7 w-7 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Preview */}
          <div className="w-full h-12 bg-gray-100 rounded flex items-center justify-center">
            <img
              src={overlay.src}
              alt={`Design ${index + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* X Position */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">X Position</Label>
              <Input
                type="number"
                value={overlay.x}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    onUpdate(overlay.id, { x: value });
                  }
                }}
                min="-500"
                max="500"
                step="1"
                className="w-20 h-7 text-xs"
              />
            </div>
            <Slider
              value={[overlay.x]}
              onValueChange={([value]) => onUpdate(overlay.id, { x: value })}
              min={-500}
              max={500}
              step={1}
              className="w-full"
            />
          </div>

          {/* Y Position */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Y Position</Label>
              <Input
                type="number"
                value={overlay.y}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    onUpdate(overlay.id, { y: value });
                  }
                }}
                min="-500"
                max="500"
                step="1"
                className="w-20 h-7 text-xs"
              />
            </div>
            <Slider
              value={[overlay.y]}
              onValueChange={([value]) => onUpdate(overlay.id, { y: value })}
              min={-500}
              max={500}
              step={1}
              className="w-full"
            />
          </div>

          {/* Scale */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Scale</Label>
              <Input
                type="number"
                value={overlay.scale.toFixed(2)}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0.01 && value <= 3) {
                    onUpdate(overlay.id, { scale: value });
                  }
                }}
                min="0.01"
                max="3"
                step="0.01"
                className="w-20 h-7 text-xs"
              />
            </div>
            <Slider
              value={[overlay.scale]}
              onValueChange={([value]) =>
                onUpdate(overlay.id, { scale: value })
              }
              min={0.01}
              max={3}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
