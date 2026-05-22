ALTER TABLE `permit` 
DROP FOREIGN KEY `fk_permit_personnel`;

ALTER TABLE `permit` 
MODIFY COLUMN `personnel_id` INT(11) NULL DEFAULT NULL;

ALTER TABLE `permit` 
ADD CONSTRAINT `fk_permit_personnel` 
FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`personal_id`);