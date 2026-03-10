-- MySQL dump 10.13  Distrib 9.5.0, for Win64 (x86_64)
--
-- Host: localhost    Database: repbase
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '3eadfd94-b576-11f0-abe3-bceca01a814e:1-703';

--
-- Table structure for table `exercise`
--

DROP TABLE IF EXISTS `exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise` (
  `exercise_id` int NOT NULL,
  `exercise_name` varchar(100) NOT NULL,
  `equipment` varchar(50) DEFAULT NULL,
  `exercise_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`exercise_id`),
  UNIQUE KEY `exercise_name` (`exercise_name`),
  KEY `idx_exercise_name` (`exercise_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise`
--

LOCK TABLES `exercise` WRITE;
/*!40000 ALTER TABLE `exercise` DISABLE KEYS */;
INSERT INTO `exercise` VALUES (1,'Bench Press','Barbell','Strength'),(2,'Squat','Barbell','Strength'),(3,'Deadlift','Barbell','Strength'),(4,'Pull Up','Bodyweight','Strength'),(5,'Shoulder Press','Dumbbell','Strength');
/*!40000 ALTER TABLE `exercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercise_muscle`
--

DROP TABLE IF EXISTS `exercise_muscle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise_muscle` (
  `exercise_id` int NOT NULL,
  `muscle_id` int NOT NULL,
  `muscle_role` varchar(10) NOT NULL,
  PRIMARY KEY (`exercise_id`,`muscle_id`),
  KEY `exercise_muscle_ibfk_2` (`muscle_id`),
  CONSTRAINT `exercise_muscle_ibfk_1` FOREIGN KEY (`exercise_id`) REFERENCES `exercise` (`exercise_id`),
  CONSTRAINT `exercise_muscle_ibfk_2` FOREIGN KEY (`muscle_id`) REFERENCES `muscle` (`muscle_id`),
  CONSTRAINT `exercise_muscle_chk_role` CHECK ((`muscle_role` in (_cp850'PRIMARY',_cp850'SECONDARY')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise_muscle`
--

LOCK TABLES `exercise_muscle` WRITE;
/*!40000 ALTER TABLE `exercise_muscle` DISABLE KEYS */;
INSERT INTO `exercise_muscle` VALUES (1,1,'PRIMARY'),(1,10,'SECONDARY'),(2,12,'PRIMARY'),(2,17,'SECONDARY'),(3,5,'PRIMARY'),(3,13,'SECONDARY'),(4,3,'PRIMARY'),(4,9,'SECONDARY'),(5,6,'PRIMARY'),(5,10,'SECONDARY');
/*!40000 ALTER TABLE `exercise_muscle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gym`
--

DROP TABLE IF EXISTS `gym`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gym` (
  `gym_id` int NOT NULL,
  `gym_name` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`gym_id`),
  UNIQUE KEY `gym_name` (`gym_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gym`
--

LOCK TABLES `gym` WRITE;
/*!40000 ALTER TABLE `gym` DISABLE KEYS */;
INSERT INTO `gym` VALUES (1,'Iron Gym','New Delhi','123456789'),(2,'Pulse Fitness','New Delhi','987654321');
/*!40000 ALTER TABLE `gym` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gym_admin`
--

DROP TABLE IF EXISTS `gym_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gym_admin` (
  `admin_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `gym_id` int NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`),
  KEY `gym_id` (`gym_id`),
  CONSTRAINT `gym_admin_ibfk_1` FOREIGN KEY (`gym_id`) REFERENCES `gym` (`gym_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gym_admin`
--

LOCK TABLES `gym_admin` WRITE;
/*!40000 ALTER TABLE `gym_admin` DISABLE KEYS */;
INSERT INTO `gym_admin` VALUES (1,'Raj','raj@gmail.com','9000000001',1),(2,'Anita','anita@gmail.com','9000000002',2);
/*!40000 ALTER TABLE `gym_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `major_muscle_group`
--

DROP TABLE IF EXISTS `major_muscle_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `major_muscle_group` (
  `muscle_id` int NOT NULL,
  `muscle_name` varchar(50) NOT NULL,
  PRIMARY KEY (`muscle_id`),
  UNIQUE KEY `muscle_name` (`muscle_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `major_muscle_group`
--

LOCK TABLES `major_muscle_group` WRITE;
/*!40000 ALTER TABLE `major_muscle_group` DISABLE KEYS */;
INSERT INTO `major_muscle_group` VALUES (5,'Arms'),(2,'Back'),(1,'Chest'),(6,'Core'),(7,'Full Body'),(3,'Legs'),(4,'Shoulders');
/*!40000 ALTER TABLE `major_muscle_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `member_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `gym_id` int NOT NULL,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_member_gym` (`gym_id`),
  CONSTRAINT `member_ibfk_1` FOREIGN KEY (`gym_id`) REFERENCES `gym` (`gym_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'Aman','2000-05-12','Male','aman@gmail.com','8000000001',1),(2,'Sneha','1999-08-22','Female','sneha@gmail.com','8000000002',1),(3,'Rohit','2001-03-15','Male','rohit@gmail.com','8000000003',2);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership`
--

DROP TABLE IF EXISTS `membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership` (
  `member_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `start_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`member_id`),
  KEY `idx_membership_plan` (`plan_id`),
  CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `membership_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `membership_plan` (`plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership`
--

LOCK TABLES `membership` WRITE;
/*!40000 ALTER TABLE `membership` DISABLE KEYS */;
INSERT INTO `membership` VALUES (1,1,'2026-01-01','2026-01-30','Active'),(2,2,'2026-01-05','2026-04-04','Active'),(3,3,'2026-01-10','2026-02-08','Active');
/*!40000 ALTER TABLE `membership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership_plan`
--

DROP TABLE IF EXISTS `membership_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership_plan` (
  `plan_id` int NOT NULL,
  `plan_name` varchar(50) NOT NULL,
  `duration` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `access_level` varchar(50) DEFAULT NULL,
  `gym_id` int NOT NULL,
  PRIMARY KEY (`plan_id`),
  KEY `gym_id` (`gym_id`),
  CONSTRAINT `membership_plan_ibfk_1` FOREIGN KEY (`gym_id`) REFERENCES `gym` (`gym_id`),
  CONSTRAINT `membership_plan_chk_1` CHECK ((`price` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership_plan`
--

LOCK TABLES `membership_plan` WRITE;
/*!40000 ALTER TABLE `membership_plan` DISABLE KEYS */;
INSERT INTO `membership_plan` VALUES (1,'Monthly Basic',30,1500.00,'Gym Access',1),(2,'Quarterly Pro',90,4000.00,'Gym + Cardio',1),(3,'Monthly Basic',30,1200.00,'Gym Access',2);
/*!40000 ALTER TABLE `membership_plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `muscle`
--

DROP TABLE IF EXISTS `muscle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `muscle` (
  `muscle_id` int NOT NULL,
  `muscle_name` varchar(50) NOT NULL,
  `major_id` int NOT NULL,
  PRIMARY KEY (`muscle_id`),
  UNIQUE KEY `muscle_name` (`muscle_name`),
  KEY `muscle_ibfk_1` (`major_id`),
  CONSTRAINT `muscle_ibfk_1` FOREIGN KEY (`major_id`) REFERENCES `major_muscle_group` (`muscle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muscle`
--

LOCK TABLES `muscle` WRITE;
/*!40000 ALTER TABLE `muscle` DISABLE KEYS */;
INSERT INTO `muscle` VALUES (1,'Chest',1),(2,'Traps',2),(3,'Lats',2),(4,'Upper Back',2),(5,'Lower Back',2),(6,'Front Delts',4),(7,'Side Delts',4),(8,'Rear Delts',4),(9,'Biceps',5),(10,'Triceps',5),(11,'Forearms',5),(12,'Quadriceps',3),(13,'Hamstrings',3),(14,'Calves',3),(15,'Adductors',3),(16,'Abductors',3),(17,'Glutes',3),(18,'Abdominals',6),(19,'Obliques',6),(20,'Full Body',7);
/*!40000 ALTER TABLE `muscle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL,
  `payment_date` date NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(20) DEFAULT NULL,
  `member_id` int NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `idx_payment_member` (`member_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `membership` (`member_id`),
  CONSTRAINT `payment_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,'2026-01-01',1500.00,'UPI','Completed',1),(2,'2026-01-05',4000.00,'Credit Card','Completed',2),(3,'2026-01-10',1200.00,'Cash','Completed',3);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_membership_after_payment` AFTER INSERT ON `payment` FOR EACH ROW BEGIN
    -- 'Completed' is the standard status seen in your backup data
    IF NEW.payment_status = 'Completed' THEN
        UPDATE membership m
        JOIN membership_plan p ON m.plan_id = p.plan_id
        SET m.expiry_date = DATE_ADD(CURDATE(), INTERVAL p.duration DAY),
            m.status = 'Active'
        WHERE m.member_id = NEW.member_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `set_log`
--

DROP TABLE IF EXISTS `set_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `set_log` (
  `session_id` int NOT NULL,
  `set_no` int NOT NULL,
  `exercise_id` int NOT NULL,
  `reps` int DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`session_id`,`set_no`),
  KEY `exercise_id` (`exercise_id`),
  KEY `idx_setlog_session` (`session_id`),
  CONSTRAINT `set_log_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `workout_session` (`session_id`),
  CONSTRAINT `set_log_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercise` (`exercise_id`),
  CONSTRAINT `set_log_chk_1` CHECK ((`reps` > 0)),
  CONSTRAINT `set_log_chk_2` CHECK ((`weight` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `set_log`
--

LOCK TABLES `set_log` WRITE;
/*!40000 ALTER TABLE `set_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `set_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainer`
--

DROP TABLE IF EXISTS `trainer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainer` (
  `trainer_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `schedule` varchar(100) DEFAULT NULL,
  `gym_id` int NOT NULL,
  PRIMARY KEY (`trainer_id`),
  KEY `gym_id` (`gym_id`),
  CONSTRAINT `trainer_ibfk_1` FOREIGN KEY (`gym_id`) REFERENCES `gym` (`gym_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainer`
--

LOCK TABLES `trainer` WRITE;
/*!40000 ALTER TABLE `trainer` DISABLE KEYS */;
INSERT INTO `trainer` VALUES (1,'Vikram','Strength Training','7000000001','Morning',1),(2,'Neha','Yoga & Mobility','7000000002','Evening',2);
/*!40000 ALTER TABLE `trainer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout_session`
--

DROP TABLE IF EXISTS `workout_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout_session` (
  `session_id` int NOT NULL,
  `workout_date` date NOT NULL,
  `duration` int DEFAULT NULL,
  `member_id` int NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `idx_workout_member` (`member_id`),
  CONSTRAINT `workout_session_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `workout_session_chk_1` CHECK ((`duration` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout_session`
--

LOCK TABLES `workout_session` WRITE;
/*!40000 ALTER TABLE `workout_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `workout_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `check_membership_before_workout` BEFORE INSERT ON `workout_session` FOR EACH ROW BEGIN
    DECLARE m_status VARCHAR(20);
    
    -- Matches table 'membership' and column 'status' from your schema 
    SELECT status INTO m_status 
    FROM membership 
    WHERE member_id = NEW.member_id;

    -- Custom logic: Block if not 'Active'
    IF m_status != 'Active' OR m_status IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Workout denied: Membership is expired or inactive.';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-10 21:51:35
