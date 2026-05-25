-- CreateTable
CREATE TABLE "viewers" (
    "id" BIGSERIAL NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "viewers_pkey" PRIMARY KEY ("id")
);
