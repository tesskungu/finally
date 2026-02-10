export interface FabricTexture {
  id: string;
  name: string;
  src: string;
  thumbnail: string;
}

export interface ProductMockup {
  id: string;
  name: string;
  category: "apparel" | "home";
  baseSrc: string;
  maskSrc: string;
  thumbnail: string;
}

export interface DesignOverlay {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
}

export interface FabricSettings {
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  tileX: number;
  tileY: number;
  opacity: number;
  brightness: number;
  contrast: number;
  overlays: DesignOverlay[];
  backgroundColor: string;
  productColor: string | null;
}

export const defaultFabricSettings: FabricSettings = {
  scale: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  tileX: 1,
  tileY: 1,
  opacity: 1,
  brightness: 1,
  contrast: 1,
  overlays: [],
  backgroundColor: "#ffffff",
  productColor: null,
};
