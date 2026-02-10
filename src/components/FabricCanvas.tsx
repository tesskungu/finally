import { useRef, useEffect } from "react";
import type {
  FabricSettings,
  ProductMockup,
  FabricTexture,
} from "@/types/fabric";

interface FabricCanvasProps {
  mockup: ProductMockup | null;
  fabric: FabricTexture | null;
  settings: FabricSettings;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const FabricCanvas = ({
  mockup,
  fabric,
  settings,
  canvasRef,
}: FabricCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const fabricImageRef = useRef<HTMLImageElement | null>(null);
  const overlayImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const loadingRef = useRef<boolean>(false);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Generate mask from base image - detects non-white/non-transparent pixels
  const generateMaskFromBase = (
    baseImage: HTMLImageElement,
    width: number,
    height: number,
  ): ImageData => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.drawImage(baseImage, 0, 0, width, height);

    const imageData = tempCtx.getImageData(0, 0, width, height);
    const maskData = tempCtx.createImageData(width, height);

    const whiteThreshold = 248;

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];

      const isTransparent = a < 10;
      const isWhite =
        r > whiteThreshold && g > whiteThreshold && b > whiteThreshold;

      if (!isTransparent && !isWhite) {
        const brightness = (r + g + b) / 3;
        const maskValue = Math.min(255, brightness * 1.2);
        maskData.data[i] = maskValue;
        maskData.data[i + 1] = maskValue;
        maskData.data[i + 2] = maskValue;
        maskData.data[i + 3] = 255;
      } else if (!isTransparent && isWhite) {
        maskData.data[i] = 255;
        maskData.data[i + 1] = 255;
        maskData.data[i + 2] = 255;
        maskData.data[i + 3] = 255;
      } else {
        maskData.data[i] = 0;
        maskData.data[i + 1] = 0;
        maskData.data[i + 2] = 0;
        maskData.data[i + 3] = 255;
      }
    }

    return maskData;
  };

  // Apply Linear Burn blend mode: result = base + blend - 255
  const applyLinearBurn = (
    baseData: ImageData,
    fabricData: ImageData,
    maskData: ImageData,
    opacity: number,
  ): ImageData => {
    const result = new ImageData(baseData.width, baseData.height);

    for (let i = 0; i < baseData.data.length; i += 4) {
      const maskValue = maskData.data[i] / 255;

      if (maskValue > 0) {
        // Linear Burn formula: max(0, base + blend - 255)
        const blendStrength = opacity * maskValue;

        for (let c = 0; c < 3; c++) {
          const base = baseData.data[i + c];
          const blend = fabricData.data[i + c];

          // Linear burn calculation
          const burned = Math.max(0, base + blend - 255);

          // Mix with original based on opacity and mask
          result.data[i + c] = Math.round(
            base * (1 - blendStrength) + burned * blendStrength,
          );
        }
        result.data[i + 3] = baseData.data[i + 3];
      } else {
        // Keep original base pixel
        result.data[i] = baseData.data[i];
        result.data[i + 1] = baseData.data[i + 1];
        result.data[i + 2] = baseData.data[i + 2];
        result.data[i + 3] = baseData.data[i + 3];
      }
    }

    return result;
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Fill with background color
    ctx.fillStyle = settings.backgroundColor || "white";
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    const baseImage = baseImageRef.current;
    const fabricImage = fabricImageRef.current;

    if (!baseImage) return;

    // Calculate scaling
    const scale =
      Math.min(
        containerWidth / baseImage.width,
        containerHeight / baseImage.height,
      ) * 0.85;

    const scaledWidth = Math.floor(baseImage.width * scale);
    const scaledHeight = Math.floor(baseImage.height * scale);
    const offsetX = Math.floor((containerWidth - scaledWidth) / 2);
    const offsetY = Math.floor((containerHeight - scaledHeight) / 2);

    // If productColor is set, use solid color instead of fabric
    if (settings.productColor) {
      // Get base image data at scaled size
      const baseCanvas = document.createElement("canvas");
      baseCanvas.width = scaledWidth;
      baseCanvas.height = scaledHeight;
      const baseCtx = baseCanvas.getContext("2d")!;
      baseCtx.drawImage(baseImage, 0, 0, scaledWidth, scaledHeight);
      const baseData = baseCtx.getImageData(0, 0, scaledWidth, scaledHeight);

      // Create a solid color canvas
      const colorCanvas = document.createElement("canvas");
      colorCanvas.width = scaledWidth;
      colorCanvas.height = scaledHeight;
      const colorCtx = colorCanvas.getContext("2d")!;
      colorCtx.fillStyle = settings.productColor;
      colorCtx.fillRect(0, 0, scaledWidth, scaledHeight);
      const colorData = colorCtx.getImageData(0, 0, scaledWidth, scaledHeight);

      // Generate mask from base
      const maskData = generateMaskFromBase(
        baseImage,
        scaledWidth,
        scaledHeight,
      );

      // Apply Linear Burn blend with solid color
      const resultData = applyLinearBurn(
        baseData,
        colorData,
        maskData,
        settings.opacity,
      );

      // Draw result
      const resultCanvas = document.createElement("canvas");
      resultCanvas.width = scaledWidth;
      resultCanvas.height = scaledHeight;
      const resultCtx = resultCanvas.getContext("2d")!;
      resultCtx.putImageData(resultData, 0, 0);

      ctx.drawImage(resultCanvas, offsetX, offsetY);
    } else if (fabricImage) {
      // Create tiled fabric pattern
      const tileWidth = Math.max(
        8,
        (fabricImage.width * settings.scale) / settings.tileX,
      );
      const tileHeight = Math.max(
        8,
        (fabricImage.height * settings.scale) / settings.tileY,
      );

      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = tileWidth;
      tileCanvas.height = tileHeight;
      const tileCtx = tileCanvas.getContext("2d")!;
      tileCtx.filter = `brightness(${settings.brightness}) contrast(${settings.contrast})`;
      tileCtx.drawImage(fabricImage, 0, 0, tileWidth, tileHeight);

      // Create full-size fabric layer
      const fabricCanvas = document.createElement("canvas");
      fabricCanvas.width = scaledWidth;
      fabricCanvas.height = scaledHeight;
      const fabricCtx = fabricCanvas.getContext("2d")!;

      const pattern = fabricCtx.createPattern(tileCanvas, "repeat");
      if (pattern) {
        fabricCtx.save();
        fabricCtx.translate(scaledWidth / 2, scaledHeight / 2);
        fabricCtx.rotate((settings.rotation * Math.PI) / 180);
        fabricCtx.translate(
          -scaledWidth / 2 + settings.offsetX,
          -scaledHeight / 2 + settings.offsetY,
        );
        fabricCtx.fillStyle = pattern;
        fabricCtx.fillRect(
          -scaledWidth,
          -scaledHeight,
          scaledWidth * 3,
          scaledHeight * 3,
        );
        fabricCtx.restore();
      }

      // Get base image data at scaled size
      const baseCanvas = document.createElement("canvas");
      baseCanvas.width = scaledWidth;
      baseCanvas.height = scaledHeight;
      const baseCtx = baseCanvas.getContext("2d")!;
      baseCtx.drawImage(baseImage, 0, 0, scaledWidth, scaledHeight);
      const baseData = baseCtx.getImageData(0, 0, scaledWidth, scaledHeight);

      // Get fabric data
      const fabricData = fabricCtx.getImageData(
        0,
        0,
        scaledWidth,
        scaledHeight,
      );

      // Generate mask from base
      const maskData = generateMaskFromBase(
        baseImage,
        scaledWidth,
        scaledHeight,
      );

      // Apply Linear Burn blend
      const resultData = applyLinearBurn(
        baseData,
        fabricData,
        maskData,
        settings.opacity,
      );

      // Draw result
      const resultCanvas = document.createElement("canvas");
      resultCanvas.width = scaledWidth;
      resultCanvas.height = scaledHeight;
      const resultCtx = resultCanvas.getContext("2d")!;
      resultCtx.putImageData(resultData, 0, 0);

      ctx.drawImage(resultCanvas, offsetX, offsetY);
    } else {
      // Just draw base image
      ctx.drawImage(baseImage, offsetX, offsetY, scaledWidth, scaledHeight);
    }

    // Draw overlay designs on top
    settings.overlays.forEach((overlay) => {
      const overlayImage = overlayImagesRef.current.get(overlay.id);
      if (!overlayImage) return;

      // Calculate overlay dimensions
      const overlayWidth = overlayImage.width * overlay.scale;
      const overlayHeight = overlayImage.height * overlay.scale;

      // Calculate position (centered + offset)
      const overlayX = offsetX + scaledWidth / 2 + overlay.x - overlayWidth / 2;
      const overlayY =
        offsetY + scaledHeight / 2 + overlay.y - overlayHeight / 2;

      // Draw overlay with normal blend mode
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(
        overlayImage,
        overlayX,
        overlayY,
        overlayWidth,
        overlayHeight,
      );
    });

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over";
  };

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      try {
        if (mockup) {
          baseImageRef.current = await loadImage(mockup.baseSrc);
        }
        if (fabric) {
          fabricImageRef.current = await loadImage(fabric.src);
        }
        renderCanvas();
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        loadingRef.current = false;
      }
    };

    loadImages();
  }, [mockup, fabric]);

  // Load overlay images
  useEffect(() => {
    const loadOverlays = async () => {
      const currentMap = overlayImagesRef.current;

      // Remove old overlays that are no longer in settings
      const overlayIds = new Set(settings.overlays.map((o) => o.id));
      Array.from(currentMap.keys()).forEach((id) => {
        if (!overlayIds.has(id)) {
          currentMap.delete(id);
        }
      });

      // Load new overlays
      for (const overlay of settings.overlays) {
        if (!currentMap.has(overlay.id)) {
          try {
            const img = await loadImage(overlay.src);
            currentMap.set(overlay.id, img);
          } catch (error) {
            console.error("Error loading overlay:", error);
          }
        }
      }

      renderCanvas();
    };

    loadOverlays();
  }, [settings.overlays]);

  useEffect(() => {
    renderCanvas();
  }, [settings]);

  useEffect(() => {
    const handleResize = () => renderCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(renderCanvas, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="canvas-container w-full h-full flex items-center justify-center relative"
    >
      <canvas ref={canvasRef} className="max-w-full max-h-full" />
      {!mockup && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-center px-8">
            Select a product mockup to get started
          </p>
        </div>
      )}
    </div>
  );
};
