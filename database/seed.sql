-- --------------- CREATE TABLES ---------------
CREATE TABLE `person`
(
    `personal_id`int(11) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) NOT NULL,
    `birthday` date NOT NULL,
    PRIMARY KEY (`personal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `room`
(
    `room_number` int(11) NOT NULL,
    `curr_occupancy` int(11) NOT NULL,
    `room_capacity` int(11) NOT NULL,
    PRIMARY KEY (`room_number`),
    CONSTRAINT `room_not_full`CHECK(`curr_occupancy`<=`room_capacity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `permit_details`
(
    `permit_type` int(11) NOT NULL,
    `permit_name` varchar(30) NOT NULL,
    PRIMARY KEY (`permit_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `person_contact`
(
    `contact_id`int(11) NOT NULL AUTO_INCREMENT,
    `personal_id` int(11) NOT NULL,
    `contact_info` varchar(255) NOT NULL,
    PRIMARY KEY (`contact_id`),
    FOREIGN KEY (`personal_id`) REFERENCES `person`(`personal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `personnel`
(
    `personnel_id`int(11) NOT NULL,
    `work_status` varchar(30) NOT NULL,
    PRIMARY KEY (`personnel_id`),
    FOREIGN KEY (`personnel_id`) REFERENCES `person`  (`personal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `student` 
(
    `personal_id`int(11) NOT NULL,
    `program` varchar(30) NOT NULL,
    `year_level` int(11) NOT NULL CHECK (`year_level`>0),
    `room_number` int(11) NOT NULL,
    PRIMARY KEY (`personal_id`),
    FOREIGN KEY (`personal_id`) REFERENCES `person`(`personal_id`),
    FOREIGN KEY (`room_number`) REFERENCES `room`(`room_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `shifts` 
(
    `shift_id`int(11) NOT NULL AUTO_INCREMENT,
    `personnel_id` int(11) NOT NULL,
    `shift_start` datetime NOT NULL,
    `shift_end` datetime NOT NULL,
    PRIMARY KEY (`shift_id`),
    FOREIGN KEY (`personnel_id`) REFERENCES `personnel`(`personnel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `permit` 
(
    `permit_id`int(11) NOT NULL AUTO_INCREMENT,
    `student_id` int(11) NOT NULL,
    `dorm_id` int(11) NOT NULL,
    `personnel_id` int(11) NOT NULL,
    `permit_type` int(11) NOT NULL,
    `status` varchar(30) NOT NULL,
    `time_created` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`permit_id`),
    FOREIGN KEY (`student_id`) REFERENCES `student`(`personal_id`),
    FOREIGN KEY (`dorm_id`) REFERENCES `room`(`room_number`),
    FOREIGN KEY (`personnel_id`) REFERENCES `personnel`(`personnel_id`),
    FOREIGN KEY (`permit_type`) REFERENCES `permit_details`(`permit_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- --------------- POPULATE TABLES ---------------
    -- person
INSERT INTO `person` (`first_name`, `last_name`, `birthday`) VALUES 
('Scoobydoo', 'Dog', '2007-05-15'),          -- id# 1
('Steven', 'Quartz', '2005-02-20'),          -- id# 2 
('Kick', 'Buttowski', '2009-05-17'),         -- id# 3
('Steven', 'Universe', '2003-03-31'),        -- id# 4 gow steven <3
('Garnet', 'Universe', '1980-06-21');        -- id# 5

    -- room
INSERT INTO `room` (`room_number`, `curr_occupancy`, `room_capacity`) VALUES 
(1, 2, 4),  
(2, 2, 4);

    -- permit details 
INSERT INTO `permit_details` (`permit_type`, `permit_name`) VALUES 
(1, 'Late Night Permit'),
(2, 'Overnight Permit'),
(3, 'Weekend Permit');

    -- student
INSERT INTO `student` (`personal_id`, `program`, `year_level`, `room_number`) VALUES 
(1, 'BSCS', 2, 1),  -- scoobydoo
(2, 'BSA', 4, 2),   -- steven
(3, 'BSCS', 3, 2),  -- kick buttowski
(4, 'BSA', 4, 1);   -- steven universe

   -- personnel
-- Kick buttowski
INSERT INTO `personnel` (`personnel_id`, `work_status`) VALUES
(5, 'on_duty');

   -- shifts 
INSERT INTO `shifts` (`personnel_id`, `shift_start`, `shift_end`) VALUES
(5, '2026-05-11 08:00:00', '2026-05-11 17:00:00');

   -- contact 
INSERT INTO `person_contact` (`personal_id`, `contact_info`) VALUES 
(1, '09996767675');

   -- permit 
INSERT INTO `permit` (`student_id`, `dorm_id`, `personnel_id`, `permit_type`, `status`) VALUES 
(1, 1, 5, 1, 'Approved');
