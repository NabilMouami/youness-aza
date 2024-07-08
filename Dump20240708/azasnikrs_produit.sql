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
-- Table structure for table `produit`
--

DROP TABLE IF EXISTS `produit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `price_promo` double DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `meta_image` varchar(255) DEFAULT NULL,
  `images` varchar(255) DEFAULT NULL,
  `meta_images` varchar(255) DEFAULT NULL,
  `nemuro_shoes` varchar(255) DEFAULT NULL,
  `description` longtext,
  `hiden` int DEFAULT NULL,
  `out_stock` int DEFAULT NULL,
  `qty` varchar(145) DEFAULT NULL,
  `genre` varchar(145) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produit`
--

LOCK TABLES `produit` WRITE;
/*!40000 ALTER TABLE `produit` DISABLE KEYS */;
INSERT INTO `produit` VALUES (2,'Nike Blazar Mid\'77','air-force-1','old',600,500,'1717257486611.jpg','Nike Blazer Casablanca Maroc','[\"1717257486618.jpg\",\"1717257486629.jpg\",\"1717257486631.jpg\"]','[\"1717257486618.jpg\",\"1717257486629.jpg\",\"1717257486631.jpg\"]','[ \"40\",\"41\",\"42\",\"43\" ]','Imaginée dans les années 70. Adoptée dans les années 80. Sanctifiée dans les années 90. Prête pour la suite. La Nike Blazer Mid ’77 présente un design intemporel et facile à porter. Confortable et incroyablement soignée, son empeigne en cuir brillant s’associe à un logo rétro audacieux et à des détails en daim luxueux pour un confort exceptionnel. La mousse visible sur la languette et la finition spéciale sur la semelle intermédiaire donnent l\'impression que tu as conservé cette paire depuis des décennies. N\'attends plus et entre dans l\'histoire.',0,1,'8','homme'),(3,'Nike Dunk Low','dunk','new',400,350,'1717527214976.png','mike dunk casablanca maroc','[\"1717527214985.png\",\"1717527214988.png\",\"1717527215008.png\"]','[\"1717527214985.png\",\"1717527214988.png\",\"1717527215008.png\"]','[ \"40\",\"41\",\"42\",\"43\" ]','The Nike Dunk Low is an easy score for your closet. This mid-‘80s hoops icon returns with super-durable construction and original colors. With ankle padding and rubber traction, this one is a slam dunk.',0,1,'23','homme'),(4,'Nike Air Max 2017','air-force-1','new',800,750,'1717527834612.png','Nike Air Max 2017 casablanca maroc','[\"1717527834639.jpeg\",\"1717527834645.png\",\"1717527834649.png\"]','[\"1717527834639.jpeg\",\"1717527834645.png\",\"1717527834649.png\"]','[ \"41\",\"42\",\"43\" ]','The Nike Air Max 2017 delivers the plush sensation you love with a full-length Max Air unit. The upper is seamlessly constructed with zonal support and ventilation while molded foam wraps your mid-foot and heel for secure comfort.',0,1,'12','homme'),(7,'Air Jordan 6 Retro \"White/Black\"','air-jordan','new',2000,1900,'1718218956151.png','air jordan nike casablanca','[\"1718218956157.png\",\"1718218956163.png\",\"1718218956169.png\"]','[\"1718218956157.png\",\"1718218956163.png\",\"1718218956169.png\"]','[ \"40\",\"41\",\"42\" ]','MJ wore \'em when he claimed his first championship and you\'ll be wearing \'em for—well, whatever you want. Laden with dynamic design lines and those iconic lace locks, these sneakers bring throwback style to any \'fit. Lace up, and let your kicks do the talking.',0,1,'12','homme'),(8,'Jordan Spizike Low','air-jordan','new',1600,0,'1718219835664.png','Jordane Spizike Casablanca','[\"1718219835673.png\",\"1718219835681.png\",\"1718219835682.png\"]','[\"1718219835673.png\",\"1718219835681.png\",\"1718219835682.png\"]','[ \"41\",\"42\",\"43\" ]','The Spizike takes elements of five classic Jordans, combines them, and gives you one iconic sneaker. It\'s an homage to Spike Lee formally introducing Hollywood and hoops in a culture moment. You get a great looking pair of kicks with some history.',0,1,'10','homme'),(9,'Air Jordan 1 Low OG \"Black/Gorge Green\"','air-jordan','new',400,0,'1718220532372.jpg','air jordan casablanca','[\"1718220532394.png\",\"1718220532424.png\",\"1718220532430.jpg\"]','[\"1718220532394.png\",\"1718220532424.png\",\"1718220532430.jpg\"]','[ \"38\",\"39\" ]','Step into greatness with the Air Jordan 1 Low OG. Updated color and texture gives the all-time favorite fresh identity while staying true to the original design.',0,1,'23','homme'),(10,'Nike Dunk Low Retro SE','dunk','old',400,0,'1718543835676.png','Nike Dunk Low Retro SE Casablanca','[\"1718543835684.png\",\"1718543835694.png\",\"1718543835697.png\"]','[\"1718543835684.png\",\"1718543835694.png\",\"1718543835697.png\"]','[ \"39\",\"40\",\"41\",\"42\" ]','L\'icône du basket des années 80 revient avec des couleurs cultes, du cuir impeccable et un style basket rétro. Le style vintage fait son retour dans ton quotidien. Et son col rembourré te permet de la porter partout dans un confort total.',0,1,'10','homme'),(11,'Air Jordan 1 Retro High','air-jordan','new',600,0,'1718548381103.jpeg','Air Jordan 1 Retro High Casablanca','[\"1718548381117.jpeg\",\"1718548381126.jpeg\",\"1718548381150.jpeg\"]','[\"1718548381117.jpeg\",\"1718548381126.jpeg\",\"1718548381150.jpeg\"]','[ \"41\",\"42\",\"43\" ]','Chaque Jordan Retro est un modèle culte revisité avec de nouvelles couleurs et textures. Cette version s\'inspire de ton jean fétiche pour un style denim épuré. Matières et détails premium dans l\'air du temps.',0,1,'3','homme'),(12,'Air Jordan 1 Mid','air-jordan','new',700,0,'1718549070408.jpeg','Air Jordan 1 Mid Casablanca','[\"1718549070425.png\",\"1718549070427.png\",\"1718549070435.jpeg\"]','[\"1718549070425.png\",\"1718549070427.png\",\"1718549070435.jpeg\"]','[ \"40\",\"40.5\",\"41\",\"42\",\"42.5\",\"43\" ]','Inspiré de la AJ1 originale, ce modèle mi-montant conserve le look emblématique que vous aimez tant, tandis que le choix des couleurs et le cuir impeccable lui confèrent une identité unique.',0,1,'23','homme'),(13,'Jumpman MVP','air-jordan','new',400,0,'1718549356462.png','Jumpman MVP Casablanca','[\"1718549356468.png\",\"1718549356470.png\",\"1718549356480.jpeg\"]','[\"1718549356468.png\",\"1718549356470.png\",\"1718549356480.jpeg\"]','[ \"40\",\"41\",\"42\" ]','Pour cette version remixée, on a eu l\'embarras du choix. On a repris des éléments des AJ6, 7 et 8 pour créer une toute nouvelle chaussure qui rend hommage aux trois titres consécutifs de Michael Jordan. Avec leurs détails en cuir, tissu et nubuck, ces sneakers rendent hommage à un héritage et t\'invitent à tracer ta propre légende.',0,1,'23','homme'),(14,'dsjs',NULL,'old',34,89,'1719504286901.jpg','shsjdmkn','[\"1719504286924.png\",\"1719504286973.png\",\"1719504286981.jpg\"]','[\"1719504286924.png\",\"1719504286973.png\",\"1719504286981.jpg\"]','[ \"40\",\"41\" ]','asxsklmsd sxlxsmkxs skxsplplxsk xslxospdppxs sxlslskxjjhxsjh',0,1,'0','homme'),(27,'Air Jordan 1 Low SE',NULL,'new',900,0,'1719859384501.jpeg','Air Jordan 1 Low SE Casablanca','[\"1719859384520.jpeg\",\"1719859384643.png\",\"1719859384738.png\"]','[\"1719859384520.jpeg\",\"1719859384643.png\",\"1719859384738.png\"]','[ \"39\",\"40\",\"43\" ]','Fresh colors and textures give you an updated AJ1 without losing its iconic silhouette and familiar feel. Made from premium materials, this all-time favorite comes decked out with comfortable Nike Air cushioning and subtle design details (check out that embroidered heel) to give you a staple sneaker with a modern look.\r\n\r\n',0,1,'[ \"2\",\"2\",\"3\" ]','homme');
/*!40000 ALTER TABLE `produit` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-08 13:19:39
