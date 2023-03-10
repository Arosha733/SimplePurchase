/*
 Navicat Premium Data Transfer

 Source Server         : localMysql
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost:3306
 Source Schema         : myshopping

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 10/01/2023 09:14:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'woman',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (3, 'admin', 'admin', 'http://127.0.0.1:3000/public/img/admin/woman.png', 'man');

-- ----------------------------
-- Table structure for card
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE `card`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `orderDate` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `orderState` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `comm` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 30 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of card
-- ----------------------------
INSERT INTO `card` VALUES (29, 10, 'test', '2023-01-08 13:52:34', '0', '[{\"id\":5,\"name\":\"Test item 2\",\"number\":1}]');

-- ----------------------------
-- Table structure for comm
-- ----------------------------
DROP TABLE IF EXISTS `comm`;
CREATE TABLE `comm`  (
  `commId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `goodsId` int(11) NULL DEFAULT NULL,
  `commText` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `commDate` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`commId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comm
-- ----------------------------
INSERT INTO `comm` VALUES (6, 10, 7, 'dd', '2023-01-08 13:11:48');
INSERT INTO `comm` VALUES (5, 10, 7, 'ok', '2023-01-08 13:08:34');

-- ----------------------------
-- Table structure for commodity
-- ----------------------------
DROP TABLE IF EXISTS `commodity`;
CREATE TABLE `commodity`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `urlList` varchar(9999) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `porice` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `stock` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of commodity
-- ----------------------------
INSERT INTO `commodity` VALUES (7, 'Test item 1', 'http://127.0.0.1:3000/public/img/admin/goods/1619680070743-src=http___img10.360buyimg.com_n1_jfs_t1_142789_10_9922_311672_5f7943d8E67677fac_f98d3035cb846f31.jpg&refer=http___img10.360buyimg.jfif', '[\"http://127.0.0.1:3000/public/img/admin/goods/1619680070743-src=http___img10.360buyimg.com_n1_jfs_t1_142789_10_9922_311672_5f7943d8E67677fac_f98d3035cb846f31.jpg&refer=http___img10.360buyimg.jfif\"]', '60', '61', 'Introduction to Test Commodity 1');
INSERT INTO `commodity` VALUES (5, 'Test item 2', 'http://127.0.0.1:3000/public/img/admin/goods/1619577130163-1.png', '[\"http://127.0.0.1:3000/public/img/admin/goods/1619577130163-1.png\"]', '99', '18', 'Introduction to Test Commodity 2');

-- ----------------------------
-- Table structure for swiper
-- ----------------------------
DROP TABLE IF EXISTS `swiper`;
CREATE TABLE `swiper`  (
  `swiperId` int(11) NOT NULL AUTO_INCREMENT,
  `swiperurl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `swiperIndex` int(11) NULL DEFAULT 0,
  `swipertime` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`swiperId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 37 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of swiper
-- ----------------------------
INSERT INTO `swiper` VALUES (1, 'http://127.0.0.1:3000/public/img/user/swiper/1619573999692-gaoda.png', 1, '2023-03-12 12:54:33');
INSERT INTO `swiper` VALUES (2, 'http://127.0.0.1:3000/public/img/user/swiper/1619574006452-lily.png', 2, '2023-03-12 12:54:35');
INSERT INTO `swiper` VALUES (3, 'http://127.0.0.1:3000/public/img/user/swiper/1619574162617-1619574162000.jpeg', 3, '2023-03-12 12:54:35');
INSERT INTO `swiper` VALUES (4, 'http://127.0.0.1:3000/public/img/user/swiper/1619574022633-nilu.png', 4, '2023-03-12 12:54:37');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `userTime` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `avator` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`userId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (11, 'test2', 'test2', 'dd@qq.com', '2023-03-08 13:32:21', 'public/img/user/user.png');
INSERT INTO `user` VALUES (10, 'test', 'test', 'test@qq.com', '2023-03-08 16:05:04', 'public/img/user/user.png');

SET FOREIGN_KEY_CHECKS = 1;
