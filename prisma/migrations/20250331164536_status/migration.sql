/*
  Warnings:

  - You are about to drop the column `satus` on the `subjects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "satus",
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'ACTIVE';
