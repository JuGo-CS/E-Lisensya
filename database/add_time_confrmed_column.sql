USE e_lisensya;

ALTER TABLE `permit` 
ADD COLUMN `time_confirmed` TIME NULL DEFAULT NULL;