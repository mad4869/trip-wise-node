/*
  Warnings:

  - You are about to alter the column `location` on the `Activity` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "public"."Activity" ALTER COLUMN "location" SET DATA TYPE VARCHAR(255);
