-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "Offices" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Offices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "number" TEXT,
    "date_issued" TEXT,
    "details" TEXT,
    "date_effectivity" TEXT,
    "status" TEXT,
    "related_ordinances" TEXT,
    "file_path" TEXT,
    "document_type" TEXT,
    "is_deleted" TEXT,
    "sponsor" TEXT,
    "download_count" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "sponsor_id" SERIAL NOT NULL,
    "sponsor_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("sponsor_id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "office_id" TEXT,
    "role" "Role" DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_office_id_fkey" FOREIGN KEY ("office_id") REFERENCES "Offices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
