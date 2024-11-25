import { relations } from 'drizzle-orm'
import {
    bigint,
    boolean,
    foreignKey,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
} from 'drizzle-orm/pg-core'

export const States = pgEnum('States', ['AVAILABLE', 'MAINTENANCE'])

export const User = pgTable('users', {
    id: text('id').notNull().primaryKey(),
    name: text('name').notNull(),
    roles: bigint('roles', { mode: 'bigint' }).notNull().default(2n),
    created_at: timestamp('created_at', { precision: 3 })
        .notNull()
        .defaultNow(),
    username: text('username').notNull().unique(),
})

export const Password = pgTable(
    'passwords',
    {
        id: text('id').notNull().primaryKey(),
        user_id: text('user_id').notNull(),
        password: text('password').notNull(),
        created_at: timestamp('created_at', { precision: 3 })
            .notNull()
            .defaultNow(),
    },
    Password => ({
        passwords_user_fkey: foreignKey({
            name: 'passwords_user_fkey',
            columns: [Password.user_id],
            foreignColumns: [User.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
    }),
)

export const Subject = pgTable('subjects', {
    id: text('id').notNull().primaryKey(),
    name: text('name').notNull(),
    created_at: timestamp('created_at', { precision: 3 })
        .notNull()
        .defaultNow(),
    practice_hours: integer('practice_hours').notNull(),
    theory_hours: integer('theory_hours').notNull(),
})

export const UsersSubjects = pgTable(
    'UsersSubjects',
    {
        user_id: text('user_id').notNull(),
        subject_id: text('subject_id').notNull(),
    },
    UsersSubjects => ({
        UsersSubjects_user_fkey: foreignKey({
            name: 'UsersSubjects_user_fkey',
            columns: [UsersSubjects.user_id],
            foreignColumns: [User.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
        UsersSubjects_subject_fkey: foreignKey({
            name: 'UsersSubjects_subject_fkey',
            columns: [UsersSubjects.subject_id],
            foreignColumns: [Subject.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
        UsersSubjects_cpk: primaryKey({
            name: 'UsersSubjects_cpk',
            columns: [UsersSubjects.user_id, UsersSubjects.subject_id],
        }),
    }),
)

export const Laboratory = pgTable('laboratories', {
    id: text('id').notNull().primaryKey(),
    created_at: timestamp('created_at', { precision: 3 })
        .notNull()
        .defaultNow(),
    name: text('name').notNull().unique(),
    open_hour: integer('open_hour').notNull(),
    close_hour: integer('close_hour').notNull(),
    common_use: boolean('common_use').notNull(),
})

export const Practice = pgTable(
    'practices',
    {
        id: text('id').notNull().primaryKey(),
        user_id: text('user_id').notNull(),
        subject_id: text('subject_id').notNull(),
        topic: text('topic').notNull(),
        name: text('name').notNull(),
        software: text('software').notNull(),
        created_at: timestamp('created_at', { precision: 3 })
            .notNull()
            .defaultNow(),
        students: integer('students'),
        registered_by: text('registered_by').notNull(),
        laboratory_id: text('laboratory_id').notNull(),
    },
    Practice => ({
        practices_user_fkey: foreignKey({
            name: 'practices_user_fkey',
            columns: [Practice.user_id],
            foreignColumns: [User.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
        practices_subject_fkey: foreignKey({
            name: 'practices_subject_fkey',
            columns: [Practice.subject_id],
            foreignColumns: [Subject.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
        practices_registered_fkey: foreignKey({
            name: 'practices_registered_fkey',
            columns: [Practice.registered_by],
            foreignColumns: [User.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
        practices_laboratory_fkey: foreignKey({
            name: 'practices_laboratory_fkey',
            columns: [Practice.laboratory_id],
            foreignColumns: [Laboratory.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
    }),
)

export const Career = pgTable('careers', {
    id: text('id').notNull().primaryKey(),
    name: text('name').notNull().unique(),
    created_at: timestamp('created_at', { precision: 3 })
        .notNull()
        .defaultNow(),
})

export const student = pgTable(
    'students',
    {
        nc: text('nc').notNull().primaryKey(),
        lastname: text('lastname').notNull(),
        firstname: text('firstname').notNull(),
        semester: integer('semester').notNull(),
        created_at: timestamp('created_at', { precision: 3 })
            .notNull()
            .defaultNow(),
        career_id: text('career_id').notNull(),
    },
    student => ({
        students_career_fkey: foreignKey({
            name: 'students_career_fkey',
            columns: [student.career_id],
            foreignColumns: [Career.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
    }),
)

export const Visit = pgTable(
    'visits',
    {
        id: text('id').notNull().primaryKey(),
        created_at: timestamp('created_at', { precision: 3 })
            .notNull()
            .defaultNow(),
        exit_at: timestamp('exit_at', { precision: 3 }).notNull(),
        student_nc: text('student_nc').notNull(),
        laboratory_id: text('laboratory_id').notNull(),
        machine_id: text('machine_id').notNull(),
    },
    Visit => ({
        visits_student_fkey: foreignKey({
            name: 'visits_student_fkey',
            columns: [Visit.student_nc],
            foreignColumns: [student.nc],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
        visits_laboratory_fkey: foreignKey({
            name: 'visits_laboratory_fkey',
            columns: [Visit.laboratory_id],
            foreignColumns: [Laboratory.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
        visits_machine_fkey: foreignKey({
            name: 'visits_machine_fkey',
            columns: [Visit.machine_id],
            foreignColumns: [Machine.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
    }),
)

export const Machine = pgTable(
    'machines',
    {
        id: text('id').notNull().primaryKey(),
        number: integer('number').notNull(),
        status: States('status').notNull().default('AVAILABLE'),
        processor: text('processor').notNull(),
        ram: text('ram').notNull(),
        storage: text('storage').notNull(),
        description: text('description').notNull(),
        laboratory_id: text('laboratory_id').notNull(),
        created_at: timestamp('created_at', { precision: 3 })
            .notNull()
            .defaultNow(),
    },
    Machine => ({
        machines_laboratory_fkey: foreignKey({
            name: 'machines_laboratory_fkey',
            columns: [Machine.laboratory_id],
            foreignColumns: [Laboratory.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
    }),
)

export const Report = pgTable(
    'reports',
    {
        id: text('id').notNull().primaryKey(),
        created_at: timestamp('created_at', { precision: 3 })
            .notNull()
            .defaultNow(),
        comment: text('comment').notNull(),
        machine_id: text('machine_id').notNull(),
        checked_at: timestamp('checked_at', { precision: 3 }),
    },
    Report => ({
        reports_machine_fkey: foreignKey({
            name: 'reports_machine_fkey',
            columns: [Report.machine_id],
            foreignColumns: [Machine.id],
        })
            .onDelete('cascade')
            .onUpdate('cascade'),
    }),
)

export const UserRelations = relations(User, ({ many }) => ({
    passwords: many(Password, {
        relationName: 'PasswordToUser',
    }),
    users_subjects: many(UsersSubjects, {
        relationName: 'UserToUsersSubjects',
    }),
    practices: many(Practice, {
        relationName: 'PracticeToUser',
    }),
    registered: many(Practice, {
        relationName: 'registered',
    }),
}))

export const PasswordRelations = relations(Password, ({ one }) => ({
    user: one(User, {
        relationName: 'PasswordToUser',
        fields: [Password.user_id],
        references: [User.id],
    }),
}))

export const SubjectRelations = relations(Subject, ({ many }) => ({
    users_subjects: many(UsersSubjects, {
        relationName: 'SubjectToUsersSubjects',
    }),
    practices: many(Practice, {
        relationName: 'PracticeToSubject',
    }),
}))

export const UsersSubjectsRelations = relations(UsersSubjects, ({ one }) => ({
    user: one(User, {
        relationName: 'UserToUsersSubjects',
        fields: [UsersSubjects.user_id],
        references: [User.id],
    }),
    subject: one(Subject, {
        relationName: 'SubjectToUsersSubjects',
        fields: [UsersSubjects.subject_id],
        references: [Subject.id],
    }),
}))

export const LaboratoryRelations = relations(Laboratory, ({ many }) => ({
    practices: many(Practice, {
        relationName: 'LaboratoryToPractice',
    }),
    machines: many(Machine, {
        relationName: 'LaboratoryToMachine',
    }),
    Visits: many(Visit, {
        relationName: 'LaboratoryToVisit',
    }),
}))

export const PracticeRelations = relations(Practice, ({ one }) => ({
    user: one(User, {
        relationName: 'PracticeToUser',
        fields: [Practice.user_id],
        references: [User.id],
    }),
    subject: one(Subject, {
        relationName: 'PracticeToSubject',
        fields: [Practice.subject_id],
        references: [Subject.id],
    }),
    registered: one(User, {
        relationName: 'registered',
        fields: [Practice.registered_by],
        references: [User.id],
    }),
    laboratory: one(Laboratory, {
        relationName: 'LaboratoryToPractice',
        fields: [Practice.laboratory_id],
        references: [Laboratory.id],
    }),
}))

export const CareerRelations = relations(Career, ({ many }) => ({
    students: many(student, {
        relationName: 'CareerTostudent',
    }),
}))

export const studentRelations = relations(student, ({ one, many }) => ({
    career: one(Career, {
        relationName: 'CareerTostudent',
        fields: [student.career_id],
        references: [Career.id],
    }),
    visits: many(Visit, {
        relationName: 'VisitTostudent',
    }),
}))

export const VisitRelations = relations(Visit, ({ one }) => ({
    student: one(student, {
        relationName: 'VisitTostudent',
        fields: [Visit.student_nc],
        references: [student.nc],
    }),
    laboratory: one(Laboratory, {
        relationName: 'LaboratoryToVisit',
        fields: [Visit.laboratory_id],
        references: [Laboratory.id],
    }),
    machine: one(Machine, {
        relationName: 'MachineToVisit',
        fields: [Visit.machine_id],
        references: [Machine.id],
    }),
}))

export const MachineRelations = relations(Machine, ({ one, many }) => ({
    laboratory: one(Laboratory, {
        relationName: 'LaboratoryToMachine',
        fields: [Machine.laboratory_id],
        references: [Laboratory.id],
    }),
    reports: many(Report, {
        relationName: 'MachineToReport',
    }),
    Visits: many(Visit, {
        relationName: 'MachineToVisit',
    }),
}))

export const ReportRelations = relations(Report, ({ one }) => ({
    machine: one(Machine, {
        relationName: 'MachineToReport',
        fields: [Report.machine_id],
        references: [Machine.id],
    }),
}))
