import type { ProductMockup, FabricTexture } from "@/types/fabric";

// Mockups - now with auto-mask generation (mask will be created from base image)
export const mockups: ProductMockup[] = [
  {
    id: "user-tshirt",
    name: "T-Shirt",
    category: "apparel",
    baseSrc: "/mockups/user-tshirt.png",
    maskSrc: "/mockups/user-tshirt.png", // Same as base - mask generated from non-white pixels
    thumbnail: "/mockups/user-tshirt.png",
  },
  {
    id: "dress-simple",
    name: "Dress",
    category: "apparel",
    baseSrc: "/mockups/dress-base.png",
    maskSrc: "/mockups/dress-mask.png",
    thumbnail: "/mockups/dress-base.png",
  },
  {
    id: "pillow-square",
    name: "Pillow",
    category: "home",
    baseSrc: "/mockups/pillow-base.png",
    maskSrc: "/mockups/pillow-mask.png",
    thumbnail: "/mockups/pillow-base.png",
  },
  {
    id: "curtain-panel",
    name: "Curtain",
    category: "home",
    baseSrc: "/mockups/curtain-base.png",
    maskSrc: "/mockups/curtain-mask.png",
    thumbnail: "/mockups/curtain-base.png",
  },
  {
    id: "bedsheet",
    name: "Bedsheet",
    category: "home",
    baseSrc: "/mockups/bedsheet.png",
    maskSrc: "/mockups/bedsheet.png",
    thumbnail: "/mockups/bedsheet.png",
  },
  {
    id: "couch",
    name: "Couch",
    category: "home",
    baseSrc: "/mockups/coach.png",
    maskSrc: "/mockups/coach.png",
    thumbnail: "/mockups/coach.png",
  },
  {
    id: "sash",
    name: "Sash",
    category: "apparel",
    baseSrc: "/mockups/sash.png",
    maskSrc: "/mockups/sash.png",
    thumbnail: "/mockups/sash.png",
  },
];

export const fabrics: FabricTexture[] = [
  {
    id: "floral-blue",
    name: "Blue Floral",
    src: "/fabrics/floral-blue.png",
    thumbnail: "/fabrics/floral-blue.png",
  },
  {
    id: "geometric-red",
    name: "Geometric Red",
    src: "/fabrics/geometric-red.png",
    thumbnail: "/fabrics/geometric-red.png",
  },
  {
    id: "stripe-navy",
    name: "Navy Stripes",
    src: "/fabrics/stripe-navy.png",
    thumbnail: "/fabrics/stripe-navy.png",
  },
];
