/*
  Warnings:

  - The primary key for the `UsersSubjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `careers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `careers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `machines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `machines` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `reports` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `reports` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `subjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `subjects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `visits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `visits` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `passwords` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `user_id` on the `UsersSubjects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subject_id` on the `UsersSubjects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `practices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subject_id` on the `practices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `registered_by` on the `practices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `machine_id` on the `reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `career_id` on the `students` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `machine_id` on the `visits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "UsersSubjects" DROP CONSTRAINT "UsersSubjects_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "UsersSubjects" DROP CONSTRAINT "UsersSubjects_user_id_fkey";

-- DropForeignKey
ALTER TABLE "passwords" DROP CONSTRAINT "passwords_user_id_fkey";

-- DropForeignKey
ALTER TABLE "practices" DROP CONSTRAINT "practices_registered_by_fkey";

-- DropForeignKey
ALTER TABLE "practices" DROP CONSTRAINT "practices_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "practices" DROP CONSTRAINT "practices_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_career_id_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_machine_id_fkey";

-- AlterTable
ALTER TABLE "UsersSubjects" DROP CONSTRAINT "UsersSubjects_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "subject_id",
ADD COLUMN     "subject_id" INTEGER NOT NULL,
ADD CONSTRAINT "UsersSubjects_pkey" PRIMARY KEY ("user_id", "subject_id");

-- AlterTable
ALTER TABLE "careers" DROP CONSTRAINT "careers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "careers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "machines" DROP CONSTRAINT "machines_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "machines_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "practices" DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "subject_id",
ADD COLUMN     "subject_id" INTEGER NOT NULL,
DROP COLUMN "registered_by",
ADD COLUMN     "registered_by" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reports" DROP CONSTRAINT "reports_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "machine_id",
ADD COLUMN     "machine_id" INTEGER NOT NULL,
ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "students" DROP COLUMN "career_id",
ADD COLUMN     "career_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "visits" DROP CONSTRAINT "visits_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "machine_id",
ADD COLUMN     "machine_id" INTEGER NOT NULL,
ADD CONSTRAINT "visits_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "passwords";

-- CreateTable
CREATE TABLE "auths" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auths_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auths" ADD CONSTRAINT "auths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSubjects" ADD CONSTRAINT "UsersSubjects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSubjects" ADD CONSTRAINT "UsersSubjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_registered_by_fkey" FOREIGN KEY ("registered_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
