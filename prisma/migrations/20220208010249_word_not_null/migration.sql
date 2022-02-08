/*
  Warnings:

  - Made the column `word` on table `GameSession` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GameSession" ALTER COLUMN "word" SET NOT NULL;
