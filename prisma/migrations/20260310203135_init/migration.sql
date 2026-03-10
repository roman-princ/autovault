-- CreateTable
CREATE TABLE "cars" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL DEFAULT extract(year from now())::int,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "fuel" TEXT NOT NULL DEFAULT 'Petrol',
    "transmission" TEXT NOT NULL DEFAULT 'Automatic',
    "power" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '',
    "condition" TEXT NOT NULL DEFAULT 'New',
    "description" TEXT NOT NULL DEFAULT '',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);
