ALTER TABLE `person` 
ADD COLUMN `username` VARCHAR(255) NULL,
ADD COLUMN `password` VARCHAR(255) NULL,
ADD COLUMN `is_student` BOOLEAN NOT NULL DEFAULT FALSE;

DELIMITER $$

CREATE TRIGGER `before_person_insert`
BEFORE INSERT ON `person`
FOR EACH ROW
BEGIN
    IF NEW.`username` IS NULL OR NEW.`username` = '' THEN
        SET NEW.`username` = LOWER(REPLACE(CONCAT(NEW.`first_name`, NEW.`last_name`), ' ', ''));
    END IF;

    IF NEW.`password` IS NULL OR NEW.`password` = '' THEN
        SET NEW.`password` = LOWER(REPLACE(CONCAT(NEW.`last_name`), ' ', ''));
    END IF;
END$$

DELIMITER ;

UPDATE `person`
SET 
  `username` = LOWER(REPLACE(CONCAT(`first_name`, `last_name`), ' ', '')),
  `password` = LOWER(REPLACE(CONCAT(`last_name`), ' ', ''))
WHERE `username` IS NULL OR `username` = '';

UPDATE `person` 
SET
	is_student = 1
WHERE personal_id != 4 and personal_id != 5;