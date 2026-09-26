-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: cms_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaint_types`
--

DROP TABLE IF EXISTS `complaint_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `complaint_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `complaint_types_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaint_types`
--

LOCK TABLES `complaint_types` WRITE;
/*!40000 ALTER TABLE `complaint_types` DISABLE KEYS */;
INSERT INTO `complaint_types` VALUES (1,'IT',5),(2,'Maintenance',6),(3,'Electrical',7),(4,'Cleaning',8),(5,'Plumbing',6),(6,'Furniture',6);
/*!40000 ALTER TABLE `complaint_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `complaints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `complaint_id` varchar(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `complaint_type_id` int(11) DEFAULT NULL,
  `priority` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','open','in_process','resolved','completed','rejected') DEFAULT 'pending',
  `created_by` int(11) DEFAULT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `complaint_id` (`complaint_id`),
  UNIQUE KEY `title` (`title`),
  UNIQUE KEY `description` (`description`(225)) USING HASH,
  KEY `complaint_type_id` (`complaint_type_id`),
  KEY `created_by` (`created_by`),
  KEY `assigned_to` (`assigned_to`),
  CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`complaint_type_id`) REFERENCES `complaint_types` (`id`),
  CONSTRAINT `complaints_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `complaints_ibfk_3` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES (1,'C-001','WiFi Issue',1,'Low','Internet not working','pending',2,NULL,'2026-05-04 11:41:11','2026-05-04 11:41:11'),(2,'C-002','AC Broken',2,'High','AC is not working properly','pending',1,NULL,'2026-05-04 11:41:11','2026-09-25 15:34:12'),(3,'C-003','Light Issue',3,'Medium','Light flickering','pending',2,NULL,'2026-05-04 11:41:11','2026-05-04 11:41:11'),(4,'C-004','Dirty Floor',4,'Low','Needs cleaning','pending',6,NULL,'2026-05-04 11:41:11','2026-05-04 11:41:11'),(5,'CMP-1778003811702','The Room Fan is not working ',3,'Low','since yesterday my room fan is not working and thers summer season please repair the fan ','pending',2,NULL,'2026-05-05 17:56:51','2026-05-05 17:56:51'),(6,'CMP-1778004099979','teacher is not present to class',3,'Low','My class teacher did not attend the class a month ago.\nThis is the loss of our studies, and our exams are coming in 3 weeks \n\nPlease tell the teacher to attend the class and teach us.','pending',2,NULL,'2026-05-05 18:01:39','2026-05-05 18:01:39'),(8,'CMP-1778004810986','Teacher Absence Affecting Studies',2,'High','Our class teacher has been absent for the past month and has not been attending scheduled classes. This has significantly disrupted our studies, especially with exams approaching in the next three weeks.\\n\\nWe are concerned about completing our syllabus on time and preparing adequately. This situation is causing serious academic loss for all students.\\n\\nWe request immediate action to ensure the teacher resumes classes or that an alternative arrangement is made without further delay.','pending',2,NULL,'2026-05-05 18:13:31','2026-05-05 18:13:31'),(9,'CMP-1778005370116','Teacher absent for weeks',2,'Low','Our math teacher has not attended classes for the past 4 weeks. Our exams are in 2 weeks and we have not completed the syllabus. This is seriously affecting our preparation and academic performance. Please take immediate action.','pending',2,NULL,'2026-05-05 18:22:50','2026-05-05 18:22:50'),(10,'CMP-1778006562389','Gas leakage in hostel kitchen',3,'Low','There is a strong smell of gas in the kitchen and it is getting worse. This is dangerous and could cause an explosion. Immediate action is required.','pending',2,NULL,'2026-05-05 18:42:42','2026-05-05 18:42:42'),(13,'CMP-1778008761114','Server is completely down',1,'Low','The complaint management system is not accessible for any users. This is affecting all operations and needs urgent fixing.','pending',2,NULL,'2026-05-05 19:19:21','2026-05-05 19:19:21'),(14,'CMP-1778008808336','Emergency: Water Leak',5,'High','There is a major water pipe burst in the main hallway. The floor is flooding rapidly. This is a safety hazard.','pending',2,NULL,'2026-05-05 19:20:08','2026-05-05 19:20:08'),(16,'CMP-1778072462127','Electricity is not working',3,'Medium',' We have been without electricity for three days. There is no fan, no light, and we cannot study without light. It is too hot outside.','pending',2,16,'2026-05-06 13:01:02','2026-05-06 13:01:02'),(17,'CMP-1783353565368','wifi ',3,'Low','lab wifi is not working properly\n\n','pending',8,16,'2026-07-06 15:59:25','2026-07-06 15:59:25'),(18,'CMP-1790171230083','computer issue',1,'Low','computer is not working at lab in IT department','pending',8,4,'2026-09-23 13:47:10','2026-09-23 13:47:10'),(19,'CMP-1790349922320','restroom cleaning issue',4,'Low','The restrooms on the second floor of the library have not been cleaned all week, resulting in unhygienic conditions and a strong odor','in_process',6,17,'2026-09-25 15:25:22','2026-09-25 15:26:35');
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `complaint_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `complaint_id` (`complaint_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,18,4,5,'test feed','2026-09-24 09:02:09');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Student'),(2,'Staff'),(3,'Manager'),(4,'Administrator'),(5,'IT Staff'),(6,'Maintenance Staff'),(7,'Electrical Staff'),(8,'Cleaning Staff');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `image` varchar(250) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `bio` text DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'student',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Roha','roha@gmail.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',4,'03074681469','Admin','/images/user/female.jpg','Female','2026-05-04 11:41:11','','Pakistan','Punjab','','54000','','student'),(2,'Hafsa Student','hafsa@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',1,'0307','CS','/images/user/female.jpg','Female','2026-05-04 11:41:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(4,'Nabiha','nabiha@gmail.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',5,'0307','IT','/images/user/female.jpg','Female','2026-05-04 11:41:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(5,'Mahmooda','manager1@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',3,'0307','CS','/images/user/female.jpg','Female','2026-05-04 11:41:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(6,'Huba Student','huba@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',1,'0307','CS','/images/user/female.jpg','Female','2026-05-04 11:41:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(7,'Malaika','maint@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',6,'0307','Maintainance','/images/user/female.jpg','Female','2026-05-04 11:41:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(8,'Ali Student','student2@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',1,'03070000011','IT','/images/user/male.jpg','Male','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(9,'Ayesha Student','student3@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',1,'03070000012','ADP','/images/user/female.jpg','Female','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(10,'Male Staff','staff2@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',2,'03070000013','Staff','/images/user/male.jpg','Male','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(11,'Manager User 2','manager2@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',3,'03070000014','Management','/images/user/female.jpg','Female','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(12,'Admin 2','admin2@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',4,'03070000015','Admin','/images/user/male.jpg','Male','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(13,'IT Engineer 2','it2@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',5,'03070000016','IT','/images/user/male.jpg','Male','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(14,'IT Support Female','it3@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',5,'03070000017','IT','/images/user/female.jpg','Female','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(15,'Maintenance Worker 2','maint2@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',6,'03070000018','Maintenance','/images/user/male.jpg','Male','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(16,'Electrician 2','electric2@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',7,'03070000019','Electrical','/images/user/male.jpg','Male','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(17,'Cleaner 2','clean2@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',8,'03070000020','Cleaning','/images/user/female.jpg','Female','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(18,'Female Staff ','staff@cms.com','$2b$10$A/A5nsntD5bWhL.82B.6lO.LO7KYWhbSz./SY2tS1J9bds9m9bHCy',2,'03070000021','System','/images/user/female.jpg','Other','2026-05-04 11:55:11',NULL,NULL,NULL,NULL,NULL,NULL,'student'),(19,'Minahil Student','Minahila@gmail.com','$2b$10$QyKE3umFqIn9nmFXhzhPtuAmABI6ey5nzh9w3OZIDRUPUS.A8DcDS',1,NULL,'IT','/images/user/female.jpg','Female','2026-09-10 17:01:06',NULL,NULL,NULL,NULL,NULL,NULL,'student');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-26 15:29:23
