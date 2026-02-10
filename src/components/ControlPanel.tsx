import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw, Grid3X3, Sun, Palette } from "lucide-react";
import type { FabricSettings } from "@/types/fabric";

interface ControlPanelProps {
  settings: FabricSettings;
  onSettingsChange: (settings: FabricSettings) => void;
  onReset: () => void;
}

export const ControlPanel = ({
  settings,
  onSettingsChange,
  onReset,
}: ControlPanelProps) => {
  const updateSetting = <K extends keyof FabricSettings>(
    key: K,
    value: FabricSettings[K],
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const moveStep = 10; // pixels per arrow click

  const moveUp = () => updateSetting("offsetY", settings.offsetY - moveStep);
  const moveDown = () => updateSetting("offsetY", settings.offsetY + moveStep);
  const moveLeft = () => updateSetting("offsetX", settings.offsetX - moveStep);
  const moveRight = () => updateSetting("offsetX", settings.offsetX + moveStep);

  return (
    <div className="panel p-5 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Fabric Controls</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Transform Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="control-group">
            <div className="flex items-center justify-between">
              <Label className="control-label">Scale</Label>
              <span className="text-xs text-muted-foreground">
                {settings.scale.toFixed(2)}x
              </span>
            </div>
            <Slider
              value={[settings.scale]}
              min={0.1}
              max={3}
              step={0.05}
              onValueChange={([v]) => updateSetting("scale", v)}
            />
          </div>

          <div className="control-group">
            <div className="flex items-center justify-between">
              <Label className="control-label">Rotation</Label>
              <span className="text-xs text-muted-foreground">
                {settings.rotation}°
              </span>
            </div>
            <Slider
              value={[settings.rotation]}
              min={-180}
              max={180}
              step={1}
              onValueChange={([v]) => updateSetting("rotation", v)}
            />
          </div>
        </div>
      </div>

      {/* Adjustment Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sun className="w-4 h-4" />
          <span className="text-sm font-medium">Adjustments</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="control-group">
            <div className="flex items-center justify-between">
              <Label className="control-label">Brightness</Label>
              <span className="text-xs text-muted-foreground">
                {Math.round(settings.brightness * 100)}%
              </span>
            </div>
            <Slider
              value={[settings.brightness]}
              min={0.5}
              max={1.5}
              step={0.01}
              onValueChange={([v]) => updateSetting("brightness", v)}
            />
          </div>

          <div className="control-group">
            <div className="flex items-center justify-between">
              <Label className="control-label">Contrast</Label>
              <span className="text-xs text-muted-foreground">
                {Math.round(settings.contrast * 100)}%
              </span>
            </div>
            <Slider
              value={[settings.contrast]}
              min={0.5}
              max={1.5}
              step={0.01}
              onValueChange={([v]) => updateSetting("contrast", v)}
            />
          </div>
        </div>
      </div>

      {/* Color Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Palette className="w-4 h-4" />
          <span className="text-sm font-medium">Colors</span>
        </div>

        <div className="control-group">
          <Label className="control-label">Background Color</Label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => updateSetting("backgroundColor", e.target.value)}
              className="w-full h-10 rounded cursor-pointer border border-gray-700"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateSetting("backgroundColor", "#ffffff")}
              className="text-xs px-2 h-10"
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="control-group">
          <Label className="control-label">Product Color</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Override fabric with solid color
          </p>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.productColor || "#000000"}
              onChange={(e) => updateSetting("productColor", e.target.value)}
              className="w-full h-10 rounded cursor-pointer border border-gray-700"
              disabled={settings.productColor === null}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateSetting(
                  "productColor",
                  settings.productColor === null ? "#000000" : null,
                )
              }
              className="text-xs px-2 h-10"
            >
              {settings.productColor === null ? "Enable" : "Disable"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
