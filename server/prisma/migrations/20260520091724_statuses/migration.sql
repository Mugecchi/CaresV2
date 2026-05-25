-- CreateEnum
CREATE TYPE "Statuses" AS ENUM ('Implemented', 'Pending', 'Archived');

-- CreateTable
CREATE TABLE "record_status" (
    "id" TEXT NOT NULL,
    "name" "Statuses" NOT NULL,

    CONSTRAINT "record_status_pkey" PRIMARY KEY ("id")
);
