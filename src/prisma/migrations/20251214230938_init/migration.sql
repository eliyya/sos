-- ! Migration customized for snowflake
-- ! This migration is not compatible with the default migration
-- ! You need to run this migration first

-- Fecha base: 01/06/2025
CREATE OR REPLACE FUNCTION snowflake(node_id int DEFAULT 0)
RETURNS text AS $$
DECLARE
    our_epoch bigint := 1748736000000; -- milisegundos desde 01/06/2025
    seq_id bigint;
    now_millis bigint;
    safe_node_id int;
    snowflake_id bigint;
BEGIN
    -- Asegurar que node_id esté entre 0 y 1023 (10 bits)
    safe_node_id := GREATEST(0, LEAST(node_id, 1023));

    -- Usar la secuencia para obtener un número siempre único
    SELECT nextval('snowflake_seq') % 4096 INTO seq_id; -- 12 bits
    SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_millis;

    snowflake_id := ((now_millis - our_epoch) << 22)  -- timestamp (41 bits)
                  | ((safe_node_id & 1023) << 12)     -- node id (10 bits)
                  | (seq_id & 4095);                  -- secuencia (12 bits)

    RETURN snowflake_id::text; -- Convertir a string
END;
$$ LANGUAGE plpgsql;

-- Crear secuencia si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'snowflake_seq') THEN
        CREATE SEQUENCE snowflake_seq;
    END IF;
END$$;

-- ! Prisma generation

-- CreateEnum
CREATE TYPE "LABORATORY_TYPE" AS ENUM ('COMPUTER_CENTER', 'LABORATORY');

-- CreateEnum
CREATE TYPE "MACHINE_STATUS" AS ENUM ('AVAILABLE', 'MAINTENANCE', 'IN_USE', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ACTIVE', 'ARCHIVED', 'DELETED');

-- CreateTable
CREATE TABLE "states" (
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "name" TEXT NOT NULL,
    "permissions" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "name" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT true,
    "display_username" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "practice_hours" INTEGER NOT NULL,
    "theory_hours" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "subject_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "career_id" TEXT NOT NULL,
    "group" INTEGER NOT NULL DEFAULT 1,
    "semester" INTEGER NOT NULL DEFAULT 1,
    "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratories" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "open_hour" INTEGER NOT NULL,
    "close_hour" INTEGER NOT NULL,
    "type" "LABORATORY_TYPE" NOT NULL DEFAULT 'LABORATORY',
    "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laboratories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "teacher_id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "students" INTEGER,
    "registered_by" TEXT NOT NULL,
    "laboratory_id" TEXT NOT NULL,
    "observations" TEXT,
    "class_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "software" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "name" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "software_reservations" (
    "software_id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,

    CONSTRAINT "software_reservations_pkey" PRIMARY KEY ("software_id","reservation_id")
);

-- CreateTable
CREATE TABLE "careers" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',
    "alias" TEXT NOT NULL,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "nc" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "semester" INTEGER NOT NULL DEFAULT 1,
    "group" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "career_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "students_pkey" PRIMARY KEY ("nc")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exit_at" TIMESTAMP(3),
    "student_nc" TEXT NOT NULL,
    "laboratory_id" TEXT NOT NULL,
    "machine_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machines" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "number" INTEGER NOT NULL,
    "status" "MACHINE_STATUS" NOT NULL DEFAULT 'AVAILABLE',
    "processor" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "laboratory_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serie" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "software_machines" (
    "software_id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,

    CONSTRAINT "software_machines_pkey" PRIMARY KEY ("software_id","machine_id")
);

-- CreateTable
CREATE TABLE "issue" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "closed_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL DEFAULT snowflake(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "issue_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_classes" (
    "student_nc" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,

    CONSTRAINT "student_classes_pkey" PRIMARY KEY ("student_nc","class_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "classes_subject_id_teacher_id_group_semester_career_id_key" ON "classes"("subject_id", "teacher_id", "group", "semester", "career_id");

-- CreateIndex
CREATE UNIQUE INDEX "laboratories_name_key" ON "laboratories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "careers_name_key" ON "careers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "careers_alias_key" ON "careers"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "machines_serie_key" ON "machines"("serie");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_registered_by_fkey" FOREIGN KEY ("registered_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "laboratories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_reservations" ADD CONSTRAINT "software_reservations_software_id_fkey" FOREIGN KEY ("software_id") REFERENCES "software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_reservations" ADD CONSTRAINT "software_reservations_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_student_nc_fkey" FOREIGN KEY ("student_nc") REFERENCES "students"("nc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "laboratories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_laboratory_id_fkey" FOREIGN KEY ("laboratory_id") REFERENCES "laboratories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
