/*
  Warnings:

  - You are about to drop the column `status` on the `practices` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "software_practices" DROP CONSTRAINT "software_practices_practice_id_fkey";

-- AlterTable
ALTER TABLE "practices" DROP COLUMN "status";

-- AddForeignKey
ALTER TABLE "software_practices" ADD CONSTRAINT "software_practices_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
