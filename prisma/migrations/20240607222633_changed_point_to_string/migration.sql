/*
  Warnings:

  - You are about to alter the column `location` on the `Activity` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("point")` to `Text`.

*/
-- AlterTable
ALTER TABLE "public"."Activity" ALTER COLUMN "location" SET DATA TYPE TEXT;
