/*
 Navicat PostgreSQL Data Transfer

 Source Server         : PostgreSQL10
 Source Server Version : 100100
 Source Host           : localhost
 Source Database       : ggapp
 Source Schema         : public

 Target Server Version : 100100
 File Encoding         : utf-8

 Date: 01/16/2018 23:21:50 PM
*/

-- ----------------------------
--  Table structure for wohistory
-- ----------------------------
DROP TABLE IF EXISTS "public"."wohistory";
CREATE TABLE "public"."wohistory" (
	"wohi_id" int4 NOT NULL DEFAULT nextval('seq_wohistory_wohi_id'::regclass),
	"wo_id" int4 NOT NULL,
	"wohi_prevjsonb" jsonb,
	"wohi_newjsonb" jsonb NOT NULL,
	"wohi_date" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now()
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."wohistory" OWNER TO "Alejandro";

-- ----------------------------
--  Primary key structure for table wohistory
-- ----------------------------
ALTER TABLE "public"."wohistory" ADD PRIMARY KEY ("wohi_id") NOT DEFERRABLE INITIALLY IMMEDIATE;

