USE copy_e_lisensya;

-- 1. Table for tracking the student's physical check-in footprint
-- (Captures data for COMPLETED and REJECTED rows)
CREATE TABLE `permit_arrival` (
    `permit_id` INT(11) NOT NULL,
    `arrival_date` DATE NOT NULL,
    `arrival_time` TIME NOT NULL,
    PRIMARY KEY (`permit_id`),
    CONSTRAINT `fk_arrival_permit` FOREIGN KEY (`permit_id`) REFERENCES `permit` (`permit_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Table for tracking administrative check-in verification reviews
-- (Captures data for COMPLETED and REJECTED rows)
CREATE TABLE `permit_validation` (
    `permit_id` INT(11) NOT NULL,
    `personnel_id` INT(11) NOT NULL,
    `validated_date` DATE NOT NULL,
    `validated_time` TIME NOT NULL,
    PRIMARY KEY (`permit_id`),
    CONSTRAINT `fk_validation_permit` FOREIGN KEY (`permit_id`) REFERENCES `permit` (`permit_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_validation_personnel` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`personal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Extract arrival logs cleanly where data is explicitly recorded
INSERT INTO `permit_arrival` (`permit_id`, `arrival_date`, `arrival_time`)
SELECT `permit_id`, `arrival_date`, `arrival_time`
FROM `permit`
WHERE `arrival_date` IS NOT NULL AND `arrival_time` IS NOT NULL;

-- Extract administrative actions cleanly using native validation logs
INSERT INTO `permit_validation` (`permit_id`, `personnel_id`, `validated_date`, `validated_time`)
SELECT 
    `permit_id`, 
    `personnel_id`, 
    `validated_date`, 
    `validated_time`
FROM `permit`
WHERE `status` IN ('COMPLETED', 'REJECTED')
  AND `personnel_id` IS NOT NULL
  AND `validated_date` IS NOT NULL 
  AND `validated_time` IS NOT NULL;


-- Remove old foreign key restriction first to unlock the table structural schema
ALTER TABLE `permit` DROP FOREIGN KEY `fk_permit_personnel`;

-- Drop old redundant transaction attributes to establish strict 3NF
ALTER TABLE `permit` 
  DROP COLUMN `personnel_id`,
  DROP COLUMN `arrival_date`,
  DROP COLUMN `arrival_time`,
  DROP COLUMN `validated_date`,
  DROP COLUMN `validated_time`;