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
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` mediumtext,
  `description` longtext,
  `image` varchar(245) DEFAULT NULL,
  `meta_image` varchar(245) DEFAULT NULL,
  `date_created` date DEFAULT NULL,
  `categorie_blog_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categorie_blog_id_idx` (`categorie_blog_id`),
  CONSTRAINT `categorie_blog_id` FOREIGN KEY (`categorie_blog_id`) REFERENCES `categorie` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
INSERT INTO `blog` VALUES (1,'nike 45 is good for price','La description est la présentation de lieux, de personnages ou d\'événements dans un récit. En littérature, la description constitue une pause dans le récit, où elle peut former un ensemble autonome, bien que le plus souvent elle prenne place dans la narration.','1724262910901.webp','nike 45 casablanca yazasneakers','2022-08-30',1),(2,'Les sorties Jordan du Printemps 2022 qu\'il ne faudra pas manquer','Depuis sa création en 1985,  est la marque de sneakers que tout le monde s\'arrache. Alors que les sorties s\'accumulent à l\'image de la récente , toutes les sorties du Jumpman semblent créer l\'évènement et toucher toutes les générations. , , , ... les paires de MJ comptent parmi les  les plus prisées et ce depuis plusieurs saisons. Alors pour essayer d\'acheter la paire de vos rêves pour la saison Printemps 2022 de la marque, voici un calendrier des sorties Jordan à ne pas manquer.','1724437983606.png','ddrrtrfr','2022-07-23',1),(3,'nike 45 is good for price detta','La description est la présentation de lieux, de personnages ou d\'événements dans un récit. En littérature, la description constitue une pause dans le récit, où elle peut former un ensemble autonome, bien que le plus souvent elle prenne place dans ...','1724262910901.webp','nike 45 casablanca yazasneakers','2022-09-30',2),(4,'nike 45 is good for price drff','La description est la présentation de lieux, de personnages ou d\'événements dans un récit. En littérature, la description constitue une pause dans le récit, où elle peut former un ensemble autonome, bien que le plus souvent elle prenne place dans ...','1724262910901.webp','nike 45 casablanca yazasneakers','2022-08-30',2);
/*!40000 ALTER TABLE `blog` ENABLE KEYS */;
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
