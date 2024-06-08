/*
  Warnings:

  - You are about to drop the column `name` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `title` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Activity" DROP COLUMN "name",
ADD COLUMN     "title" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "name",
ADD COLUMN     "title" VARCHAR(255) NOT NULL;
