-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('ACTIVE', 'COMPLETE');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('WINNER', 'LOSER');

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT E'ACTIVE',
    "result" "GameResult",
    "turns" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);
