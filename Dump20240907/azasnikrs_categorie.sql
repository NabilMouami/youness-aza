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
-- Table structure for table `categorie`
--

DROP TABLE IF EXISTS `categorie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorie` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(245) DEFAULT NULL,
  `image` varchar(245) DEFAULT NULL,
  `meta_image` varchar(245) DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `meta_description` longtext,
  `link` varchar(245) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorie`
--

LOCK TABLES `categorie` WRITE;
/*!40000 ALTER TABLE `categorie` DISABLE KEYS */;
INSERT INTO `categorie` VALUES (1,'Air-Jordan-1','1722632830523.png','Math',1,'La marque est principalement associée à la série des 35 chaussures de basket créées pour le célèbre basketteur jusqu\'en 2009. Inspirées par la personnalité du joueur ou par ses passions, ces sneakers se voulaient être les plus avant-gardistes du marché tant au niveau de la technique que du design',NULL),(2,'Air-Force-1','1719423551297.png','ffdf',2,'La Air Force 1 a été une première pour Nike. Elle a été la première basket à intégrer la technologie révolutionnaire d\'amorti Air du Swoosh au talon, et également la première expérimentation de la construction à forme coulissante, un procédé encore utilisé aujourd\'hui dans la fabrication de baskets.',NULL),(3,'Nike-Dunk','1725038515042.webp','dunk casablanca',3,'La Nike Dunk est unique en son genre, en quelque sorte. En fait, elle associe le meilleur de deux silhouettes emblématiques de Nike Basketball : la Terminator et la Air Jordan 1. Conçue par Peter Moore, l\'intemporelle Nike Dunk a été lancée à l\'origine en 1985.',NULL),(6,'Adidas','1725494609182.jpeg','adidas maroc casablanca',NULL,'adidas est un acronyme formé à partir du surnom d\'Adolf « Adi » et des trois premières lettres de son nom, Dassler. Avec la fondation d\'adidas, la marque déposée des trois bandes a également été déposée. Aujourd\'hui encore, les trois bandes sont le signe distinctif numéro un d\'adidas et l\'un des logos de marque les plus célèbres. adidas est devenu célèbre à l\'échelle internationale après la victoire de l\'équipe allemande de football à la Coupe du monde de 1954 à Berne, où adidas a entièrement équipé l\'équipe de ses chaussures de football. En plus des chaussures de football, adidas a également commencé à fabriquer des chaussures de course et à développer de nouvelles technologies. À ce jour, Torsion, adiPRENE et BOOST font partie des technologies les plus connues d\'adidas.',NULL),(7,'New-Balance','1725494706941.jpeg','new balance maroc casablanca',NULL,'New Balance was founded in 1903 by the English immigrant William J. Riley in Boston, Massachusetts. The 33-year old shoemaker wanted to help people, who had problems with their feet by developing inlay soles and special shoes.',NULL),(8,'Nike','1725494761646.jpeg','Nike casablanca maroc',NULL,'Nike est devenue l\'une des marques les plus prospères et les plus populaires au monde depuis sa création en 1963. BRS a été fondée par Bill Bowerman, qui était l\'entraîneur d\'athlétisme à l\'Université de Portland, et un coureur de demi-fond nommé Phil Knight.',NULL),(9,'nike-air-max-2017','1725715380479.png','nike air max casa maroc',NULL,NULL,NULL);
/*!40000 ALTER TABLE `categorie` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-07 16:07:35
