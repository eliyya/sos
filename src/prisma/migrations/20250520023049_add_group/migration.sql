-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "group" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "group" INTEGER NOT NULL DEFAULT 0;
