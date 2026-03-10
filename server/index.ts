import express from "express";
import cors from "cors";
import prisma from "./prisma.js";

const app = express();
app.use(cors());
app.use(express.json());

// ── Cars CRUD ──────────────────────────────────────────────────────────────

// List all cars (public)
app.get("/api/cars", async (_req, res) => {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(cars);
});

// Get a single car (public)
app.get("/api/cars/:id", async (req, res) => {
  const car = await prisma.car.findUnique({ where: { id: req.params.id } });
  if (!car) return res.status(404).json({ error: "Not found" });
  res.json(car);
});

// Create a car
app.post("/api/cars", async (req, res) => {
  const {
    brand,
    model,
    year,
    price,
    mileage,
    fuel,
    transmission,
    power,
    color,
    condition,
    description,
    images,
    features,
  } = req.body;
  const car = await prisma.car.create({
    data: {
      brand,
      model,
      year,
      price,
      mileage,
      fuel,
      transmission,
      power,
      color,
      condition,
      description,
      images,
      features,
    },
  });
  res.status(201).json(car);
});

// Update a car
app.patch("/api/cars/:id", async (req, res) => {
  const {
    brand,
    model,
    year,
    price,
    mileage,
    fuel,
    transmission,
    power,
    color,
    condition,
    description,
    images,
    features,
  } = req.body;
  const car = await prisma.car.update({
    where: { id: req.params.id },
    data: {
      brand,
      model,
      year,
      price,
      mileage,
      fuel,
      transmission,
      power,
      color,
      condition,
      description,
      images,
      features,
    },
  });
  res.json(car);
});

// Delete a car
app.delete("/api/cars/:id", async (req, res) => {
  await prisma.car.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// ── Start ──────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`API server running on http://localhost:${PORT}`),
);
