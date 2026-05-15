-- 1. ROOMS 
INSERT INTO `room` (`room_number`, `curr_occupancy`, `room_capacity`) VALUES
(1, 4, 4), (2, 3, 4), (3, 2, 4), (4, 0, 4), (5, 4, 4),
(6, 0, 4), (7, 0, 4), (8, 0, 4), (9, 0, 4), (10, 2, 4),
(11, 0, 4), (12, 0, 4), (13, 0, 4), (14, 0, 4), (15, 0, 4),
(16, 0, 4), (17, 0, 4), (18, 0, 4), (19, 0, 4), (20, 0, 4);

-- 2. PERSONS 
INSERT INTO `person` (`personal_id`, `first_name`, `last_name`, `birthday`) VALUES
(1, 'Alice', 'Guillen', '2003-05-15'), (2, 'Bob', 'Marley', '2002-11-20'),
(3, 'Charlie', 'Puth', '2004-01-10'), (4, 'Diana', 'Ross', '1985-06-30'), -- Staff
(5, 'Edward', 'Norton', '1990-02-12'), -- Staff
(6, 'Fiona', 'Gallagher', '2003-08-25'), (7, 'George', 'Miller', '2002-03-14'),
(8, 'Hannah', 'Baker', '2004-12-05'), (9, 'Ian', 'Somerhalder', '2001-07-07'),
(10, 'Julia', 'Roberts', '2003-10-31'), (11, 'Kevin', 'Hart', '2002-09-12'),
(12, 'Lana', 'Del Rey', '2003-06-21'), (13, 'Mark', 'Zuckerberg', '2004-05-14'),
(14, 'Niana', 'Guerrero', '2006-01-27'), (15, 'Olivia', 'Rodrigo', '2003-02-20'),
(16, 'Peter', 'Parker', '2005-08-10'), (17, 'Quinn', 'Fabray', '2004-03-30');

-- 3. STUDENT DETAILS 
INSERT INTO `student` (`personal_id`, `program`, `year_level`, `room_number`) VALUES
-- Room 1 (4 Students)
(1, 'BS in Computer Science', 3, 1),
(2, 'BS in Statistics', 4, 1),
(3, 'BA in Political Science', 2, 1),
(6, 'BS in Public Health', 1, 1),
-- Room 2 (3 Students)
(7, 'BS in Biology', 3, 2),
(8, 'BS in Accountancy', 2, 2),
(9, 'BA in Psychology', 4, 2),
-- Room 3 (2 Students)
(10, 'BS in Fisheries', 1, 3),
(11, 'BS in Food Technology', 3, 3),
-- Room 5 (4 Students)
(12, 'BS in Applied Mathematics', 3, 5),
(13, 'BS in Chemical Engineering', 2, 5),
(14, 'BA in Communication and Media Studies', 1, 5),
(15, 'BA in History', 2, 5),
-- Room 10 (2 Students)
(16, 'BS in Economics', 2, 10),
(17, 'BA in Sociology', 3, 10);

-- 4. PERSONNEL DETAILS
INSERT INTO `personnel` (`personal_id`, `job_title`, `work_status`) VALUES
(4, 'Dorm Manager', 'Active'),
(5, 'Caretaker', 'Active');

-- 5. PERMITS (Status includes: COMPLETED, BREACHED, PENDING)
-- COMPLETED
INSERT INTO `permit` (`student_id`, `personnel_id`, `permit_name`, `status`, `date_created`, `time_created`, `arrival_date`, `arrival_time`) VALUES
(1, 4, 'Late', 'COMPLETED', '2026-05-10', '14:30:00', '2026-05-10', '22:15:00'),
(12, 5, 'Late', 'COMPLETED', '2026-05-15', '17:45:00', '2026-05-15', '22:50:00'),
(13, 5, 'Overnight', 'COMPLETED', '2026-05-14', '16:20:00', '2026-05-15', '21:30:00'),
(16, 4, 'Weekend', 'COMPLETED', '2026-05-08', '10:00:00', '2026-05-10', '18:00:00'),
(2, 4, 'Late', 'COMPLETED', '2026-05-15', '17:00:00', '2026-05-15', '22:55:00');

-- BREACHED 
INSERT INTO `permit` (`student_id`, `personnel_id`, `permit_name`, `status`, `date_created`, `time_created`, `arrival_date`, `arrival_time`) VALUES
(3, 4, 'Late', 'BREACHED', '2026-05-14', '17:00:00', NULL, NULL),
(7, 4, 'Overnight', 'BREACHED', '2026-05-13', '09:00:00', NULL, NULL),
(15, 5, 'Late', 'BREACHED', '2026-05-15', '17:30:00', NULL, NULL); 

-- 6. CONTACTS 
INSERT INTO `person_contact` (`personal_id`, `contact_number`) VALUES
(1, '0917-111-2222'), (2, '0918-222-3333'), (3, '0919-333-4444'),
(4, '0920-444-5555'), (5, '0921-555-6666'), (6, '0922-666-7777'),
(7, '0923-777-8888'), (8, '0924-888-9999'), (9, '0925-999-0000'),
(10, '0926-123-4567'), (11, '0927-234-5678'), (12, '0928-345-6789'),
(13, '0929-456-7890'), (14, '0930-567-8901'), (15, '0931-678-9012'),
(16, '0932-789-0123'), (17, '0933-890-1234');