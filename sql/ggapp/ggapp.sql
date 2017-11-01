--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: seq_client_cl_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_client_cl_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_client_cl_id OWNER TO "Alejandro";

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: client; Type: TABLE; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE TABLE client (
    cl_id bigint DEFAULT nextval('seq_client_cl_id'::regclass) NOT NULL,
    cl_jsonb jsonb NOT NULL,
    cl_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE client OWNER TO "Alejandro";

--
-- Name: seq_ink_in_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_ink_in_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_ink_in_id OWNER TO "Alejandro";

--
-- Name: ink; Type: TABLE; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE TABLE ink (
    in_id bigint DEFAULT nextval('seq_ink_in_id'::regclass) NOT NULL,
    in_jsonb jsonb NOT NULL,
    in_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE ink OWNER TO "Alejandro";

--
-- Name: seq_machine_ma_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_machine_ma_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_machine_ma_id OWNER TO "Alejandro";

--
-- Name: machine; Type: TABLE; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE TABLE machine (
    ma_id integer DEFAULT nextval('seq_machine_ma_id'::regclass) NOT NULL,
    ma_jsonb jsonb NOT NULL,
    ma_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE machine OWNER TO "Alejandro";

--
-- Name: seq_material_mt_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_material_mt_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_material_mt_id OWNER TO "Alejandro";

--
-- Name: material; Type: TABLE; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE TABLE material (
    mt_id bigint DEFAULT nextval('seq_material_mt_id'::regclass) NOT NULL,
    mt_jsonb jsonb NOT NULL,
    mt_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE material OWNER TO "Alejandro";

--
-- Name: seq_product_pr_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_product_pr_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_product_pr_id OWNER TO "Alejandro";

--
-- Name: product; Type: TABLE; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE TABLE product (
    pr_id bigint DEFAULT nextval('seq_product_pr_id'::regclass),
    pr_jsonb jsonb,
    pr_date timestamp without time zone DEFAULT now()
);


ALTER TABLE product OWNER TO "Alejandro";

--
-- Name: seq_supplier_su_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_supplier_su_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_supplier_su_id OWNER TO "Alejandro";

--
-- Name: seq_user_us_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_user_us_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_user_us_id OWNER TO "Alejandro";

--
-- Name: seq_wo_wo_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_wo_wo_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_wo_wo_id OWNER TO "Alejandro";

--
-- Name: seq_zone_zo_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_zone_zo_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_zone_zo_id OWNER TO "Alejandro";

--
-- Name: supplier; Type: TABLE; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE TABLE supplier (
    su_id bigint DEFAULT nextval('seq_supplier_su_id'::regclass) NOT NULL,
    su_jsonb jsonb NOT NULL,
    su_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE supplier OWNER TO "Alejandro";

--
-- Name: user; Type: TABLE; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE TABLE "user" (
    us_id integer DEFAULT nextval('seq_user_us_id'::regclass) NOT NULL,
    us_jsonb jsonb NOT NULL,
    us_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE "user" OWNER TO "Alejandro";

--
-- Name: wo; Type: TABLE; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE TABLE wo (
    wo_id bigint DEFAULT nextval('seq_wo_wo_id'::regclass) NOT NULL,
    wo_jsonb jsonb NOT NULL,
    wo_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE wo OWNER TO "Alejandro";

--
-- Name: zone; Type: TABLE; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE TABLE zone (
    zo_id bigint DEFAULT nextval('seq_zone_zo_id'::regclass) NOT NULL,
    zo_jsonb jsonb NOT NULL,
    zo_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE zone OWNER TO "Alejandro";

--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY client (cl_id, cl_jsonb, cl_date) FROM stdin;
8	{"cl_tin": "SABG-830106-ACA", "cl_city": 8581816, "cl_name": "Gaspar Alejandro", "cl_type": "legal", "cl_email": "alejandrolsca@gmail.com", "cl_phone": "3337979135", "cl_state": 4014336, "cl_county": 8581816, "cl_mobile": "+5213310112576", "cl_status": "A", "cl_street": "AV GUADALUPE", "cl_country": 3996063, "cl_zipcode": "45036", "cl_creditlimit": "10000.00", "cl_suitenumber": "81", "cl_neighborhood": "PLAZA GUADALUPE", "cl_streetnumber": "6877", "cl_corporatename": "Ventas de Chihuahua SA de CV", "cl_firstsurname": "Sanchez", "cl_secondsurname": "Betancourt", "cl_addressreference": "FRIDA KHALO Y AV GUADALUPE", "cl_customerdiscount": "0.10"}	2016-08-13 14:03:44.618444
6	{"cl_tin": "SABG-830106-ACA", "cl_city": 8582219, "cl_name": "Alejandro", "cl_email": "alejadrolsca@gmail.com", "cl_phone": "3337979135", "cl_state": 4004156, "cl_county": 8582219, "cl_mobile": "3316997770", "cl_status": "A", "cl_street": "Av Guadalupe", "cl_country": 3996063, "cl_zipcode": "45036", "cl_creditlimit": "10000.00", "cl_suitenumber": "81", "cl_neighborhood": "Plaza Guadalupe", "cl_streetnumber": "6877", "cl_corporatename": "Alejandro Sanchez Betancourt", "cl_firstsurname": "Sanchez", "cl_secondsurname": "Betancourt", "cl_addressreference": "Frida Khalo", "cl_customerdiscount": "0.20"}	2015-03-27 02:44:29.214853
5	{"cl_tin": "SABG-833344", "cl_city": 8581816, "cl_name": "Marco", "cl_email": "malanis@grupografico.com.mx", "cl_phone": "6144216200", "cl_state": 4014336, "cl_county": 8581816, "cl_mobile": "6144216260", "cl_status": "A", "cl_street": "Acacias 610", "cl_country": 3996063, "cl_zipcode": "45036", "cl_creditlimit": "10000.00", "cl_suitenumber": "1-A", "cl_neighborhood": "Las Granjas", "cl_streetnumber": "410", "cl_corporatename": "Grupo Grafico S.A. de C.V.", "cl_firstsurname": "Alanis", "cl_secondsurname": "Batista", "cl_addressreference": "Av. Jose Maria Iglesias", "cl_customerdiscount": "0.29"}	2014-08-03 23:12:40.89657
7	{"cl_tin": "SABG-830106-ACA", "cl_city": 8581816, "cl_name": "Gaspar Alejandro", "cl_type": "natural", "cl_email": "alejandrolsca@gmail.com", "cl_phone": "3337979135", "cl_state": 4014336, "cl_county": 8581816, "cl_mobile": "+5213310112576", "cl_status": "A", "cl_street": "AV GUADALUPE", "cl_country": 3996063, "cl_zipcode": "45036", "cl_creditlimit": "10000.00", "cl_suitenumber": "83", "cl_neighborhood": "PLAZA GUADALUPE", "cl_streetnumber": "6877", "cl_firstsurname": "Sanchez", "cl_secondsurname": "Betancourt", "cl_addressreference": "FRIDA KHALO Y AV GUADALUPE", "cl_customerdiscount": "0.10"}	2016-08-06 09:33:14.194592
25	{"cl_tin": "SABG-830106-ACE", "cl_city": 8581816, "cl_name": "Gaspar Alejandro", "cl_type": "legal", "cl_email": "alejandrolsca@gmail.com", "cl_phone": "3337979135", "cl_state": 4014336, "cl_county": 8581816, "cl_mobile": "+5213310112576", "cl_status": "A", "cl_street": "AV GUADALUPE", "cl_country": 3996063, "cl_zipcode": "45036", "cl_creditlimit": "10000.00", "cl_suitenumber": "81", "cl_neighborhood": "PLAZA GUADALUPE", "cl_streetnumber": "6877", "cl_corporatename": "lo que sea", "cl_firstsurname": "Sanchez", "cl_secondsurname": "Betancourt", "cl_addressreference": "FRIDA KHALO Y AV GUADALUPE", "cl_customerdiscount": "0.10"}	2016-08-13 14:19:51.331898
\.


--
-- Data for Name: ink; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY ink (in_id, in_jsonb, in_date) FROM stdin;
2	{"su_id": 1, "in_code": "EE778", "in_type": "flexo", "in_price": "78.99", "in_status": "A", "in_description": "INK TEST 2"}	2015-04-06 18:52:06.360676
3	{"su_id": 1, "in_code": "TEST33432", "in_type": "inkjet_solvent", "in_price": "9.99", "in_status": "A", "in_description": "sfdsfsfs"}	2015-04-09 10:35:56.494733
1	{"su_id": 1, "in_code": "ASDASD6996", "in_type": "inkjet_solvent", "in_price": "99.99", "in_status": "I", "in_description": "INK TEST"}	2015-04-06 18:38:53.021264
\.


--
-- Data for Name: machine; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY machine (ma_id, ma_jsonb, ma_date) FROM stdin;
1	{"ma_name": "Maquina 1", "ma_status": "A", "ma_printbg": "yes", "ma_process": "offset", "ma_fullcolor": "yes", "ma_totalinks": "8", "ma_sizemeasure": "cm", "ma_maxsizewidth": "100.00", "ma_minsizewidth": "10.00", "ma_maxsizeheight": "200.33", "ma_minsizeheight": "15.00"}	2015-04-06 14:45:44.968296
\.


--
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY material (mt_id, mt_jsonb, mt_date) FROM stdin;
1	{"su_id": 1, "mt_code": "ASBB2255554", "mt_type": "termal transfer", "mt_price": "99.99", "mt_width": "100.00", "mt_height": "200.00", "mt_status": "A", "mt_weight": "150.00", "mt_measure": "cm", "mt_description": "MATERIAL TEST"}	2015-04-05 17:34:29.369015
2	{"su_id": 2, "mt_code": "TESTER2", "mt_type": "material", "mt_price": "350.33", "mt_width": "300.00", "mt_height": "250.00", "mt_status": "A", "mt_weight": "0.500", "mt_measure": "cm", "mt_description": "TESTER NUMERO 2"}	2015-11-21 19:48:15.531827
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY product (pr_id, pr_jsonb, pr_date) FROM stdin;
1	{"cl_id": "6", "mt_id": 1, "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": [2, 3, 2], "pr_laminate": "yes", "pr_inksfront": [2, 2], "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2015-06-12 18:55:26.907191
2	{"cl_id": "6", "mt_id": 1, "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": [], "pr_laminate": "yes", "pr_inksfront": [], "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_inksback_0": 2, "pr_inksback_1": 3, "pr_inksback_2": 3, "pr_description": "este es un producto de prueba", "pr_inksfront_0": 2, "pr_inksfront_1": 2, "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2015-11-21 15:19:35.437692
3	{"cl_id": "6", "mt_id": 1, "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": [], "pr_laminate": "yes", "pr_inksfront": [], "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_inksback_0": 3, "pr_inksback_1": 3, "pr_inksback_2": 2, "pr_description": "este es un producto de prueba", "pr_inksfront_0": 2, "pr_inksfront_1": 3, "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2015-11-21 15:46:42.096428
4	{"cl_id": "6", "mt_id": "1", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "2", "2": "2"}, "pr_laminate": "yes", "pr_inksfront": {"0": "2", "1": "2"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2016-02-21 20:34:40.505841
5	{"cl_id": "6", "mt_id": 1, "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "2", "2": "2"}, "pr_laminate": "yes", "pr_inksfront": {"0": "2", "1": "2"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2016-02-21 20:42:03.8221
6	{"cl_id": "6", "mt_id": "2", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "2", "2": "2"}, "pr_laminate": "yes", "pr_inksfront": {"0": "2", "1": "2"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2016-02-21 20:44:28.223434
7	{"cl_id": "6", "mt_id": "2", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "2", "2": "2"}, "pr_laminate": "yes", "pr_inksfront": {"0": "2", "1": "2"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2016-02-21 20:44:57.758523
8	{"cl_id": "6", "mt_id": "1", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "2", "2": "2"}, "pr_laminate": "yes", "pr_inksfront": {"0": "2", "1": "2"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2016-02-21 20:47:58.415476
9	{"cl_id": "6", "mt_id": "1", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "3", "1": "2", "2": "2"}, "pr_laminate": "yes", "pr_inksfront": {"0": "2", "1": "2"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2016-02-21 20:49:57.005546
10	{"cl_id": "6", "mt_id": "1", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "2", "2": "2"}, "pr_laminate": "yes", "pr_inksfront": {"0": "2", "1": "2"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2016-02-21 20:52:52.087375
11	{"cl_id": "6", "mt_id": "1", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "3", "1": "3", "2": "3"}, "pr_laminate": "yes", "pr_inksfront": {"0": "2", "1": "2"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2016-02-21 22:12:41.080622
12	{"cl_id": "6", "mt_id": "1", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "paginated", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "3", "2": "3"}, "pr_laminate": "yes", "pr_inksfront": {"0": "2", "1": "2"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2016-02-23 23:58:03.518865
13	{"cl_id": "6", "mt_id": "1", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "paginated", "pr_wire": "allocated", "mt_intid": "1", "pr_bound": "yes", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 2, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "2"}, "pr_intpages": "100", "pr_laminate": "yes", "pr_stapling": "no", "pr_inksfront": {"0": "2", "1": "3"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_intinkback": 2, "pr_spiralbind": "plastic", "pr_description": "este es un producto de prueba", "pr_intinkfront": 2, "pr_intinksback": {"0": "2", "1": "3"}, "pr_intinksfront": {"0": "2", "1": "3"}, "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm", "pr_intmaterialformatsqty": "100"}	2016-04-24 22:26:18.390691
14	{"cl_id": "6", "mt_id": "1", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "paginated", "pr_wire": "allocated", "mt_intid": "1", "pr_bound": "yes", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 2, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "2"}, "pr_intpages": "100", "pr_laminate": "yes", "pr_stapling": "no", "pr_inksfront": {"0": "2", "1": "3"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_intinkback": 3, "pr_spiralbind": "plastic", "pr_description": "este es un producto de prueba", "pr_intinkfront": 3, "pr_intinksback": {"0": "2", "1": "2", "2": "3"}, "pr_intinksfront": {"0": "2", "1": "2", "2": "3"}, "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm", "pr_intmaterialformatsqty": "100"}	2016-04-24 22:27:53.854029
15	{"cl_id": "6", "mt_id": "1", "pr_code": "asdasd", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_name": "asdasdas", "pr_type": "paginated", "pr_wire": "allocated", "mt_intid": "1", "pr_bound": "yes", "pr_folio": "yes", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 2, "pr_process": "offset", "pr_varnish": "oneside", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "2"}, "pr_intpages": "100", "pr_laminate": "twosides", "pr_stapling": "2", "pr_inksfront": {"0": "2", "1": "3"}, "pr_diecutting": "yes", "pr_intinkback": 2, "pr_spiralbind": "plastic", "pr_description": "este es un producto de prueba", "pr_intinkfront": 2, "pr_intinksback": {"0": "2", "1": "3"}, "pr_intinksfront": {"0": "2", "1": "3"}, "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm", "pr_intmaterialformatsqty": "500"}	2016-05-06 21:33:17.188966
16	{"cl_id": "6", "mt_id": "1", "pr_cord": "allocated", "pr_fold": "tryptic", "pr_type": "general", "pr_wire": "allocated", "pr_folio": "no", "pr_blocks": "100", "pr_partno": "TEST-ASA.asas: 23,34", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 3, "pr_process": "offset", "pr_varnish": "yes", "pr_inkfront": 2, "pr_inksback": {"0": "2", "1": "3", "2": "2"}, "pr_laminate": "yes", "pr_inksfront": {"0": "2", "1": "3"}, "pr_varnishuv": "oneside", "pr_diecutting": "yes", "pr_description": "este es un producto de prueba", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_finalsizewidth": "100.00", "pr_materialsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_laminatecaliber": "2mm", "pr_materialformatsqty": "123", "pr_materialsizeheight": "200.00", "pr_varnishfinished": "matte", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialsizemeasure": "cm"}	2016-06-25 20:29:53.504289
\.


--
-- Name: seq_client_cl_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_client_cl_id', 25, true);


--
-- Name: seq_ink_in_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_ink_in_id', 3, true);


--
-- Name: seq_machine_ma_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_machine_ma_id', 1, true);


--
-- Name: seq_material_mt_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_material_mt_id', 2, true);


--
-- Name: seq_product_pr_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_product_pr_id', 16, true);


--
-- Name: seq_supplier_su_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_supplier_su_id', 2, true);


--
-- Name: seq_user_us_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_user_us_id', 9, true);


--
-- Name: seq_wo_wo_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_wo_wo_id', 88, true);


--
-- Name: seq_zone_zo_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_zone_zo_id', 3, true);


--
-- Data for Name: supplier; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY supplier (su_id, su_jsonb, su_date) FROM stdin;
2	{"su_tin": "asds-123123", "su_city": 7054329, "su_name": "test", "su_email": "test@test.com", "su_phone": "6656565555", "su_state": 6957553, "su_county": 7054329, "su_mobile": "6145558787", "su_status": "A", "su_street": "test", "su_country": 1149361, "su_zipcode": "99898", "su_suitenumber": "test", "su_neighborhood": "test", "su_streetnumber": "test", "su_corporatename": "proveedor2", "su_fatherslastname": "test", "su_motherslastname": "test", "su_addressreference": "test"}	2015-04-05 16:17:23.299436
1	{"su_tin": "sabg-899845", "su_city": 8581830, "su_name": "test", "su_email": "test@test.com", "su_phone": "3366998898", "su_state": 4014336, "su_county": 8581830, "su_mobile": "5544885566", "su_status": "A", "su_street": "test", "su_country": 3996063, "su_zipcode": "55556", "su_suitenumber": "test", "su_neighborhood": "tes", "su_streetnumber": "tes", "su_corporatename": "proveedor1", "su_fatherslastname": "test", "su_motherslastname": "test", "su_addressreference": "test"}	2015-04-05 14:10:18.5826
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY "user" (us_id, us_jsonb, us_date) FROM stdin;
9	{"gr_id": "1", "us_name": "Alejandro", "us_user": "alejandrolsca", "us_email": "alejandrolsca@gmail.com", "us_phone": "3337979135", "us_mobile": "3316997770", "us_status": "A", "us_password": "a186419.ASB", "us_fatherslastname": "Sánchez", "us_motherslastname": "Betancourt"}	2014-07-27 21:32:29.7385
\.


--
-- Data for Name: wo; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY wo (wo_id, wo_jsonb, wo_date) FROM stdin;
14	{"cl_id": "6", "ma_id": 1, "pr_id": "15", "wo_po": "ABC001", "zo_id": "2", "wo_qty": "100", "wo_line": "1", "wo_type": "N", "wo_email": "yes", "wo_notes": "Esta es una orden de prueba", "wo_price": "99.99", "wo_status": "A", "wo_release": "rel001", "wo_currency": "DLLS", "wo_foliosto": "100", "wo_attention": "Marco", "wo_linetotal": "4", "wo_orderedby": "Alejandro", "wo_foliosfrom": "1", "wo_packageqty": "10", "wo_excedentqty": "10", "wo_foliosseries": "A", "wo_commitmentdate": "2016-07-01", "wo_foliosperformat": 1}	2016-06-19 21:17:53.458079
60	{"cl_id": "6", "ma_id": 1, "pr_id": "15", "wo_po": "ABC002", "zo_id": "2", "wo_qty": "100", "wo_line": "1", "wo_type": "N", "wo_email": "yes", "wo_notes": "Esta es una orden de prueba", "wo_price": "99.99", "wo_status": "A", "wo_release": "rel001", "wo_currency": "DLLS", "wo_foliosto": "100", "wo_attention": "Marco", "wo_linetotal": "4", "wo_orderedby": "Alejandro", "wo_foliosfrom": "1", "wo_packageqty": "10", "wo_excedentqty": "10", "wo_foliosseries": "A", "wo_commitmentdate": "2016-07-01", "wo_foliosperformat": 1}	2016-08-06 14:07:51.127387
61	{"cl_id": "6", "ma_id": 1, "pr_id": "15", "wo_po": "ABC003", "zo_id": "2", "wo_qty": "100", "wo_line": "1", "wo_type": "N", "wo_email": "yes", "wo_notes": "Esta es una orden de prueba", "wo_price": "99.99", "wo_status": "A", "wo_release": "rel001", "wo_currency": "DLLS", "wo_foliosto": "100", "wo_attention": "Marco", "wo_linetotal": "4", "wo_orderedby": "Alejandro", "wo_foliosfrom": "1", "wo_packageqty": "10", "wo_excedentqty": "10", "wo_foliosseries": "A", "wo_commitmentdate": "2016-07-01", "wo_foliosperformat": 1}	2016-08-06 14:08:14.619825
62	{"cl_id": "6", "ma_id": 1, "pr_id": "15", "wo_po": "ABC003", "zo_id": "2", "wo_qty": "100", "wo_line": "2", "wo_type": "N", "wo_email": "yes", "wo_notes": "Esta es una orden de prueba", "wo_price": "99.99", "wo_status": "A", "wo_release": "rel001", "wo_currency": "DLLS", "wo_foliosto": "100", "wo_attention": "Marco", "wo_linetotal": "4", "wo_orderedby": "Alejandro", "wo_foliosfrom": "1", "wo_packageqty": "10", "wo_excedentqty": "10", "wo_foliosseries": "A", "wo_commitmentdate": "2016-07-01", "wo_foliosperformat": 1}	2016-08-06 14:08:35.637515
63	{"cl_id": "6", "ma_id": 1, "pr_id": "15", "wo_po": "cr001", "zo_id": "2", "wo_qty": "100", "wo_line": "1", "wo_type": "N", "wo_email": "yes", "wo_notes": "PRUEBA", "wo_price": "100.00", "wo_status": "A", "wo_currency": "MXN", "wo_foliosto": "200", "wo_attention": "MARCO", "wo_linetotal": "4", "wo_orderedby": "ALEJANDRO", "wo_foliosfrom": "100", "wo_packageqty": "10", "wo_excedentqty": "10", "wo_foliosseries": "A", "wo_commitmentdate": "2016-09-15", "wo_foliosperformat": 5}	2016-08-13 14:34:08.628564
64	{"cl_id": "6", "ma_id": 1, "pr_id": "15", "wo_po": "assdads", "zo_id": "2", "wo_qty": "100", "wo_line": "1", "wo_type": "N", "wo_email": "yes", "wo_notes": "PRUEBA", "wo_price": "100.00", "wo_status": "A", "wo_release": "asdas", "wo_currency": "MXN", "wo_foliosto": "200", "wo_attention": "adsasda", "wo_linetotal": "3", "wo_orderedby": "asdads", "wo_foliosfrom": "100", "wo_packageqty": "10", "wo_excedentqty": "10", "wo_foliosseries": "A", "wo_commitmentdate": "2016-09-09", "wo_foliosperformat": 5}	2016-08-13 14:36:34.077091
\.


--
-- Data for Name: zone; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY zone (zo_id, zo_jsonb, zo_date) FROM stdin;
2	{"cl_id": "6", "zo_tin": "SABG-830102", "zo_city": 3040067, "zo_name": "test", "zo_zone": "test", "zo_email": "test@test.com", "zo_immex": "TTTT-123123", "zo_phone": "6144445454", "zo_state": 3040684, "zo_county": 3040067, "zo_mobile": "6148895655", "zo_status": "A", "zo_street": "test", "zo_country": 3041565, "zo_zipcode": "88888", "zo_suitenumber": "test", "zo_neighborhood": "test", "zo_streetnumber": "test", "zo_corporatename": "test", "zo_fatherslastname": "test", "zo_motherslastname": "test", "zo_addressreference": "test"}	2015-04-03 03:03:53.94271
3	{"cl_id": "6", "zo_tin": "test-123123", "zo_city": 616436, "zo_name": "test", "zo_zone": "test", "zo_email": "test@test.com", "zo_immex": "test-331232", "zo_phone": "6145555555", "zo_state": 828261, "zo_county": 616436, "zo_mobile": "6148899898", "zo_status": "A", "zo_street": "test", "zo_country": 174982, "zo_zipcode": "89956", "zo_suitenumber": "test", "zo_neighborhood": "test", "zo_streetnumber": "test", "zo_corporatename": "test", "zo_fatherslastname": "test", "zo_motherslastname": "test", "zo_addressreference": "test"}	2015-04-03 03:05:45.884652
1	{"cl_id": "6", "zo_tin": "SABG-830102", "zo_city": 7302102, "zo_name": "test", "zo_zone": "test4", "zo_email": "test@test.com", "zo_immex": "TTTT-123123", "zo_phone": "6144445454", "zo_state": 3041566, "zo_county": 3039181, "zo_mobile": "6148895655", "zo_status": "A", "zo_street": "test", "zo_country": 3041565, "zo_zipcode": "88888", "zo_suitenumber": "test", "zo_neighborhood": "test", "zo_streetnumber": "test", "zo_corporatename": "test4", "zo_fatherslastname": "test", "zo_motherslastname": "test", "zo_addressreference": "test"}	2015-04-03 03:00:05.564991
\.


--
-- Name: client_copy_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro; Tablespace: 
--

ALTER TABLE ONLY supplier
    ADD CONSTRAINT client_copy_pkey PRIMARY KEY (su_id);


--
-- Name: client_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro; Tablespace: 
--

ALTER TABLE ONLY client
    ADD CONSTRAINT client_pkey PRIMARY KEY (cl_id);


--
-- Name: material_copy_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro; Tablespace: 
--

ALTER TABLE ONLY ink
    ADD CONSTRAINT material_copy_pkey PRIMARY KEY (in_id);


--
-- Name: shipping_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro; Tablespace: 
--

ALTER TABLE ONLY zone
    ADD CONSTRAINT shipping_pkey PRIMARY KEY (zo_id);


--
-- Name: supplier_copy_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro; Tablespace: 
--

ALTER TABLE ONLY material
    ADD CONSTRAINT supplier_copy_pkey PRIMARY KEY (mt_id);


--
-- Name: user_copy_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro; Tablespace: 
--

ALTER TABLE ONLY machine
    ADD CONSTRAINT user_copy_pkey PRIMARY KEY (ma_id);


--
-- Name: user_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (us_id);


--
-- Name: wo_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro; Tablespace: 
--

ALTER TABLE ONLY wo
    ADD CONSTRAINT wo_pkey PRIMARY KEY (wo_id);


--
-- Name: client_cl_type_cl_tin_unique; Type: INDEX; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE UNIQUE INDEX client_cl_type_cl_tin_unique ON client USING btree (((cl_jsonb ->> 'cl_type'::text)), ((cl_jsonb ->> 'cl_tin'::text)));


--
-- Name: wo_po_line_linetotal_unique; Type: INDEX; Schema: public; Owner: Alejandro; Tablespace: 
--

CREATE UNIQUE INDEX wo_po_line_linetotal_unique ON wo USING btree (((wo_jsonb ->> 'wo_po'::text)), ((wo_jsonb ->> 'wo_line'::text)), ((wo_jsonb ->> 'wo_linetotal'::text)));


--
-- Name: public; Type: ACL; Schema: -; Owner: Alejandro
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM "Alejandro";
GRANT ALL ON SCHEMA public TO "Alejandro";
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

