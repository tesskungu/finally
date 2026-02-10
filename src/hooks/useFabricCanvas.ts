import { useRef, useEffect, useCallback } from 'react';
import type { FabricSettings, ProductMockup, FabricTexture } from '@/types/fabric';

interface UseFabricCanvasProps {
  mockup: ProductMockup | null;
  fabric: FabricTexture | null;
  settings: FabricSettings;
  canvasSize: { width: number; height: number };
}

export const useFabricCanvas = ({
  mockup,
  fabric,
  settings,
  canvasSize,
}: UseFabricCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const maskImageRef = useRef<HTMLImageElement | null>(null);
  const fabricImageRef = useRef<HTMLImageElement | null>(null);

  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { width, height } = canvasSize;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const baseImage = baseImageRef.current;
    const maskImage = maskImageRef.current;
    const fabricImage = fabricImageRef.current;

    if (!baseImage) return;

    // Calculate scaling to fit canvas while maintaining aspect ratio
    const scale = Math.min(width / baseImage.width, height / baseImage.height);
    const scaledWidth = baseImage.width * scale;
    const scaledHeight = baseImage.height * scale;
    const offsetX = (width - scaledWidth) / 2;
    const offsetY = (height - scaledHeight) / 2;

    // If we have fabric and mask, render with fabric
    if (fabricImage && maskImage) {
      // Create offscreen canvas for fabric texture with adjustments
      const fabricCanvas = document.createElement('canvas');
      fabricCanvas.width = scaledWidth;
      fabricCanvas.height = scaledHeight;
      const fabricCtx = fabricCanvas.getContext('2d')!;

      // Apply transformations for fabric
      fabricCtx.save();
      
      // Calculate fabric dimensions with tiling and scale
      const tileWidth = (fabricImage.width * settings.scale) / settings.tileX;
      const tileHeight = (fabricImage.height * settings.scale) / settings.tileY;

      // Create pattern with the fabric
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = tileWidth;
      patternCanvas.height = tileHeight;
      const patternCtx = patternCanvas.getContext('2d')!;
      
      // Apply brightness and contrast to pattern
      patternCtx.filter = `brightness(${settings.brightness}) contrast(${settings.contrast})`;
      patternCtx.drawImage(fabricImage, 0, 0, tileWidth, tileHeight);

      // Create pattern
      const pattern = fabricCtx.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        // Apply rotation and offset to pattern
        const transform = new DOMMatrix();
        transform.translateSelf(settings.offsetX * scale, settings.offsetY * scale);
        transform.rotateSelf(settings.rotation);
        pattern.setTransform(transform);

        fabricCtx.fillStyle = pattern;
        fabricCtx.fillRect(0, 0, scaledWidth, scaledHeight);
      }
      fabricCtx.restore();

      // Create mask canvas
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = scaledWidth;
      maskCanvas.height = scaledHeight;
      const maskCtx = maskCanvas.getContext('2d')!;
      maskCtx.drawImage(maskImage, 0, 0, scaledWidth, scaledHeight);

      // Apply mask to fabric
      fabricCtx.globalCompositeOperation = 'destination-in';
      fabricCtx.drawImage(maskCanvas, 0, 0);

      // Draw base image
      ctx.drawImage(baseImage, offsetX, offsetY, scaledWidth, scaledHeight);

      // Draw fabric with multiply blend mode for realistic integration
      ctx.save();
      ctx.globalAlpha = settings.opacity;
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(fabricCanvas, offsetX, offsetY);
      ctx.restore();

      // Draw fabric again with overlay for enhanced depth
      ctx.save();
      ctx.globalAlpha = settings.opacity * 0.3;
      ctx.globalCompositeOperation = 'overlay';
      ctx.drawImage(fabricCanvas, offsetX, offsetY);
      ctx.restore();
    } else {
      // Just draw base image
      ctx.drawImage(baseImage, offsetX, offsetY, scaledWidth, scaledHeight);
    }
  }, [canvasSize, settings]);

  // Load images when mockup or fabric changes
  useEffect(() => {
    const loadImages = async () => {
      try {
        if (mockup) {
          baseImageRef.current = await loadImage(mockup.baseSrc);
          maskImageRef.current = await loadImage(mockup.maskSrc);
        }
        if (fabric) {
          fabricImageRef.current = await loadImage(fabric.src);
        }
        renderCanvas();
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, [mockup, fabric, loadImage, renderCanvas]);

  // Re-render when settings change
  useEffect(() => {
    renderCanvas();
  }, [settings, renderCanvas]);

  const downloadCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `fabric-preview-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return {
    canvasRef,
    downloadCanvas,
  };
};
