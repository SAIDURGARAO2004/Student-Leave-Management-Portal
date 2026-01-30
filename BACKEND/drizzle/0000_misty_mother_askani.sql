CREATE TABLE `leave_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` varchar(50) NOT NULL,
	`student_name` varchar(100) NOT NULL,
	`student_email` varchar(100),
	`class_name` varchar(50),
	`teacher_id` varchar(50),
	`teacher_name` varchar(100),
	`leave_type` varchar(50),
	`start_date` varchar(20),
	`end_date` varchar(20),
	`total_days` int,
	`reason` text,
	`parent_contact` varchar(20),
	`status` varchar(20) DEFAULT 'pending',
	`teacher_comment` text,
	`submitted_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`processed_at` datetime,
	`processed_by` varchar(100),
	CONSTRAINT `leave_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` varchar(50),
	`leave_id` int,
	`title` varchar(200),
	`message` text,
	`is_read` boolean DEFAULT false,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
