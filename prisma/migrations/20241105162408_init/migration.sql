-- CreateEnum
CREATE TYPE "States" AS ENUM ('AVAILABLE', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "teacher" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passwords" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Passwords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "practice_hours" INTEGER NOT NULL,
    "theory_hours" INTEGER NOT NULL,

    CONSTRAINT "Subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersSubjects" (
    "user_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,

    CONSTRAINT "UsersSubjects_pkey" PRIMARY KEY ("user_id","subject_id")
);

-- CreateTable
CREATE TABLE "Laboratories" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "open_hour" INTEGER NOT NULL,
    "close_hour" INTEGER NOT NULL,
    "common_use" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Laboratories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Practices" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "software" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "students" INTEGER,
    "registered_by" TEXT NOT NULL,
    "laboratory_id" TEXT NOT NULL,

    CONSTRAINT "Practices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Careers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "nc" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "career_id" TEXT NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("nc")
);

-- CreateTable
CREATE TABLE "Visits" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exit_at" TIMESTAMP(3) NOT NULL,
    "student_nc" TEXT NOT NULL,
    "laboratory_id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,

    CONSTRAINT "Visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machines" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "status" "States" NOT NULL DEFAULT 'AVAILABLE',
    "processor" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "laboratory_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reports" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "checked_at" TIMESTAMP(3),

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Laboratories_name_key" ON "Laboratories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Careers_name_key" ON "Careers"("name");

-- AddForeignKey
ALTER TABLE "Passwords" ADD CONSTRAINT "Passwords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSubjects" ADD CONSTRAINT "UsersSubjects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSubjects" ADD CONSTRAINT "UsersSubjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practices" ADD CONSTRAINT "Practices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practices" ADD CONSTRAINT "Practices_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practices" ADD CONSTRAINT "Practices_registered_by_fkey" FOREIGN KEY ("registered_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practices" ADD CONSTRAINT "Practices_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "Laboratories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "Careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visits" ADD CONSTRAINT "Visits_student_nc_fkey" FOREIGN KEY ("student_nc") REFERENCES "Students"("nc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visits" ADD CONSTRAINT "Visits_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "Laboratories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visits" ADD CONSTRAINT "Visits_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machines" ADD CONSTRAINT "Machines_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "Laboratories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
