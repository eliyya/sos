/*
  Warnings:

  - The primary key for the `laboratories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `laboratories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `practices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `software` on the `practices` table. All the data in the column will be lost.
  - The `id` column on the `practices` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `roles` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `UsersSubjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reports` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `laboratory_id` on the `machines` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `laboratory_id` on the `practices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `laboratory_id` on the `visits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "UsersSubjects" DROP CONSTRAINT "UsersSubjects_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "UsersSubjects" DROP CONSTRAINT "UsersSubjects_user_id_fkey";

-- DropForeignKey
ALTER TABLE "machines" DROP CONSTRAINT "machines_laboratory_id_fkey";

-- DropForeignKey
ALTER TABLE "practices" DROP CONSTRAINT "practices_laboratory_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_laboratory_id_fkey";

-- AlterTable
ALTER TABLE "auths" ADD COLUMN     "totp" TEXT;

-- AlterTable
ALTER TABLE "laboratories" DROP CONSTRAINT "laboratories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "laboratories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "machines" DROP COLUMN "laboratory_id",
ADD COLUMN     "laboratory_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "practices" DROP CONSTRAINT "practices_pkey",
DROP COLUMN "software",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "laboratory_id",
ADD COLUMN     "laboratory_id" INTEGER NOT NULL,
ADD CONSTRAINT "practices_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roles",
ADD COLUMN     "role" BIGINT NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "visits" DROP COLUMN "laboratory_id",
ADD COLUMN     "laboratory_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UsersSubjects";

-- DropTable
DROP TABLE "reports";

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "career_id" INTEGER NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "software" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "software_practices" (
    "software_id" INTEGER NOT NULL,
    "practice_id" INTEGER NOT NULL,

    CONSTRAINT "software_practices_pkey" PRIMARY KEY ("software_id","practice_id")
);

-- CreateTable
CREATE TABLE "software_machines" (
    "software_id" INTEGER NOT NULL,
    "machine_id" INTEGER NOT NULL,

    CONSTRAINT "software_machines_pkey" PRIMARY KEY ("software_id","machine_id")
);

-- CreateTable
CREATE TABLE "issue" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "closed_at" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_classes" (
    "student_nc" TEXT NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "student_classes_pkey" PRIMARY KEY ("student_nc","class_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_secret_key" ON "sessions"("secret");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "laboratories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_practices" ADD CONSTRAINT "software_practices_software_id_fkey" FOREIGN KEY ("software_id") REFERENCES "software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_practices" ADD CONSTRAINT "software_practices_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "laboratories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "laboratories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_machines" ADD CONSTRAINT "software_machines_software_id_fkey" FOREIGN KEY ("software_id") REFERENCES "software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_machines" ADD CONSTRAINT "software_machines_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_classes" ADD CONSTRAINT "student_classes_student_nc_fkey" FOREIGN KEY ("student_nc") REFERENCES "students"("nc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_classes" ADD CONSTRAINT "student_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
