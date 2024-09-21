-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: azasnikrs
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(245) DEFAULT NULL,
  `lastName` varchar(245) DEFAULT NULL,
  `email` varchar(245) DEFAULT NULL,
  `password` varchar(245) DEFAULT NULL,
  `otp` varchar(45) DEFAULT NULL,
  `otpExpiration` datetime(6) DEFAULT NULL,
  `isVerified` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'jkdkdk','jwsjsjj','admin.nabil@gmail.com','$2b$10$l8UqTfO8XdTEfJzRK.pVeOt.WgJXZ4sTx7o4hMOVhP.QRNvCQsKNW',NULL,NULL,NULL),(2,'kadrioui','jamal','jamal.kadrioui@gmail.com','$2b$10$b6Cokzb0EIlITObI9TOC7.aCdVmWc3ug6ScJDtfPbcEDJQ19bEr5W',NULL,NULL,NULL),(4,'Nabil','Mouami','admin.nabil@gmail.com','$2b$10$ZFxZgXqSSOUjWXGTHDDTX.Emf.2BnSdcwlGP5w6JIwbZBWFphRK5y',NULL,NULL,NULL),(5,'Fatima','Mokaddem','fatima.mokaddem@gmail.com','$2b$10$y4TQjKbTDpKsQShv1SnIiOn7N8XAXNwgnBEBtGeO7KAs/lnLDERiW',NULL,NULL,NULL),(6,'Bilal','El-dabbani','bilal.dabbani@gmail.com','$2b$10$1jgYfITBlR4YhRwN99VqXuw5EaiV.HLTj1gu3kdffA/45e1zQ/BzC',NULL,NULL,NULL),(11,'Bill','Gates','bill.mou33@gmail.com','$2b$10$ln9jf7r0fTTgv6S2wNvFxObj4b56aeP88ZYbOlTulT/WvTpnMkcNe',NULL,NULL,1);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-07 16:07:36
