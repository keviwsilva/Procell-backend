-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: procell
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
-- Table structure for table `tbl_carrinho`
--

DROP TABLE IF EXISTS `tbl_carrinho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_carrinho` (
  `car_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `prod_id` int NOT NULL,
  `quantidade` int NOT NULL,
  PRIMARY KEY (`car_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `prod_id_idx` (`prod_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_user_id_carrinho` (`user_id`),
  CONSTRAINT `prod_id1` FOREIGN KEY (`prod_id`) REFERENCES `tbl_produto` (`prod_id`),
  CONSTRAINT `user_id1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_carrinho`
--

LOCK TABLES `tbl_carrinho` WRITE;
/*!40000 ALTER TABLE `tbl_carrinho` DISABLE KEYS */;
INSERT INTO `tbl_carrinho` VALUES (171,1,1,4),(172,1,3,2);
/*!40000 ALTER TABLE `tbl_carrinho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_categoria`
--

DROP TABLE IF EXISTS `tbl_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_categoria` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(45) NOT NULL,
  `cat_descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_categoria`
--

LOCK TABLES `tbl_categoria` WRITE;
/*!40000 ALTER TABLE `tbl_categoria` DISABLE KEYS */;
INSERT INTO `tbl_categoria` VALUES (1,'fones','fone de ouvido'),(2,'Carregador','carregadores todos os tipos'),(3,'Carregador','carregadores todos os tipos');
/*!40000 ALTER TABLE `tbl_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_endereco`
--

DROP TABLE IF EXISTS `tbl_endereco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_endereco` (
  `end_id` int NOT NULL AUTO_INCREMENT,
  `end_cep` varchar(45) NOT NULL,
  `end_numero` varchar(45) NOT NULL,
  `end_complemento` varchar(45) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`end_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `user_idend_idx` (`user_id`),
  CONSTRAINT `user_idend` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_endereco`
--

LOCK TABLES `tbl_endereco` WRITE;
/*!40000 ALTER TABLE `tbl_endereco` DISABLE KEYS */;
INSERT INTO `tbl_endereco` VALUES (1,'12412500','41',NULL,1),(2,'12440500','41',NULL,1);
/*!40000 ALTER TABLE `tbl_endereco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_imagem_produto`
--

DROP TABLE IF EXISTS `tbl_imagem_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_imagem_produto` (
  `produto_id` int NOT NULL,
  `imagem_base64` longblob NOT NULL,
  KEY `produto_id_idx` (`produto_id`),
  CONSTRAINT `produto_id` FOREIGN KEY (`produto_id`) REFERENCES `tbl_produto` (`prod_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_imagem_produto`
--

LOCK TABLES `tbl_imagem_produto` WRITE;
/*!40000 ALTER TABLE `tbl_imagem_produto` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_imagem_produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_pedido`
--

DROP TABLE IF EXISTS `tbl_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_pedido` (
  `ped_id` int NOT NULL AUTO_INCREMENT,
  `ped_valor` decimal(10,2) NOT NULL,
  `ped_data` datetime NOT NULL,
  `user_id` int NOT NULL,
  `ped_pago` varchar(45) NOT NULL,
  `link_pagamento` varchar(255) DEFAULT NULL,
  `pag_id` int DEFAULT NULL,
  PRIMARY KEY (`ped_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_pedido`
--

LOCK TABLES `tbl_pedido` WRITE;
/*!40000 ALTER TABLE `tbl_pedido` DISABLE KEYS */;
INSERT INTO `tbl_pedido` VALUES (1,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(2,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(3,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(4,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(5,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(6,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(7,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(8,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(9,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(10,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(11,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(12,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(13,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(14,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(15,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(16,120.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(17,100.50,'2024-03-07 00:00:00',1,'',NULL,NULL),(18,100.50,'2024-03-07 00:00:00',1,'',NULL,NULL),(19,100.50,'2024-03-07 00:00:00',1,'',NULL,NULL),(20,100.50,'2024-03-07 00:00:00',1,'',NULL,NULL),(21,100.50,'2024-03-07 00:00:00',1,'',NULL,NULL),(22,380.00,'2024-03-07 00:00:00',1,'',NULL,NULL),(23,190.00,'2024-03-07 00:00:00',1,'',NULL,NULL),(24,190.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(25,190.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(26,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(27,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(28,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(29,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(30,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(31,570.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(32,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(33,190.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(34,570.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(35,190.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(36,190.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(37,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(38,570.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(39,570.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(40,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(41,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(42,190.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(43,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(44,190.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(45,190.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(46,380.00,'2024-03-04 00:00:00',1,'',NULL,NULL),(47,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(48,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(49,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(50,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(51,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(52,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(53,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(54,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(55,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(56,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(57,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(58,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(59,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(60,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(61,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(62,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(63,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(64,760.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(65,760.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(66,760.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(67,760.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(68,760.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(69,760.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(70,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(71,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(72,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(73,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(74,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(75,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(76,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(77,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(78,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(79,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(80,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(81,380.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(82,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(83,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(84,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(85,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(86,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(87,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(88,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(89,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(90,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(91,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(92,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(93,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(94,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(95,0.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(96,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(97,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(98,190.00,'2024-03-20 00:00:00',1,'',NULL,NULL),(99,190.00,'2024-03-21 00:00:00',1,'nao pago',NULL,NULL),(100,380.00,'2024-03-21 00:00:00',1,'nao pago',NULL,NULL),(101,190.00,'2024-03-21 00:00:00',1,'nao pago',NULL,NULL),(102,190.00,'2024-03-21 00:00:00',1,'nao pago',NULL,NULL),(103,190.00,'2024-03-21 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-0a951561-8868-4c1b-853f-e77f3cd207d0',NULL),(104,190.00,'2024-03-21 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-cc6101a6-7173-4620-8e80-87938fecf6ff',NULL),(105,380.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-c5ecf440-4e89-4ff0-8166-71b5c459bbe0',NULL),(106,190.00,'2024-03-25 00:00:00',1,'nao pago',NULL,NULL),(107,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-e062d7db-6c58-4af2-a94b-6595d4c1d8a9',NULL),(108,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-5a1af32b-58f3-4685-9bb0-5b7ced893a65',NULL),(109,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-bb147db0-20b8-42f9-943d-84b2ca4fc20c',NULL),(110,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-42af301c-b086-45a8-bf46-62b384a6679c',NULL),(111,190.00,'2024-03-25 00:00:00',1,'nao pago',NULL,NULL),(112,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-bf3545f7-e595-4b98-bb06-d38d4e33caae',NULL),(113,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-c052ed4c-ad33-42f1-b743-d9c9d4e8ff77',NULL),(114,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-a51b51c5-456b-4491-b98e-2a342687ee5e',NULL),(115,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-89a478f3-a6ed-41dd-afe5-bb5751349fdf',NULL),(116,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-ba20cdf1-872b-40a7-9145-970905c1d8e3',NULL),(117,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-61f41c91-dd74-4c1a-9928-63119b171200',NULL),(118,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-708c17b8-b4d3-4a4e-bd75-f81f67aa4b67',NULL),(119,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-5d3f8ad5-bb7e-4cde-9cec-4b78a5a6db57',NULL),(120,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-d2f34f66-35c4-44c8-9d5d-44a5a0d871f1',NULL),(121,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-088ce7d7-49d4-4af2-a862-f4741c142535',NULL),(122,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-864a58b4-db30-43e7-aba3-e4aea9bc382c',NULL),(123,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-2b4fc217-c75c-4fe3-bb98-6bac0ec90460',NULL),(124,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-77e78295-3ead-4d9d-a593-215f51f96fd4',NULL),(125,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-75f77595-8342-43fa-bc4e-ca07c64b8f58',NULL),(126,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-db0358a6-39b1-4027-9ed2-32928f71ab2d',NULL),(127,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-eaac9277-4def-4bdf-8144-507de4c9b186',NULL),(128,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-63910971-54f1-41e1-831e-05b438450848',NULL),(129,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-032957e4-a066-4d4f-8d96-21fd681705d9',NULL),(130,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-17970c6f-bdd7-4522-92a2-3ede5377e372',NULL),(131,190.00,'2024-03-25 00:00:00',1,'nao pago',NULL,NULL),(132,190.00,'2024-03-25 00:00:00',1,'approved','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-ca321d8a-0e44-449a-82c4-cc2e8a4b71a4',259503750),(133,190.00,'2024-03-25 00:00:00',1,'approved','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-9828ce3c-0205-45f0-81e6-14184a641eef',259503750),(134,190.00,'2024-03-25 00:00:00',1,'nao pago',NULL,NULL),(135,190.00,'2024-03-25 00:00:00',1,'nao pago',NULL,NULL),(136,190.00,'2024-03-25 00:00:00',1,'nao pago',NULL,NULL),(137,190.00,'2024-03-25 00:00:00',1,'nao pago',NULL,NULL),(138,190.00,'2024-03-25 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-38cef318-9141-48f1-9569-d2cb4f7a4ebf',NULL),(139,190.00,'2024-03-26 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-b69c0ef3-35ed-4cb4-800a-b80a7fa172af',NULL),(140,190.00,'2024-03-26 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-20652945-2aeb-4d7d-965b-27221aa9edd1',NULL),(141,190.00,'2024-03-26 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-1df642c5-6ac7-4737-98c5-1e24d38c344b',NULL),(142,190.00,'2024-03-26 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-d1bc7b6f-e7de-4bcc-88ec-adcce79df968',NULL),(143,190.00,'2024-03-26 00:00:00',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-53e347d6-657c-442e-ba91-901c303a0e68',NULL),(144,190.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(145,190.00,'2024-03-26 09:19:20',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-40911520-00bd-453c-a60d-2e1c0bec0166',259503750),(146,190.00,'2024-03-26 09:23:58',1,'nao pago',NULL,259503750),(147,190.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(148,190.00,'2024-03-26 10:25:04',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-cbc4fc16-06d3-48e4-a2a3-a1b1ad01744c',259503750),(149,190.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(150,190.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(151,380.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(152,570.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(153,570.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(154,570.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(155,570.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(156,570.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(157,570.00,'2024-03-26 00:00:00',1,'nao pago',NULL,NULL),(158,570.00,'2024-03-26 11:02:45',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-60016feb-fc69-42fb-81f6-c86110b71c8d',259503750),(159,190.00,'2024-03-26 10:05:34',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-143f65bb-5a7d-4dfe-855b-a227f96c2b56',259503750),(160,190.00,'2024-03-26 11:08:32',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-2b288ac8-7fde-4fd2-83f0-0174c3320e83',259503750),(161,190.00,'2024-03-26 10:10:48',1,'approved','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-3fd52f6b-4242-4444-871f-1825e98dbfcb',259503750),(162,190.00,'2024-03-26 11:16:10',1,'approved','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-81441100-b3a0-405c-85f3-e8fd4e4ec901',259503750),(163,190.00,'2024-03-26 10:20:57',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-6b142045-46cf-4ee7-af1c-b5e9389e771e',259503750),(164,190.00,'2024-03-26 11:25:14',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-f9b57e60-483c-43e8-b52f-6d65ced1f629',259503750),(165,190.00,'2024-03-26 11:27:58',1,'approved','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-f09260a8-9fd0-4858-a15c-bd0722849e55',259503750),(166,190.00,'2024-03-26 10:29:59',1,'approved','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-f7951895-d465-4229-be86-5553cd0f0dc6',259503750),(167,160.00,'2024-03-27 22:30:26',1,'nao pago','https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=259503750-d17605c2-c80d-4ace-83c5-95c62eecd843',259503750);
/*!40000 ALTER TABLE `tbl_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_pedido_produto`
--

DROP TABLE IF EXISTS `tbl_pedido_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_pedido_produto` (
  `ped_id` int NOT NULL,
  `prod_id` int NOT NULL,
  `quantidade` int NOT NULL,
  KEY `prod_id_idx` (`prod_id`),
  KEY `ped_id_idx` (`ped_id`),
  CONSTRAINT `ped_id` FOREIGN KEY (`ped_id`) REFERENCES `tbl_pedido` (`ped_id`),
  CONSTRAINT `prod_id` FOREIGN KEY (`prod_id`) REFERENCES `tbl_produto` (`prod_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_pedido_produto`
--

LOCK TABLES `tbl_pedido_produto` WRITE;
/*!40000 ALTER TABLE `tbl_pedido_produto` DISABLE KEYS */;
INSERT INTO `tbl_pedido_produto` VALUES (55,3,2),(55,1,4),(58,3,2),(58,1,4),(62,3,2),(62,1,4),(63,3,2),(63,1,4),(64,3,4),(64,1,8),(65,3,4),(65,1,8),(66,3,4),(66,1,8),(67,3,4),(67,1,8),(68,3,4),(68,1,8),(69,3,4),(69,1,8),(71,3,2),(71,1,4),(72,3,1),(72,1,2),(73,3,2),(73,1,4),(74,3,1),(74,1,2),(75,1,2),(75,3,1),(77,3,1),(77,1,2),(79,3,2),(79,1,4),(81,3,2),(81,1,4),(82,3,1),(82,1,2),(83,1,2),(83,3,1),(84,3,1),(84,1,2),(85,3,1),(85,1,2),(86,3,1),(86,1,2),(87,3,1),(87,1,2),(88,3,1),(88,1,2),(89,3,1),(89,1,2),(90,3,1),(90,1,2),(92,3,1),(92,1,2),(93,3,1),(93,1,2),(94,3,1),(94,1,2),(96,3,1),(96,1,2),(97,3,1),(97,1,2),(98,3,1),(98,1,2),(99,1,2),(99,3,1),(100,3,2),(100,1,4),(101,3,1),(101,1,2),(102,3,1),(102,1,2),(103,3,1),(103,1,2),(104,3,1),(104,1,2),(105,1,4),(105,3,2),(106,3,1),(106,1,2),(107,3,1),(107,1,2),(108,1,2),(108,3,1),(109,3,1),(109,1,2),(110,3,1),(110,1,2),(111,1,2),(111,3,1),(112,3,1),(112,1,2),(113,3,1),(113,1,2),(114,1,2),(114,3,1),(115,3,1),(115,1,2),(116,3,1),(116,1,2),(117,3,1),(117,1,2),(118,3,1),(118,1,2),(119,3,1),(119,1,2),(120,1,2),(120,3,1),(121,1,2),(121,3,1),(122,3,1),(122,1,2),(123,3,1),(123,1,2),(124,3,1),(124,1,2),(125,3,1),(125,1,2),(126,3,1),(126,1,2),(127,3,1),(127,1,2),(128,3,1),(128,1,2),(129,3,1),(129,1,2),(130,3,1),(130,1,2),(131,3,1),(131,1,2),(132,3,1),(132,1,2),(133,3,1),(133,1,2),(134,3,1),(134,1,2),(135,3,1),(135,1,2),(136,3,1),(136,1,2),(137,3,1),(137,1,2),(138,3,1),(138,1,2),(139,1,2),(139,3,1),(140,3,1),(140,1,2),(141,3,1),(141,1,2),(142,3,1),(142,1,2),(143,3,1),(143,1,2),(144,3,1),(144,1,2),(145,3,1),(145,1,2),(146,3,1),(146,1,2),(147,3,1),(147,1,2),(148,3,1),(148,1,2),(149,3,1),(149,1,2),(150,3,1),(150,1,2),(151,3,2),(151,1,4),(152,3,3),(152,1,6),(153,3,3),(153,1,6),(154,3,3),(154,1,6),(155,3,3),(155,1,6),(156,3,3),(156,1,6),(157,3,3),(157,1,6),(158,3,3),(158,1,6),(159,3,1),(159,1,2),(160,1,2),(160,3,1),(161,3,1),(161,1,2),(162,3,1),(162,1,2),(163,3,1),(163,1,2),(164,3,1),(164,1,2),(165,3,1),(165,1,2),(166,1,2),(166,3,1),(167,3,1),(167,1,2);
/*!40000 ALTER TABLE `tbl_pedido_produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_produto`
--

DROP TABLE IF EXISTS `tbl_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_produto` (
  `prod_id` int NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_valorCPF` double NOT NULL,
  `prod_valorCNPJ` double NOT NULL,
  `prod_custo` double NOT NULL,
  `prod_quantidade` int NOT NULL,
  `prod_descricao` varchar(255) NOT NULL,
  `cat_id` int NOT NULL,
  PRIMARY KEY (`prod_id`),
  KEY `cat_id_idx` (`cat_id`),
  KEY `idx_prod_id` (`prod_id`),
  CONSTRAINT `cat_id` FOREIGN KEY (`cat_id`) REFERENCES `tbl_categoria` (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_produto`
--

LOCK TABLES `tbl_produto` WRITE;
/*!40000 ALTER TABLE `tbl_produto` DISABLE KEYS */;
INSERT INTO `tbl_produto` VALUES (1,'fone',70,60,30,20,'fone para ouvido lerdo',1),(3,'carregador type C',50,40,30,5,'carregador',1),(4,'carregador veicular',50,45,30,10,'carregador',1),(5,'fone le-0201',50,45,30,10,'carregador',1),(6,'fone le-0201',50,45,30,10,'carregador',1);
/*!40000 ALTER TABLE `tbl_produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user`
--

DROP TABLE IF EXISTS `tbl_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_telefone` varchar(255) NOT NULL,
  `user_sexo` varchar(45) NOT NULL,
  `user_last_login_ip` varchar(255) DEFAULT NULL,
  `user_type` varchar(45) NOT NULL,
  `user_cpfcnpj` varchar(45) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES (1,'Kevin','kwms1345@gmail.com','$2b$10$dG6.BOGhFp2jBzSpih6Z4OSV4dMs.SD.uXDHn8kcgCeENsk05DOZa','(11) 1234-5678','masculino','::ffff:127.0.0.1','CNPJ','49115259838',1),(2,'Kevin','kevingamer1359@gmail.com','$2b$10$2ij88NbeKRFOWhhhtgUJPOtoS/DpUmMSN7rXAeBUX/iFd0yl1LSVW','(11) 1234-5678','masculino',NULL,'CPF','49115259838',0),(3,'Kevin','dghjkasdhilas9@gmail.com','$2b$10$bQdgEfiqLQrkmr8fL90Opephis7cS/0fix2Ba1O2WhSURGfE9I4Yq','(11) 1234-5678','masculino',NULL,'CPF','49115259838',0),(4,'Kevin','dghjkasdhdsailas9@gmail.com','$2b$10$N3bK9bp9T.rj9DSjnQOvJOXVCgWVxmT8PfvEmWyjIKDhTwb/mx9.a','(11) 1234-5678','masculino',NULL,'CPF','49115259838',0),(5,'Kevin','dghjddas9@gmail.com','$2b$10$1f67h3.PAT8MWuBgijm6b.wY24.e9uTPWpEKAHy3s8jSV6BV0caI6','(11) 1234-5678','masculino',NULL,'CPF','20178739855',0),(6,'Kevin','adas3212332@gmail.com','$2b$10$qfnyvoBSae69uODF9PkzgO2Y.6voatnWIwT8SBSXaCVRWTxM.gPwO','(11) 1234-5678','masculino',NULL,'CPF','28046481840',0),(10,'Kevin','adas3212332@gmail.com','$2b$10$koWdnJunVahhLpTlfKYjjuYzSGTF0fMf7qWMHcg.cAQ.h8rkmwExS','(11) 1234-5678','masculino',NULL,'CPF','22567078304',0);
/*!40000 ALTER TABLE `tbl_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'procell'
--

--
-- Dumping routines for database 'procell'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-15 11:44:20
