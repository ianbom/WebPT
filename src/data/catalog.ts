import records from "./products.json";
import type { Product } from "@/types/product";
export const products: Product[] = records;
export const featuredSlugs = ["forklift-heli-46-ton-big-forklift", "forklift-heli-40-ton-big-forklift", "forklift-heli-35-ton-big-forklift", "forklift-heli-10-ton-front-double-tire", "lcm-scissor-lift-ze16w", "lcm-scissor-lift-ze14w", "dingli-boom-lift-18m-28m-articulated", "boom-lift-20m-41m-telescopic"];
export const featuredProducts = featuredSlugs.map((slug) => products.find((product) => product.slug === slug)!);
