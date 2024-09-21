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
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom_client` varchar(145) DEFAULT NULL,
  `telephone` varchar(145) DEFAULT NULL,
  `adresse` mediumtext,
  `ville` varchar(145) DEFAULT NULL,
  `code_postal` varchar(145) DEFAULT NULL,
  `email` varchar(145) DEFAULT NULL,
  `prod_id` int DEFAULT NULL,
  `custom_id` int DEFAULT NULL,
  `date_order` varchar(145) DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `order_status` varchar(145) DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `size` varchar(145) DEFAULT NULL,
  `payment_status` varchar(145) DEFAULT NULL,
  `delivery_status` varchar(145) DEFAULT NULL,
  `order_num` int DEFAULT NULL,
  `coins_payed` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prod_id_idx` (`prod_id`),
  KEY `custom_id_idx` (`custom_id`),
  CONSTRAINT `custom_id` FOREIGN KEY (`custom_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `prod_id` FOREIGN KEY (`prod_id`) REFERENCES `produit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'jamal kadrioui','063883842','hay salam rue 33','Mohamedia','4305','kadrioui.jamal@gmail.com',3,2,'2024-07-07 13:50',1,'open',800,'41','COD','OPEN',1,0),(8,'jalil','063883848','hay salam rue 33','Mohamedia','4300','jalil.kadouri@gmail.com',3,2,'2024-07-20 14:50',1,'closed',840,'41','PAID','CONFIRMED',3,0),(9,'Mokaddem Fatima','0639059916','ddfhdhhd','Fes','3690','fatima.mokaddem@gmail.com',10,5,'2024-08-1 23:22',3,'open',400,'40','COD','OPEN',4,0),(10,'Mokaddem Fatima','0639059916','ddfhdhhd','Fes','3690','fatima.mokaddem@gmail.com',11,5,'2024-8-1 23:22',1,'open',600,'42','COD','OPEN',4,0),(11,'Mokaddem Fatima','0639059916','bni chiker','Nador','3690','fatima.mokaddem@gmail.com',12,5,'2024-8-2 20:22',1,'open',800,'42','PAID','DELIVERED',5,0),(12,'kadrioui Jamal','0638838292','Casablanca','Ain Sbai','34500','jamal.kadrioui@gmail.com',12,2,'2024-8-5 10:54',1,'closed',800,'42','PAID','CONFIRMED',6,0),(31,'jamal kadrioui','0744545453','medeva,rue nador','Nador','34000','jamal.kadrioui@gmail.com',3,2,'2024-08-14 17:33',1,'open',350,'40','PAID','OPEN',7,100),(32,'jamal kadrioui','0744545453','medeva,rue nador','Nador','34000','jamal.kadrioui@gmail.com',4,2,'2024-08-14 17:33',1,'open',750,'41','PAID','OPEN',7,100),(41,'Mokaddem Fatima','339949493','Hoceima ttrr,-yyyyi','Hoceima','35600','fatima.mokaddem@gmail.com',4,5,'2024-08-18 12:37',1,'open',750,'41','PAID','OPEN',8,0),(42,'Mokaddem Fatima','339949493','Hoceima ttrr,-yyyyi','Hoceima','35600','fatima.mokaddem@gmail.com',7,5,'2024-08-18 12:37',1,'open',1900,'40','PAID','OPEN',8,0),(43,'Mokaddem Fatima','0648484893','Hoceima ttrr,-yyyyi','Hoceima','35600','fatima.mokaddem@gmail.com',4,5,'2024-08-20 18:14',1,'open',750,'41','COD','OPEN',9,150),(44,'Mokaddem Fatima','0648484893','Hoceima ttrr,-yyyyi','Hoceima','35600','fatima.mokaddem@gmail.com',7,5,'2024-08-20 18:14',1,'open',1900,'40','COD','OPEN',9,150),(45,'Mokaddem Fatima','0639059916','Hoceima ttrr,-yyyyi','Hoceima','35600','fatima.mokaddem@gmail.com',4,5,'2024-08-24 14:15',1,'open',750,'41','PAID','OPEN',10,120),(46,'Mokaddem Fatima','0639059916','Hoceima ttrr,-yyyyi','Hoceima','35600','fatima.mokaddem@gmail.com',7,5,'2024-08-24 14:15',1,'open',1900,'40','PAID','OPEN',10,120),(47,'Gates Bill','0676772745','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',3,11,'2024-08-28 20:58',1,'open',350,'40','COD','OPEN',11,0),(48,'Gates Bill','0676772745','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',14,11,'2024-08-28 20:58',1,'open',540,'40','COD','OPEN',11,0),(49,'Gates Bill','0676772745','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',3,11,'2024-08-28 20:58',1,'open',350,'40','COD','OPEN',11,0),(50,'Gates Bill','0676772745','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',14,11,'2024-08-28 20:58',1,'open',540,'40','COD','OPEN',11,0),(51,'Gates Bill','0639059916','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',3,11,'2024-08-28 21:05',1,'open',350,'40','COD','OPEN',12,0),(52,'Gates Bill','0639059916','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',14,11,'2024-08-28 21:05',1,'open',540,'40','COD','OPEN',12,0),(53,'Medeva Solutions','063883842','Hoceima ttrr,-yyyyi','Hoceima','35600','medeva.solutions@gmail.com',3,11,'2024-08-28 21:15',1,'open',350,'40','COD','OPEN',13,0),(54,'Medeva Solutions','063883842','Hoceima ttrr,-yyyyi','Hoceima','35600','medeva.solutions@gmail.com',14,11,'2024-08-28 21:15',1,'open',540,'40','COD','OPEN',13,0),(55,'Gates Bill','068888888','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',3,11,'2024-08-28 21:21',1,'open',350,'40','PAID','OPEN',14,0),(56,'Gates Bill','068888888','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',14,11,'2024-08-28 21:21',1,'open',540,'40','PAID','OPEN',14,0),(57,'undefined undefined','','','','',NULL,3,5,'2024-08-29 16:29',1,'open',350,'40','COD','OPEN',15,0),(58,'undefined undefined','','','','',NULL,14,5,'2024-08-29 16:29',1,'open',540,'40','COD','OPEN',15,0),(59,'Gates Bill','0688890004','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',14,11,'2024-08-29 16:32',1,'open',540,'40','PAID','OPEN',16,0),(60,'Gates Bill','0688890004','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',13,11,'2024-08-29 16:32',1,'open',400,'40','PAID','OPEN',16,0),(61,'Gates Bill','067888989','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',2,11,'2024-08-29 16:38',1,'open',500,'41','PAID','OPEN',17,0),(62,'Gates Bill','067888989','Hoceima ttrr,-yyyyi','Hoceima','35600','bill.mou33@gmail.com',10,11,'2024-08-29 16:38',1,'open',400,'39','PAID','OPEN',17,0),(63,'Gates Bill','0638838832','ededd','nador','3600','bill.mou33@gmail.com',4,11,'2024-08-29 16:52',1,'open',750,'41','PAID','OPEN',18,0),(64,'Gates Bill','0638838832','ededd','nador','3600','bill.mou33@gmail.com',3,11,'2024-08-29 16:52',1,'open',350,'42','PAID','OPEN',18,0),(65,'mokadem fatima','067677642','Casablanca ,hay erhamna rue 37','mohamedia','34000','fatima.mokaddem@gmail.com',28,5,'2024-08-31 12:42',1,'open',1000,'40','PAID','OPEN',19,499),(66,'mokadem fatima','067677642','Casablanca ,hay erhamna rue 37','mohamedia','34000','fatima.mokaddem@gmail.com',7,5,'2024-08-31 12:42',1,'open',1900,'40','PAID','OPEN',19,499),(67,'Mokaddem Fatima','0768388932','Casablanca ,hay erhamna rue 37','mohamedia','34000','fatima.mokaddem@gmail.com',7,5,'2024-09-01 11:38',1,'open',1900,'40','PAID','OPEN',20,600),(68,'Mokaddem Fatima','0768388932','Casablanca ,hay erhamna rue 37','mohamedia','34000','fatima.mokaddem@gmail.com',4,5,'2024-09-01 11:38',1,'open',750,'41','PAID','OPEN',20,600),(69,'Mokaddem Fatima','07374378934','Farkhana ','Nador','4650','fatima.mokaddem@gmail.com',3,5,'2024-09-01 21:19',1,'open',350,'40','COD','OPEN',21,260),(70,'Mokaddem Fatima','07374378934','Farkhana ','Nador','4650','fatima.mokaddem@gmail.com',4,5,'2024-09-01 21:19',1,'open',750,'41','COD','OPEN',21,260);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-07 16:07:34
