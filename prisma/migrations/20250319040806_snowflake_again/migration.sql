/*
  Warnings:

  - The primary key for the `auths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `careers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `issue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `laboratories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `machines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `practices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `software` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `software_machines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `software_practices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `student_classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `visits` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "auths" DROP CONSTRAINT "auths_user_id_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_career_id_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_issue_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "issue" DROP CONSTRAINT "issue_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "issue" DROP CONSTRAINT "issue_user_id_fkey";

-- DropForeignKey
ALTER TABLE "machines" DROP CONSTRAINT "machines_laboratory_id_fkey";

-- DropForeignKey
ALTER TABLE "practices" DROP CONSTRAINT "practices_laboratory_id_fkey";

-- DropForeignKey
ALTER TABLE "practices" DROP CONSTRAINT "practices_registered_by_fkey";

-- DropForeignKey
ALTER TABLE "practices" DROP CONSTRAINT "practices_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "practices" DROP CONSTRAINT "practices_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "software_machines" DROP CONSTRAINT "software_machines_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "software_machines" DROP CONSTRAINT "software_machines_software_id_fkey";

-- DropForeignKey
ALTER TABLE "software_practices" DROP CONSTRAINT "software_practices_practice_id_fkey";

-- DropForeignKey
ALTER TABLE "software_practices" DROP CONSTRAINT "software_practices_software_id_fkey";

-- DropForeignKey
ALTER TABLE "student_classes" DROP CONSTRAINT "student_classes_class_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_career_id_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_laboratory_id_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_machine_id_fkey";

-- AlterTable
ALTER TABLE "auths" DROP CONSTRAINT "auths_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "auths_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "auths_id_seq";

-- AlterTable
ALTER TABLE "careers" DROP CONSTRAINT "careers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "careers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "careers_id_seq";

-- AlterTable
ALTER TABLE "classes" DROP CONSTRAINT "classes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subject_id" SET DATA TYPE TEXT,
ALTER COLUMN "teacher_id" SET DATA TYPE TEXT,
ALTER COLUMN "career_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "classes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "classes_id_seq";

-- AlterTable
ALTER TABLE "comment" DROP CONSTRAINT "comment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "issue_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "comment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "comment_id_seq";

-- AlterTable
ALTER TABLE "issue" DROP CONSTRAINT "issue_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "machine_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "issue_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "issue_id_seq";

-- AlterTable
ALTER TABLE "laboratories" DROP CONSTRAINT "laboratories_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "laboratories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "laboratories_id_seq";

-- AlterTable
ALTER TABLE "machines" DROP CONSTRAINT "machines_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "laboratory_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "machines_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "machines_id_seq";

-- AlterTable
ALTER TABLE "practices" DROP CONSTRAINT "practices_pkey",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "subject_id" SET DATA TYPE TEXT,
ALTER COLUMN "registered_by" SET DATA TYPE TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "laboratory_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "practices_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "practices_id_seq";

-- AlterTable
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sessions_id_seq";

-- AlterTable
ALTER TABLE "software" DROP CONSTRAINT "software_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "software_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "software_id_seq";

-- AlterTable
ALTER TABLE "software_machines" DROP CONSTRAINT "software_machines_pkey",
ALTER COLUMN "software_id" SET DATA TYPE TEXT,
ALTER COLUMN "machine_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "software_machines_pkey" PRIMARY KEY ("software_id", "machine_id");

-- AlterTable
ALTER TABLE "software_practices" DROP CONSTRAINT "software_practices_pkey",
ALTER COLUMN "software_id" SET DATA TYPE TEXT,
ALTER COLUMN "practice_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "software_practices_pkey" PRIMARY KEY ("software_id", "practice_id");

-- AlterTable
ALTER TABLE "student_classes" DROP CONSTRAINT "student_classes_pkey",
ALTER COLUMN "class_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "student_classes_pkey" PRIMARY KEY ("student_nc", "class_id");

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "career_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subjects_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AlterTable
ALTER TABLE "visits" DROP CONSTRAINT "visits_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "machine_id" SET DATA TYPE TEXT,
ALTER COLUMN "laboratory_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "visits_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "visits_id_seq";

-- AddForeignKey
ALTER TABLE "auths" ADD CONSTRAINT "auths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_registered_by_fkey" FOREIGN KEY ("registered_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "laboratories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_practices" ADD CONSTRAINT "software_practices_software_id_fkey" FOREIGN KEY ("software_id") REFERENCES "software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_practices" ADD CONSTRAINT "software_practices_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "laboratories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "student_classes" ADD CONSTRAINT "student_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
