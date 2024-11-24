/*
  Warnings:

  - You are about to drop the column `admin` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `teacher` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "admin",
DROP COLUMN "teacher",
ADD COLUMN     "roles" BIGINT NOT NULL DEFAULT 2;
