CREATE DATABASE IF NOT EXISTS e_lisensya;
USE e_lisensya;

-- 1. PERSON
CREATE TABLE `person` (
    `personal_id` int(11) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) NOT NULL,
    `birthday` date NOT NULL,
    PRIMARY KEY (`personal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. PERSON-CONTACT
CREATE TABLE `person_contact` (
    `personal_id` int(11) NOT NULL,
    `contact_number` varchar(255) NOT NULL,
    PRIMARY KEY (`personal_id`, `contact_number`),
    CONSTRAINT `fk_pc_person` FOREIGN KEY (`personal_id`) REFERENCES `person` (`personal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. ROOM
CREATE TABLE `room` (
    `room_number` int(11) NOT NULL,
    `curr_occupancy` int(11) NOT NULL,
    `room_capacity` int(11) NOT NULL,
    PRIMARY KEY (`room_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. STUDENT
CREATE TABLE `student` (
    `personal_id` int(11) NOT NULL,
    `program` varchar(255) NOT NULL,
    `year_level` int(11) NOT NULL,
    `room_number` int(11) NOT NULL,
    PRIMARY KEY (`personal_id`),
    CONSTRAINT `fk_s_person` FOREIGN KEY (`personal_id`) REFERENCES `person` (`personal_id`),
    CONSTRAINT `fk_s_room` FOREIGN KEY (`room_number`) REFERENCES `room` (`room_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. PERSONNEL
CREATE TABLE `personnel` (
    `personal_id` int(11) NOT NULL,
    `job_title` varchar(255) NOT NULL,
    `work_status` varchar(255) NOT NULL,
    PRIMARY KEY (`personal_id`),
    CONSTRAINT `fk_p_person` FOREIGN KEY (`personal_id`) REFERENCES `person` (`personal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 6. PERMIT
CREATE TABLE `permit` (
    `permit_id` int(11) NOT NULL AUTO_INCREMENT,
    `student_id` int(11) NOT NULL,
    `personnel_id` int(11) NOT NULL,
    `permit_name` varchar(255) NOT NULL,
    `status` varchar(255) NOT NULL,
    `date_created` date NOT NULL,
    `time_created` time NOT NULL,
    `arrival_date` date DEFAULT NULL,
    `arrival_time` time DEFAULT NULL,
    PRIMARY KEY (`permit_id`),
    CONSTRAINT `fk_permit_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`personal_id`),
    CONSTRAINT `fk_permit_personnel` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`personal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;