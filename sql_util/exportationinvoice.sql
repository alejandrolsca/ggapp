/*
 Navicat PostgreSQL Data Transfer

 Source Server         : PostgreSQL10
 Source Server Version : 90510
 Source Host           : localhost
 Source Database       : ggapp
 Source Schema         : public

 Target Server Version : 90510
 File Encoding         : utf-8

 Date: 04/08/2018 15:27:38 PM
*/

-- ----------------------------
--  Table structure for exportationinvoice
-- ----------------------------
DROP TABLE IF EXISTS "public"."exportationinvoice";
CREATE TABLE "public"."exportationinvoice" (
	"ei_id" int4 NOT NULL DEFAULT nextval('seq_exportationinvoice_ei_id'::regclass),
	"ei_jsonb" jsonb NOT NULL,
	"ei_date" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now()
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."exportationinvoice" OWNER TO "Alejandro";

-- ----------------------------
--  Primary key structure for table exportationinvoice
-- ----------------------------
ALTER TABLE "public"."exportationinvoice" ADD PRIMARY KEY ("ei_id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Checks structure for table exportationinvoice
-- ----------------------------
ALTER TABLE "public"."exportationinvoice" ADD CONSTRAINT "exportationinvoice_required" CHECK (((ei_jsonb ? 'cl_id'::text) AND (ei_jsonb ? 'zo_id'::text) AND (ei_jsonb ? 'wo_id'::text) AND (ei_jsonb ? 'ei_createdby'::text))) NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "public"."exportationinvoice" ADD CONSTRAINT "exportationinvoice_valid_types" CHECK (((jsonb_typeof((ei_jsonb -> 'cl_id'::text)) = 'number'::text) AND (jsonb_typeof((ei_jsonb -> 'zo_id'::text)) = 'number'::text) AND (jsonb_typeof((ei_jsonb -> 'wo_id'::text)) = 'string'::text) AND (jsonb_typeof((ei_jsonb -> 'ei_createdby'::text)) = 'string'::text))) NOT DEFERRABLE INITIALLY IMMEDIATE;

