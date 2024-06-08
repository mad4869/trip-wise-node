/*
  Warnings:

  - You are about to drop the column `iteneraryId` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `itineraryId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Activity" DROP CONSTRAINT "Activity_iteneraryId_fkey";

-- AlterTable
ALTER TABLE "public"."Activity" DROP COLUMN "iteneraryId",
ADD COLUMN     "itineraryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "public"."Itinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
