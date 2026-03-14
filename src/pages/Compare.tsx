import { useState } from "react";
import { useCars } from "@/hooks/use-cars";
import type { Car } from "@/data/cars";
import { useDealershipCtx } from "@/contexts/DealershipContext";
import Navbar from "@/components/Navbar";
import { X, Loader2 } from "lucide-react";

const Compare = () => {
  const { slug } = useDealershipCtx();
  const { data: cars = [], isLoading } = useCars(slug);
  const [selected, setSelected] = useState<string[]>([]);

  const conditionScore: Record<Car["condition"], number> = {
    New: 3,
    "Certified Pre-Owned": 2,
    Used: 1,
  };

  type CompareRow = {
    label: string;
    fn: (c: Car) => string | number;
    metric?: (c: Car) => number;
    better?: "higher" | "lower";
  };

  const compareRows: CompareRow[] = [
    {
      label: "Price",
      fn: (c: Car) => `€${c.price.toLocaleString()}`,
      metric: (c: Car) => c.price,
      better: "lower",
    },
    {
      label: "Year",
      fn: (c: Car) => c.year,
      metric: (c: Car) => c.year,
      better: "higher",
    },
    {
      label: "Mileage",
      fn: (c: Car) => `${c.mileage.toLocaleString()} km`,
      metric: (c: Car) => c.mileage,
      better: "lower",
    },
    { label: "Fuel", fn: (c: Car) => c.fuel },
    {
      label: "Power",
      fn: (c: Car) => `${c.power} HP`,
      metric: (c: Car) => c.power,
      better: "higher",
    },
    { label: "Transmission", fn: (c: Car) => c.transmission },
    { label: "Color", fn: (c: Car) => c.color },
    {
      label: "Condition",
      fn: (c: Car) => c.condition,
      metric: (c: Car) => conditionScore[c.condition],
      better: "higher",
    },
  ];

  const getCellClass = (row: CompareRow, car: Car): string => {
    if (!row.metric || !row.better || selectedCars.length < 2) return "";

    const values = selectedCars.map((c) => row.metric!(c));
    const best =
      row.better === "higher" ? Math.max(...values) : Math.min(...values);
    const worst =
      row.better === "higher" ? Math.min(...values) : Math.max(...values);
    const value = row.metric(car);

    if (best === worst) return "";
    if (value === best) return "text-success";
    if (value === worst) return "text-destructive";
    return "";
  };

  const toggleCar = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  };

  const selectedCars = cars.filter((c) => selected.includes(c.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold">Compare Vehicles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select up to 3 vehicles to compare side by side
        </p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Selector */}
            <div className="mt-6 flex flex-wrap gap-2">
              {cars.map((car) => (
                <button
                  key={car.id}
                  onClick={() => toggleCar(car.id)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    selected.includes(car.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "bg-card hover:bg-secondary"
                  } ${selected.length >= 3 && !selected.includes(car.id) ? "cursor-not-allowed opacity-50" : ""}`}>
                  {car.brand} {car.model}
                  {selected.includes(car.id) && (
                    <X className="ml-1.5 inline h-3 w-3" />
                  )}
                </button>
              ))}
            </div>

            {/* Comparison table */}
            {selectedCars.length >= 2 && (
              <div className="mt-8 overflow-x-auto animate-fade-in">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left text-muted-foreground font-medium">
                        Specification
                      </th>
                      {selectedCars.map((c) => (
                        <th
                          key={c.id}
                          className="p-3 text-left font-display font-semibold">
                          {c.brand} {c.model}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map((row) => (
                      <tr key={row.label} className="border-b">
                        <td className="p-3 text-muted-foreground">
                          {row.label}
                        </td>
                        {selectedCars.map((c) => (
                          <td
                            key={c.id}
                            className={`p-3 font-medium ${getCellClass(row, c)}`}>
                            {row.fn(c)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedCars.length < 2 && (
              <p className="mt-12 text-center text-muted-foreground">
                Select at least 2 vehicles to compare
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Compare;
