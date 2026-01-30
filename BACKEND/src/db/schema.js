import { mysqlTable, int, varchar, text, datetime, boolean } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const leaveRequests = mysqlTable("leave_requests", {
  id: int("id").primaryKey().autoincrement(),

  studentId: varchar("student_id", { length: 50 }).notNull(),
  studentName: varchar("student_name", { length: 100 }).notNull(),
  studentEmail: varchar("student_email", { length: 100 }),
  className: varchar("class_name", { length: 50 }),

  teacherId: varchar("teacher_id", { length: 50 }),
  teacherName: varchar("teacher_name", { length: 100 }),

  leaveType: varchar("leave_type", { length: 50 }),
  startDate: varchar("start_date", { length: 20 }),
  endDate: varchar("end_date", { length: 20 }),
  totalDays: int("total_days"),

  reason: text("reason"),
  parentContact: varchar("parent_contact", { length: 20 }),

  status: varchar("status", { length: 20 }).default("pending"),
  teacherComment: text("teacher_comment"),

  submittedAt: datetime("submitted_at").default(sql`CURRENT_TIMESTAMP`),
  processedAt: datetime("processed_at"),
  processedBy: varchar("processed_by", { length: 100 })
});

export const notifications = mysqlTable("notifications", {
  id: int("id").primaryKey().autoincrement(),

  studentId: varchar("student_id", { length: 50 }),
  leaveId: int("leave_id"),

  title: varchar("title", { length: 200 }),
  message: text("message"),

  isRead: boolean("is_read").default(false),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`)
});
