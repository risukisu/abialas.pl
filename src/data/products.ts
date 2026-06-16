export type Product = {
  slug: string;        // URL segment → /system, /ai
  name: string;        // display name
  blurb: string;       // one honest line, no corpo-speak
  tag: string;         // matches essay `topics[]`
  order: number;       // storefront + nav ordering
  hasSchematic?: boolean; // /system gets the pillar schematic island
};

export const products: Product[] = [
  {
    slug: "system",
    name: "How I run marketing",
    blurb: "How I run B2B marketing as a system you can actually steer.",
    tag: "system",
    order: 1,
    hasSchematic: true,
  },
  {
    slug: "ai",
    name: "AI at work",
    blurb: "Using AI on real marketing work — what holds up and what doesn't.",
    tag: "ai",
    order: 2,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
