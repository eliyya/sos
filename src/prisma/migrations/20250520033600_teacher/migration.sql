/*
  Warnings:

  - You are about to drop the column `user_id` on the `practices` table. All the data in the column will be lost.
  - Added the required column `teacher_id` to the `practices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "practices" DROP CONSTRAINT "practices_user_id_fkey";

-- AlterTable
ALTER TABLE "practices" DROP COLUMN "user_id",
ADD COLUMN     "teacher_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
