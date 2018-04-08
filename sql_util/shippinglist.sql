/*
 Navicat PostgreSQL Data Transfer

 Source Server         : PostgreSQL10
 Source Server Version : 90510
 Source Host           : localhost
 Source Database       : ggapp
 Source Schema         : public

 Target Server Version : 90510
 File Encoding         : utf-8

 Date: 04/08/2018 15:27:24 PM
*/

-- ----------------------------
--  Table structure for shippinglist
-- ----------------------------
DROP TABLE IF EXISTS "public"."shippinglist";
CREATE TABLE "public"."shippinglist" (
	"sl_id" int4 NOT NULL DEFAULT nextval('seq_shippinglist_sl_id'::regclass),
	"sl_jsonb" jsonb NOT NULL,
	"sl_date" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now()
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."shippinglist" OWNER TO "Alejandro";

-- ----------------------------
--  Primary key structure for table shippinglist
-- ----------------------------
ALTER TABLE "public"."shippinglist" ADD PRIMARY KEY ("sl_id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Checks structure for table shippinglist
-- ----------------------------
ALTER TABLE "public"."shippinglist" ADD CONSTRAINT "shippinglist_required" CHECK (((sl_jsonb ? 'cl_id'::text) AND (sl_jsonb ? 'zo_id'::text) AND (sl_jsonb ? 'wo_id'::text) AND (sl_jsonb ? 'sl_createdby'::text))) NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "public"."shippinglist" ADD CONSTRAINT "shippinglist_valid_types" CHECK (((jsonb_typeof((sl_jsonb -> 'cl_id'::text)) = 'number'::text) AND (jsonb_typeof((sl_jsonb -> 'zo_id'::text)) = 'number'::text) AND (jsonb_typeof((sl_jsonb -> 'wo_id'::text)) = 'string'::text) AND (jsonb_typeof((sl_jsonb -> 'sl_createdby'::text)) = 'string'::text))) NOT DEFERRABLE INITIALLY IMMEDIATE;

