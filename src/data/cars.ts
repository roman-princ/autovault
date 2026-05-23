export interface Dealership {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  address: string;
  aboutUs: string;
  createdAt: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  transmission: "Manual" | "Automatic";
  power: number; // HP
  color: string;
  condition: "New" | "Used" | "Certified Pre-Owned";
  description: string;
  images: string[];
  features: string[];
  dealershipId: string;
}

export const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"] as const;
export const transmissionTypes = ["Manual", "Automatic"] as const;
export const conditions = ["New", "Used", "Certified Pre-Owned"] as const;

/**
 * Build descriptive alt text for a car image from its vehicle specifications,
 * so screen readers convey the visual instead of skipping it. Accepts a partial
 * car (e.g. an in-progress admin form) and gracefully omits empty fields.
 *
 * Example: "2021 BMW 320i — Blue, Diesel, Automatic, Used (photo 2)"
 */
export function getCarImageAlt(
  car: Partial<
    Pick<
      Car,
      | "year"
      | "brand"
      | "model"
      | "color"
      | "fuel"
      | "transmission"
      | "condition"
    >
  >,
  position?: number,
): string {
  const name = [car.year, car.brand, car.model]
    .filter((part) => part !== undefined && part !== null && part !== "")
    .join(" ")
    .trim();

  const details = [car.color, car.fuel, car.transmission, car.condition]
    .filter((part) => part !== undefined && part !== null && part !== "")
    .join(", ");

  const headline = name || "Vehicle";
  const base = details ? `${headline} — ${details}` : headline;

  return position && position > 1 ? `${base} (photo ${position})` : base;
}
