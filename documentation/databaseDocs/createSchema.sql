CREATE TABLE `person` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `Role` varchar(45) NOT NULL,
  `Username` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `personId_UNIQUE` (`Id`),
  UNIQUE KEY `Username_UNIQUE` (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


CREATE TABLE `consulta_db`.`event` (
  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `PersonId` INT UNSIGNED NOT NULL,
  `Mon` BIT NOT NULL,
  `Tue` BIT NOT NULL,
  `Wed` BIT NOT NULL,
  `Thu` BIT NOT NULL,
  `Fri` BIT NOT NULL,
  `StartTime` TIME NOT NULL,
  `Duration` INT NOT NULL,
  `Repeats` BIT NOT NULL,
  `Description` VARCHAR(45) NOT NULL,
  `FirstOccurrence` DATE NOT NULL,
  `LastOccurrence` DATE NOT NULL,
  `SlotsPerDay` INT NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  INDEX `fk_event_person_idx` (`PersonId` ASC) VISIBLE,
  CONSTRAINT `fk_event_person`
    FOREIGN KEY (`PersonId`)
    REFERENCES `consulta_db`.`person` (`Id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION);

CREATE TABLE `consulta_db`.`event_booking` (
  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `eventId` INT UNSIGNED NOT NULL,
  `personId` INT UNSIGNED NOT NULL,
  `Date` DATE NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  INDEX `fk_eventBooking_person_idx` (`personId` ASC) VISIBLE,
  INDEX `fk_eventBooking_event_idx` (`eventId` ASC) VISIBLE,
  CONSTRAINT `fk_eventBooking_person`
    FOREIGN KEY (`personId`)
    REFERENCES `consulta_db`.`person` (`Id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_eventBooking_event`
    FOREIGN KEY (`eventId`)
    REFERENCES `consulta_db`.`event` (`Id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION);
