--
-- PostgreSQL database dump
--

-- Dumped from database version 10.0
-- Dumped by pg_dump version 10.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


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
-- Name: client; Type: TABLE; Schema: public; Owner: Alejandro
--

CREATE TABLE client (
    cl_id integer DEFAULT nextval('seq_client_cl_id'::regclass) NOT NULL,
    cl_jsonb jsonb NOT NULL,
    cl_date timestamp(6) with time zone DEFAULT now() NOT NULL
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
-- Name: ink; Type: TABLE; Schema: public; Owner: Alejandro
--

CREATE TABLE ink (
    in_id integer DEFAULT nextval('seq_ink_in_id'::regclass) NOT NULL,
    in_jsonb jsonb NOT NULL,
    in_date timestamp(6) with time zone DEFAULT now() NOT NULL
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
-- Name: machine; Type: TABLE; Schema: public; Owner: Alejandro
--

CREATE TABLE machine (
    ma_id integer DEFAULT nextval('seq_machine_ma_id'::regclass) NOT NULL,
    ma_jsonb jsonb NOT NULL,
    ma_date timestamp(6) with time zone DEFAULT now() NOT NULL
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
-- Name: material; Type: TABLE; Schema: public; Owner: Alejandro
--

CREATE TABLE material (
    mt_id integer DEFAULT nextval('seq_material_mt_id'::regclass) NOT NULL,
    mt_jsonb jsonb NOT NULL,
    mt_date timestamp(6) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE material OWNER TO "Alejandro";

--
-- Name: seq_materialtype_maty_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_materialtype_maty_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_materialtype_maty_id OWNER TO "Alejandro";

--
-- Name: materialtype; Type: TABLE; Schema: public; Owner: Alejandro
--

CREATE TABLE materialtype (
    maty_id integer DEFAULT nextval('seq_materialtype_maty_id'::regclass) NOT NULL,
    maty_jsonb jsonb NOT NULL,
    maty_date timestamp(6) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE materialtype OWNER TO "Alejandro";

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
-- Name: product; Type: TABLE; Schema: public; Owner: Alejandro
--

CREATE TABLE product (
    pr_id integer DEFAULT nextval('seq_product_pr_id'::regclass) NOT NULL,
    pr_jsonb jsonb NOT NULL,
    pr_date timestamp(6) with time zone DEFAULT now() NOT NULL
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
-- Name: seq_tariffcode_tc_id; Type: SEQUENCE; Schema: public; Owner: Alejandro
--

CREATE SEQUENCE seq_tariffcode_tc_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_tariffcode_tc_id OWNER TO "Alejandro";

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
-- Name: supplier; Type: TABLE; Schema: public; Owner: Alejandro
--

CREATE TABLE supplier (
    su_id integer DEFAULT nextval('seq_supplier_su_id'::regclass) NOT NULL,
    su_jsonb jsonb NOT NULL,
    su_date timestamp(6) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE supplier OWNER TO "Alejandro";

--
-- Name: tariffcode; Type: TABLE; Schema: public; Owner: Alejandro
--

CREATE TABLE tariffcode (
    tc_id integer DEFAULT nextval('seq_tariffcode_tc_id'::regclass) NOT NULL,
    tc_jsonb jsonb,
    tc_date timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE tariffcode OWNER TO "Alejandro";

--
-- Name: wo; Type: TABLE; Schema: public; Owner: Alejandro
--

CREATE TABLE wo (
    wo_id integer DEFAULT nextval('seq_wo_wo_id'::regclass) NOT NULL,
    wo_jsonb jsonb NOT NULL,
    wo_date timestamp(6) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE wo OWNER TO "Alejandro";

--
-- Name: zone; Type: TABLE; Schema: public; Owner: Alejandro
--

CREATE TABLE zone (
    zo_id integer DEFAULT nextval('seq_zone_zo_id'::regclass) NOT NULL,
    zo_jsonb jsonb NOT NULL,
    zo_date timestamp(6) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE zone OWNER TO "Alejandro";

--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY client (cl_id, cl_jsonb, cl_date) FROM stdin;
2	{"cl_rfc": "GGM020610Q54", "cl_city": 8581816, "cl_name": "Arturo", "cl_type": "legal", "cl_email": "ingo@grupografico.com.mx", "cl_phone": "6144216260", "cl_state": 4014336, "cl_mobile": "6144216260", "cl_status": "A", "cl_street": "Retorno El Saucito", "cl_country": 3996063, "cl_zipcode": "31123", "cl_creditdays": "30", "cl_creditlimit": "100000.00", "cl_suitenumber": "10", "cl_firstsurname": "Rivas", "cl_neighborhood": "Complejo Industrial El Saucito", "cl_streetnumber": "1030", "cl_corporatename": "GRUPO GRAFICO DE MEXICO S.A. DE C.V.", "cl_secondsurname": "Romero", "cl_receiptschedule": "10-12", "cl_addressreference": "bodega", "cl_customerdiscount": "0.95"}	2017-12-09 02:22:47.603304+00
1	{"cl_rfc": "AABM7206302F2", "cl_city": 8581816, "cl_name": "MARCO ANTONIO", "cl_type": "natural", "cl_email": "marcoalanis@me.com", "cl_phone": "6144216260", "cl_state": 4014336, "cl_mobile": "6144216260", "cl_status": "A", "cl_street": "Colegio Cumbres", "cl_country": 3996063, "cl_zipcode": "31124", "cl_creditdays": "30", "cl_creditlimit": "100000.00", "cl_firstsurname": "ALANIS", "cl_neighborhood": "Paseo de las Misiones", "cl_streetnumber": "2628", "cl_secondsurname": "BATISTA", "cl_receiptschedule": "10 a 12", "cl_addressreference": "local azul", "cl_customerdiscount": "0.10"}	2017-12-09 02:20:26.425564+00
\.


--
-- Data for Name: ink; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY ink (in_id, in_jsonb, in_date) FROM stdin;
1	{"su_id": 4, "in_code": "Negro", "in_type": "offset", "in_status": "A", "in_description": "Negro Concentrado"}	2017-12-09 00:01:37.36636+00
2	{"su_id": 4, "in_code": "2995 Pantone", "in_type": "offset", "in_status": "A", "in_description": "Azul 2995 Pantone"}	2017-12-09 00:04:43.958354+00
3	{"su_id": 4, "in_code": "Process Blue Pantone", "in_type": "offset", "in_status": "A", "in_description": "Azul ProcesoPantone"}	2017-12-09 00:06:33.556072+00
4	{"su_id": 4, "in_code": "254 Pantone", "in_type": "offset", "in_status": "A", "in_description": "Purpura 254 Pantone"}	2017-12-09 00:07:17.902896+00
5	{"su_id": 4, "in_code": "021 Pantone", "in_type": "offset", "in_status": "A", "in_description": "Naranja 021 Pantone"}	2017-12-09 00:10:23.641935+00
6	{"su_id": 5, "in_code": "185 PANTONE", "in_type": "flexo", "in_status": "A", "in_description": "Rojo 185 Pantone"}	2017-12-09 00:10:30.854878+00
7	{"su_id": 5, "in_code": "286 Pantone", "in_type": "flexo", "in_status": "A", "in_description": "286 Azul Pantone"}	2017-12-09 00:11:02.251001+00
8	{"su_id": 4, "in_code": "Reflex Blue Pantone", "in_type": "offset", "in_status": "A", "in_description": "Azul Reflejo Pantone"}	2017-12-09 00:11:04.942788+00
9	{"su_id": 5, "in_code": "Negro", "in_type": "flexo", "in_status": "A", "in_description": "Negro denso"}	2017-12-09 00:12:03.277409+00
10	{"su_id": 4, "in_code": "2925 Pantone", "in_type": "offset", "in_status": "A", "in_description": "Azul 2925 Pantone"}	2017-12-09 00:14:43.881895+00
\.


--
-- Data for Name: machine; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY machine (ma_id, ma_jsonb, ma_date) FROM stdin;
1	{"ma_name": "Heidelberg Speed 52-2", "ma_status": "A", "ma_printbg": "yes", "ma_process": "offset", "ma_fullcolor": "yes", "ma_totalinks": "2", "ma_sizemeasure": "cm", "ma_maxsizewidth": "51.00", "ma_minsizewidth": "12.00", "ma_maxsizeheight": "36.00", "ma_minsizeheight": "12.00"}	2017-12-08 22:26:08.508137+00
2	{"ma_name": "Mark Andy 830", "ma_status": "A", "ma_printbg": "yes", "ma_process": "flexo", "ma_fullcolor": "no", "ma_totalinks": "3", "ma_sizemeasure": "in", "ma_maxsizewidth": "6.875", "ma_minsizewidth": "3.00", "ma_maxsizeheight": "39370.00", "ma_minsizeheight": "800.00"}	2017-12-08 22:30:14.801034+00
3	{"ma_name": "Heidelberg Speed 74-2", "ma_status": "A", "ma_printbg": "yes", "ma_process": "offset", "ma_fullcolor": "yes", "ma_totalinks": "2", "ma_sizemeasure": "cm", "ma_maxsizewidth": "74.00", "ma_minsizewidth": "43.00", "ma_maxsizeheight": "54.00", "ma_minsizeheight": "28.00"}	2017-12-09 00:34:24.229365+00
4	{"ma_name": "Mark Andy 810", "ma_status": "A", "ma_printbg": "yes", "ma_process": "flexo", "ma_fullcolor": "no", "ma_totalinks": "3", "ma_sizemeasure": "in", "ma_maxsizewidth": "6.875", "ma_minsizewidth": "3.00", "ma_maxsizeheight": "39370.00", "ma_minsizeheight": "800.00"}	2017-12-09 00:36:19.822009+00
5	{"ma_name": "Rico Pro C5200s Color", "ma_status": "A", "ma_printbg": "no", "ma_process": "digital", "ma_fullcolor": "yes", "ma_totalinks": "4", "ma_sizemeasure": "cm", "ma_maxsizewidth": "69.80", "ma_minsizewidth": "28.00", "ma_maxsizeheight": "33.00", "ma_minsizeheight": "21.50"}	2017-12-09 21:16:23.170194+00
6	{"ma_name": "Ricoh Pro 8100s B/N", "ma_status": "A", "ma_printbg": "yes", "ma_process": "digital", "ma_fullcolor": "no", "ma_totalinks": "1", "ma_sizemeasure": "cm", "ma_maxsizewidth": "48.80", "ma_minsizewidth": "28.00", "ma_maxsizeheight": "33.00", "ma_minsizeheight": "21.50"}	2017-12-09 21:25:46.193476+00
7	{"ma_name": "Heidelberg PrintMaster 46-2", "ma_status": "A", "ma_printbg": "yes", "ma_process": "offset", "ma_fullcolor": "no", "ma_totalinks": "2", "ma_sizemeasure": "cm", "ma_maxsizewidth": "34.00", "ma_minsizewidth": "9.00", "ma_maxsizeheight": "46.00", "ma_minsizeheight": "14.00"}	2017-12-09 21:38:59.108499+00
8	{"ma_name": "Mimaki UJV55-320 UV Rollo", "ma_status": "A", "ma_printbg": "no", "ma_process": "plotter", "ma_fullcolor": "yes", "ma_totalinks": "8", "ma_sizemeasure": "cm", "ma_maxsizewidth": "320.00", "ma_minsizewidth": "45.00", "ma_maxsizeheight": "4500.00", "ma_minsizeheight": "1000.00"}	2017-12-09 21:51:35.902664+00
9	{"ma_name": "Mimaki JFX200-2513 UV cama", "ma_status": "A", "ma_printbg": "no", "ma_process": "plotter", "ma_fullcolor": "yes", "ma_totalinks": "8", "ma_sizemeasure": "cm", "ma_maxsizewidth": "250.00", "ma_minsizewidth": "1.00", "ma_maxsizeheight": "130.00", "ma_minsizeheight": "1.00"}	2017-12-09 21:53:12.983448+00
10	{"ma_name": "Mimaki JV300-160 Solvente Rollo", "ma_status": "A", "ma_printbg": "no", "ma_process": "plotter", "ma_fullcolor": "yes", "ma_totalinks": "4", "ma_sizemeasure": "cm", "ma_maxsizewidth": "161.00", "ma_minsizewidth": "30.00", "ma_maxsizeheight": "4500.00", "ma_minsizeheight": "1000.00"}	2017-12-09 21:55:27.777289+00
11	{"ma_name": "Esko Kongsberg XN24 cama", "ma_status": "A", "ma_printbg": "no", "ma_process": "diecutting", "ma_fullcolor": "no", "ma_totalinks": "1", "ma_sizemeasure": "cm", "ma_maxsizewidth": "168.00", "ma_minsizewidth": "5.00", "ma_maxsizeheight": "320.00", "ma_minsizeheight": "5.00"}	2017-12-09 22:09:03.12772+00
\.


--
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY material (mt_id, mt_jsonb, mt_date) FROM stdin;
1	{"su_id": 2, "mt_code": "M-002-00001", "mt_type": 1, "mt_width": "43.00", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.0092", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel HP Doble Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:01:35.937097+00
3	{"su_id": 3, "mt_code": "M-003-00003", "mt_type": 3, "mt_width": "61.00", "mt_height": "90.00", "mt_status": "A", "mt_weight": "0.072", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Couche Europeo 2C Brillante 61x90 cm 130 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:19:49.712695+00
4	{"su_id": 3, "mt_code": "M-003-00004", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimico Excel CB Blanco Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:40:20.215417+00
5	{"su_id": 3, "mt_code": "M-003-00005", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimico Excel CFB Canario Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:42:09.565303+00
6	{"su_id": 3, "mt_code": "M-003-00006", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimico Excel CFB Verde Carta 75g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:44:30.642023+00
7	{"su_id": 3, "mt_code": "M-003-00007", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimico Excel CFB Azul Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:46:02.810433+00
8	{"su_id": 3, "mt_code": "M-003-00008", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimico Excel CFB Rosa Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:47:05.39381+00
9	{"su_id": 3, "mt_code": "M-003-00009", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimico Excel CFB Blanco Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:50:10.925269+00
10	{"su_id": 3, "mt_code": "M-003-00010", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimico Excel CF Canario Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:51:40.287678+00
11	{"su_id": 3, "mt_code": "M-003-00011", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimico Excel CF Verde Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:52:37.765197+00
12	{"su_id": 3, "mt_code": "M-003-00012", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimico Excel CF Azul Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:53:41.362507+00
13	{"su_id": 3, "mt_code": "M-003-00013", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimic Excel CF Rosa Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:55:14.660588+00
14	{"su_id": 3, "mt_code": "M-003-00014", "mt_type": 2, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.004", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Quimico Excel CF Blanco Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:57:48.381402+00
15	{"su_id": 1, "mt_code": "M-001-00015", "mt_type": 11, "mt_width": "11.10", "mt_height": "100000.00", "mt_status": "A", "mt_weight": "18.00", "mt_measure": "cm", "mt_thickness": "0.15", "mt_description": "Adhesivo TT14Q 111 mm x 1000 m", "mt_thicknessmeasure": "mm"}	2017-12-09 02:08:57.997217+00
16	{"su_id": 1, "mt_code": "M-001-00016", "mt_type": 11, "mt_width": "11.50", "mt_height": "100000.00", "mt_status": "A", "mt_weight": "18.00", "mt_measure": "cm", "mt_thickness": "0.15", "mt_description": "Adhesivo TT14Q 115 mm x 1000 m", "mt_thicknessmeasure": "mm"}	2017-12-09 02:11:06.859304+00
17	{"su_id": 1, "mt_code": "M-001-00017", "mt_type": 11, "mt_width": "12.80", "mt_height": "100000.00", "mt_status": "A", "mt_weight": "20.00", "mt_measure": "cm", "mt_thickness": "0.15", "mt_description": "Adhesivo TT14Q 128 mm x 1000 m", "mt_thicknessmeasure": "mm"}	2017-12-09 02:12:49.30311+00
18	{"su_id": 1, "mt_code": "M-001-00018", "mt_type": 11, "mt_width": "15.60", "mt_height": "100000.00", "mt_status": "A", "mt_weight": "24.00", "mt_measure": "cm", "mt_thickness": "0.15", "mt_description": "Adhesivo TT14Q 156 mm x 1000 m", "mt_thicknessmeasure": "mm"}	2017-12-09 02:14:08.528447+00
19	{"su_id": 1, "mt_code": "M-001-00019", "mt_type": 11, "mt_width": "16.60", "mt_height": "100000.00", "mt_status": "A", "mt_weight": "26.00", "mt_measure": "cm", "mt_thickness": "0.15", "mt_description": "Adhesivo TT14Q 166 mm x 1000 m", "mt_thicknessmeasure": "mm"}	2017-12-09 02:15:24.710377+00
20	{"su_id": 1, "mt_code": "M-001-00020", "mt_type": 11, "mt_width": "11.10", "mt_height": "100000.00", "mt_status": "A", "mt_weight": "17.00", "mt_measure": "cm", "mt_thickness": "0.15", "mt_description": "Adhesivo DT01J 111 mm x 1000 m", "mt_thicknessmeasure": "mm"}	2017-12-09 02:16:51.572609+00
2	{"su_id": 2, "mt_code": "M-002-00002", "mt_type": 1, "mt_width": "61.00", "mt_height": "90.00", "mt_status": "A", "mt_weight": "0.040", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel Bond Bco Offset-EB 61x90cm 75g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:05:32.188438+00
\.


--
-- Data for Name: materialtype; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY materialtype (maty_id, maty_jsonb, maty_date) FROM stdin;
1	{"label": "Papel bond", "value": "offset,digital,plotter,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
2	{"label": "Papel autocopiante", "value": "offset,digital"}	2017-11-22 01:19:10.194817+00
3	{"label": "Papel recubierto", "value": "offset,digital,plotter,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
4	{"label": "Cartulina Hoja", "value": "offset,digital,plotter,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
5	{"label": "Cartulina recubierta Hoja", "value": "offset,digital,plotter,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
6	{"label": "Cartulina rollo", "value": "flexo"}	2017-11-22 01:19:10.194817+00
7	{"label": "Cartulina recubierta rollo", "value": "flexo"}	2017-11-22 01:19:10.194817+00
8	{"label": "Carton delgado rollo", "value": "flexo"}	2017-11-22 01:19:10.194817+00
9	{"label": "Carton delgado", "value": "offset,digital,plotter,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
10	{"label": "Corrugado", "value": "plotter,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
11	{"label": "Adhesivo papel recubierto", "value": "offset,digital,flexo,plotter,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
12	{"label": "Adhesivo papel sintetico", "value": "offset,digital,flexo,plotter,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
13	{"label": "Sintetico sin adhesivo", "value": "offset,digital,flexo,plotter,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
14	{"label": "Ribbon", "value": "flexo,direct_sale"}	2017-11-22 01:19:10.194817+00
15	{"label": "Vinil digital", "value": "plotter,diecutting,digital"}	2017-11-22 01:19:10.194817+00
16	{"label": "Poliester digital", "value": "plotter,diecutting,digital"}	2017-11-22 01:19:10.194817+00
17	{"label": "Acrilico", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
18	{"label": "Corruplast", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
19	{"label": "PVC", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
20	{"label": "Estireno", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
21	{"label": "Gravoplate", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
22	{"label": "Plastico", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
23	{"label": "Policarbonato", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
24	{"label": "Madera", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
25	{"label": "Ceramica", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
26	{"label": "Metal", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
27	{"label": "Piel", "value": "plotter,laser,diecutting"}	2017-11-22 01:19:10.194817+00
28	{"label": "Sellos", "value": "stamps,direct_sale"}	2017-11-22 01:19:10.194817+00
29	{"label": "Articulos", "value": "offset,digital,flexo,plotter,stamps,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
30	{"label": "Otros", "value": "offset,digital,flexo,plotter,stamps,serigraphy,laser,diecutting,direct_sale,service"}	2017-11-22 01:19:10.194817+00
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY product (pr_id, pr_jsonb, pr_date) FROM stdin;
2	{"cl_id": 2, "mt_id": {"0": 3, "1": 1, "2": 3}, "pr_code": "P-0002-0000002-offset-paginated", "pr_name": "Manual de Operación", "pr_type": "paginated", "pr_bound": "no", "pr_drill": {"0": 0, "1": 0, "2": 0}, "pr_folio": "no", "pr_pages": {"0": "2", "1": "12", "2": "2"}, "pr_partno": "j2345", "pr_precut": {"0": "no", "1": "no", "2": "horizontal"}, "pr_status": "A", "pr_weight": 10.50, "pr_concept": {"0": "portada", "1": "interior", "2": "incerto"}, "pr_inkback": {"0": 0, "1": 1, "2": 3}, "pr_process": "offset", "pr_varnish": {"0": "oneside", "1": "no", "2": "no"}, "pr_inkfront": {"0": 2, "1": 1, "2": 2}, "pr_inksback": {"1": {"0": 1}, "2": {"0": 2, "1": 4, "2": 4}}, "pr_laminate": {"0": "no", "1": "no", "2": "oneside"}, "pr_language": "español", "pr_stapling": "2", "pr_foldunit1": {"0": 0, "1": 0, "2": 0}, "pr_foldunit2": {"0": 0, "1": 0, "2": 0}, "pr_foldunit3": {"0": 0, "1": 0, "2": 0}, "pr_inksfront": {"0": {"0": 3, "1": 1}, "1": {"0": 1}, "2": {"0": 3, "1": 5}}, "pr_components": 3, "pr_spiralbind": "no", "pr_description": "Manual para Induccion", "pr_finalsizewidth": "21.50", "pr_finalsizeheight": "28.00", "pr_laminatecaliber": {"2": "2mm"}, "pr_varnishfinished": {"0": "bright"}, "pr_finalsizemeasure": "cm", "pr_laminatefinished": {"2": "bright"}, "pr_materialsizewidth": {"0": "30.50", "1": "43.00", "2": "30.50"}, "pr_materialformatsqty": {"0": "1", "1": "1", "2": "2"}, "pr_materialsizeheight": {"0": "45.00", "1": "28.00", "2": "45.00"}, "pr_materialsizemeasure": {"0": "cm", "1": "cm", "2": "cm"}}	2017-12-09 02:34:41.219314+00
1	{"cl_id": 1, "mt_id": 3, "pr_code": "P-0001-0000001-offset-general", "pr_cord": "no", "pr_name": "Volantes El buen Fin", "pr_type": "general", "pr_wire": "no", "pr_drill": 0, "pr_folio": "no", "pr_blocks": "no", "pr_partno": "mm2123", "pr_precut": "no", "pr_status": "A", "pr_weight": 10.50, "pr_inkback": 1, "pr_process": "offset", "pr_varnish": "oneside", "pr_inkfront": 2, "pr_inksback": {"0": 1}, "pr_laminate": "no", "pr_language": "español", "pr_foldunit1": 0, "pr_foldunit2": 0, "pr_foldunit3": 0, "pr_inksfront": {"0": 2, "1": 4}, "pr_description": "Volantes Media carta Papel Bond", "pr_diecuttingqty": "0", "pr_reinforcement": "no", "pr_finalsizewidth": "21.50", "pr_finalsizeheight": "14.00", "pr_varnishfinished": "bright", "pr_finalsizemeasure": "cm", "pr_materialsizewidth": "30.50", "pr_materialformatsqty": "4", "pr_materialsizeheight": "45.00", "pr_materialsizemeasure": "cm"}	2017-12-09 02:27:34.223059+00
3	{"cl_id": 2, "mt_id": {"0": 4, "1": 6, "2": 13}, "pr_code": "P-0002-0000003-offset-counterfoil", "pr_cord": "no", "pr_name": "Requisicion de compra", "pr_type": "counterfoil", "pr_wire": "no", "pr_drill": 0, "pr_folio": "yes", "pr_blocks": 25, "pr_partno": "m23612", "pr_precut": "no", "pr_status": "A", "pr_weight": 10.50, "pr_concept": {"0": "original", "1": "copia 1", "2": "copia 2"}, "pr_inkback": {"0": 0, "1": 1, "2": 0}, "pr_process": "offset", "pr_inkfront": {"0": 1, "1": 1, "2": 1}, "pr_inksback": {"1": {"0": 2}}, "pr_language": "español", "pr_inksfront": {"0": {"0": 1}, "1": {"0": 1}, "2": {"0": 2}}, "pr_components": 3, "pr_description": "Formatos para Compra", "pr_reinforcement": "no", "pr_finalsizewidth": "21.50", "pr_finalsizeheight": "28.00", "pr_finalsizemeasure": "cm", "pr_materialsizewidth": {"0": "21.50", "1": "21.50", "2": "21.50"}, "pr_materialformatsqty": {"0": "1", "1": "1", "2": "1"}, "pr_materialsizeheight": {"0": "28.00", "1": "28.00", "2": "28.00"}, "pr_materialsizemeasure": {"0": "in", "1": "cm", "2": "cm"}}	2017-12-09 02:39:08.454292+00
4	{"cl_id": 2, "mt_id": 1, "pr_code": "P-0002-0000004-offset-general", "pr_cord": "no", "pr_name": "Flyer todos a las fiesta", "pr_type": "general", "pr_wire": "no", "pr_drill": 0, "pr_folio": "no", "pr_blocks": "no", "pr_partno": "m376", "pr_precut": "no", "pr_status": "A", "pr_weight": 10.50, "pr_inkback": 2, "pr_process": "offset", "pr_varnish": "twosides", "pr_inkfront": 2, "pr_inksback": {"0": 2, "1": 2}, "pr_laminate": "no", "pr_language": "español", "pr_foldunit1": 2, "pr_foldunit2": 0, "pr_foldunit3": 0, "pr_inksfront": {"0": 2, "1": 3}, "pr_description": "volante para promocionar fiestas", "pr_diecuttingqty": "0", "pr_reinforcement": "no", "pr_finalsizewidth": "21.50", "pr_finalsizeheight": "14.00", "pr_varnishfinished": "bright", "pr_finalsizemeasure": "cm", "pr_materialsizewidth": "43.00", "pr_materialformatsqty": "4", "pr_materialsizeheight": "28.00", "pr_materialsizemeasure": "cm"}	2017-12-09 02:41:09.289092+00
5	{"cl_id": 2, "mt_id": 20, "pr_code": "P-0002-0000005-flexo-labels", "pr_core": 2, "pr_name": "Etiqueta Directa 4x6 pulgadas", "pr_type": "labels", "pr_folio": "no", "pr_partno": "m534", "pr_precut": "vertical", "pr_status": "A", "pr_weight": 10.50, "pr_inkback": 0, "pr_process": "flexo", "pr_varnish": "no", "pr_inkfront": 0, "pr_laminate": "no", "pr_language": "español", "pr_description": "etiqueta Trasferencia Directa Bca", "pr_finalsizewidth": "4.00", "pr_finalsizeheight": "6.00", "pr_finalsizemeasure": "in", "pr_materialformatsqty": "1"}	2017-12-09 02:42:58.008584+00
6	{"cl_id": 2, "mt_id": 15, "pr_code": "P-0002-0000006-flexo-labels", "pr_core": 2, "pr_name": "Etiqueta de Producto Amarillo", "pr_type": "labels", "pr_folio": "no", "pr_partno": "m5445", "pr_precut": "horizontal", "pr_status": "A", "pr_weight": 10.50, "pr_inkback": 0, "pr_process": "flexo", "pr_varnish": "no", "pr_inkfront": 3, "pr_laminate": "oneside", "pr_language": "español", "pr_inksfront": {"0": 7, "1": 6, "2": 9}, "pr_description": "Etiqueta de Producto", "pr_finalsizewidth": "10.00", "pr_finalsizeheight": "20.00", "pr_laminatecaliber": "2mm", "pr_finalsizemeasure": "cm", "pr_laminatefinished": "matte", "pr_materialformatsqty": "2"}	2017-12-09 02:46:10.697715+00
\.


--
-- Data for Name: supplier; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY supplier (su_id, su_jsonb, su_date) FROM stdin;
1	{"su_rfc": "URM001101D8A", "su_city": 8379488, "su_name": "Alberto", "su_type": "legal", "su_email": "alberto.hidalgo@upmraflatac.com", "su_phone": "01 55 5443 8672", "su_state": 3523272, "su_mobile": "5523283180", "su_status": "A", "su_street": "Av. Olivo", "su_country": 3996063, "su_zipcode": "54940", "su_suitenumber": "Nave 4", "su_firstsurname": "Hidalgo", "su_neighborhood": "San Francisco Chilpan", "su_streetnumber": "SN", "su_corporatename": "UPM Raflatac Mexico SA de CV"}	2017-12-08 23:19:10.007833+00
2	{"su_rfc": "AOF870529IU7", "su_city": 8581816, "su_name": "Linda Susana", "su_type": "legal", "su_email": "sgalindo@adosa.com.mx", "su_phone": "016144101500", "su_state": 4014336, "su_mobile": "6141826543", "su_status": "A", "su_street": "Av. Julian Carrillo", "su_country": 3996063, "su_zipcode": "31000", "su_firstsurname": "Galindo", "su_neighborhood": "Centro", "su_streetnumber": "806", "su_corporatename": "Abastecedora de Oficinas SA de CV", "su_addressreference": "Esq con Ocampo"}	2017-12-08 23:35:36.031586+00
4	{"su_rfc": "BEMM650719TZA", "su_city": 8581816, "su_name": "Martha Rebeca", "su_type": "natural", "su_email": "rebeca_664@hotmail.com", "su_phone": "016144155455", "su_state": 4014336, "su_mobile": "6141845365", "su_status": "A", "su_street": "Privada de Samaniego", "su_country": 3996063, "su_zipcode": "31460", "su_firstsurname": "Becerra", "su_neighborhood": "Cerro de la Cruz", "su_streetnumber": "6406", "su_secondsurname": "Medina"}	2017-12-08 23:54:37.433445+00
5	{"su_rfc": "SACC7204042S3", "su_city": 8582219, "su_name": "Carlos Antonio", "su_type": "natural", "su_email": "ventas1@flexotech.com.mx", "su_phone": "01 33 3656 0408", "su_state": 4004156, "su_mobile": "3312087045", "su_status": "A", "su_street": "Zapatera", "su_country": 3996063, "su_zipcode": "45130", "su_firstsurname": "Sanchez", "su_neighborhood": "Industrial Zapopan Norte", "su_streetnumber": "56", "su_secondsurname": "Calderon"}	2017-12-09 00:00:54.558198+00
6	{"su_rfc": "PKM940519PH0", "su_city": 8581816, "su_name": "Jose Dagoberto", "su_type": "legal", "su_email": "jose.marquez@veritivcorp.com", "su_phone": "01 614 424 2418", "su_state": 4014336, "su_mobile": "614-1-84-66-97", "su_status": "A", "su_street": "Alejandro Dumas", "su_country": 3996063, "su_zipcode": "31136", "su_suitenumber": "5", "su_firstsurname": "Marquez", "su_neighborhood": "Complejo Industrial Chihuahua", "su_streetnumber": "11367", "su_corporatename": "Papelera Kif de Mexico SA de CV", "su_secondsurname": "Loo", "su_phoneextension": "234"}	2017-12-09 00:06:41.419539+00
3	{"su_rfc": "NEW9406037R6", "su_city": 8581816, "su_name": "Manuel", "su_type": "legal", "su_email": "manuel.loera@newberry.com.mx", "su_phone": "01 614 415 7575", "su_state": 4014336, "su_mobile": "6141367354", "su_status": "A", "su_street": "Av. Independencia", "su_country": 3996063, "su_zipcode": "31000", "su_firstsurname": "Loera", "su_neighborhood": "Centro", "su_streetnumber": "800", "su_corporatename": "Newberry y Compañia SA de CV"}	2017-12-08 23:49:48.655622+00
\.


--
-- Data for Name: tariffcode; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY tariffcode (tc_id, tc_jsonb, tc_date) FROM stdin;
1	{"tc_code": "4901.99.99", "tc_status": "A", "tc_description": "PANFLETOS, MANUALES E INSTRUCTIVOS"}	2017-12-07 04:23:02.814905+00
2	{"tc_code": "3919.10.01", "tc_status": "A", "tc_description": "ETIQUETA PLASTICA"}	2017-12-07 04:23:02.814905+00
3	{"tc_code": "3919.90.99", "tc_status": "A", "tc_description": "ETIQUETA DE PLASTICO"}	2017-12-07 04:23:02.814905+00
4	{"tc_code": "4821.10.01", "tc_status": "A", "tc_description": "ETIQUETA IMPRESA"}	2017-12-07 04:23:02.814905+00
5	{"tc_code": "4821.90.99", "tc_status": "A", "tc_description": "ETIQUETA NO IMPRESA"}	2017-12-07 04:23:02.814905+00
6	{"tc_code": "4901.10.99", "tc_status": "A", "tc_description": "INSTRUCTIVOS"}	2017-12-07 04:23:02.814905+00
7	{"tc_code": "4911.99.99", "tc_status": "A", "tc_description": "TARJETA IMPRESA"}	2017-12-07 04:23:02.814905+00
\.


--
-- Data for Name: wo; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY wo (wo_id, wo_jsonb, wo_date) FROM stdin;
1	{"cl_id": 2, "ma_id": 1, "pr_id": 2, "wo_po": "GG001", "zo_id": 1, "wo_qty": "100", "wo_line": "1", "wo_type": "N", "wo_email": "no", "wo_notes": "los manuales deben. de quedar perfectamente cortados", "wo_price": "35.00", "wo_boxqty": "1", "wo_status": 0, "wo_release": "123", "wo_currency": "MXN", "wo_attention": "Maria Borunda", "wo_linetotal": "5", "wo_orderedby": "Maria Borunda", "wo_packageqty": "1", "wo_commitmentdate": "2017-12-30", "wo_componentmaterialqty": {"0": "30.00", "1": "320.00", "2": "70.00"}}	2017-12-09 05:50:48.970179+00
2	{"cl_id": 2, "ma_id": 1, "pr_id": 3, "wo_po": "345", "zo_id": 1, "wo_qty": "1000", "wo_line": "1", "wo_type": "N", "wo_email": "no", "wo_notes": "Folios en tinta morada12", "wo_price": "1.00", "wo_boxqty": "1000", "wo_status": 0, "wo_release": "123", "wo_currency": "MXN", "wo_foliosto": "1000", "wo_attention": "Enrique", "wo_linetotal": "1", "wo_orderedby": "Enrique Lopez", "wo_foliosfrom": "0001", "wo_packageqty": "500", "wo_foliosseries": "J", "wo_commitmentdate": "2017-12-29", "wo_foliosperformat": 2, "wo_componentmaterialqty": {"0": "1020.00", "1": "1020.00", "2": "1020.00"}}	2017-12-09 05:57:49.727712+00
4	{"cl_id": 2, "ma_id": 1, "pr_id": 2, "wo_po": "GG002", "zo_id": 1, "wo_qty": "200", "wo_line": "1", "wo_type": "R", "wo_email": "no", "wo_notes": "los manuales deben. de quedar perfectamente cortados", "wo_price": "35.00", "wo_boxqty": "1", "wo_status": 17, "wo_release": "123", "wo_currency": "MXN", "wo_attention": "Maria Borunda", "wo_linetotal": "5", "wo_orderedby": "Maria Borunda", "wo_packageqty": "1", "wo_previousid": 1, "wo_deliverydate": "2017-12-11T05:04:02.422806+00:00", "wo_previousdate": "2017-12-08", "wo_commitmentdate": "2017-12-31", "wo_componentmaterialqty": {"0": "60.00", "1": "640.00", "2": "140.00"}}	2017-12-09 06:08:29.427931+00
\.


--
-- Data for Name: zone; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY zone (zo_id, zo_jsonb, zo_date) FROM stdin;
1	{"cl_id": 2, "zo_rfc": "GGM020610Q54", "zo_city": 8581816, "zo_name": "Marco", "zo_type": "legal", "zo_zone": "Acacias", "zo_email": "info@grupografico.com.mx", "zo_phone": "6144216262", "zo_state": 4014336, "zo_mobile": "6144216565", "zo_status": "A", "zo_street": "Acacias", "zo_country": 3996063, "zo_zipcode": "31160", "zo_firstsurname": "Alanis", "zo_neighborhood": "Granjas", "zo_streetnumber": "410", "zo_corporatename": "GRUPO GRAFICO DE MEXICO SA DE CV", "zo_receiptschedule": "10-12", "zo_addressreference": "Bodega"}	2017-12-09 05:22:44.174035+00
2	{"cl_id": 1, "zo_rfc": "AABM7206302F2", "zo_city": 8581816, "zo_name": "RICARDO", "zo_type": "natural", "zo_zone": "CENTRO", "zo_email": "ricardo@ggg.com.mx", "zo_phone": "6154342424", "zo_state": 4014336, "zo_mobile": "6363626236", "zo_status": "A", "zo_street": "2 da.", "zo_country": 3996063, "zo_zipcode": "31111", "zo_firstsurname": "ALANIS", "zo_neighborhood": "Centro", "zo_streetnumber": "1020", "zo_receiptschedule": "10-12", "zo_addressreference": "casa verde"}	2017-12-09 05:25:09.155615+00
\.


--
-- Name: seq_client_cl_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_client_cl_id', 2, true);


--
-- Name: seq_ink_in_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_ink_in_id', 10, true);


--
-- Name: seq_machine_ma_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_machine_ma_id', 11, true);


--
-- Name: seq_material_mt_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_material_mt_id', 20, true);


--
-- Name: seq_materialtype_maty_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_materialtype_maty_id', 30, true);


--
-- Name: seq_product_pr_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_product_pr_id', 6, true);


--
-- Name: seq_supplier_su_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_supplier_su_id', 6, true);


--
-- Name: seq_tariffcode_tc_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_tariffcode_tc_id', 7, true);


--
-- Name: seq_wo_wo_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_wo_wo_id', 4, true);


--
-- Name: seq_zone_zo_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_zone_zo_id', 2, true);


--
-- Name: supplier client_copy_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro
--

ALTER TABLE ONLY supplier
    ADD CONSTRAINT client_copy_pkey PRIMARY KEY (su_id);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro
--

ALTER TABLE ONLY client
    ADD CONSTRAINT client_pkey PRIMARY KEY (cl_id);


--
-- Name: materialtype materialtype_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro
--

ALTER TABLE ONLY materialtype
    ADD CONSTRAINT materialtype_pkey PRIMARY KEY (maty_id);


--
-- Name: ink paper_copy_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro
--

ALTER TABLE ONLY ink
    ADD CONSTRAINT paper_copy_pkey PRIMARY KEY (in_id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro
--

ALTER TABLE ONLY product
    ADD CONSTRAINT product_pkey PRIMARY KEY (pr_id);


--
-- Name: zone shipping_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro
--

ALTER TABLE ONLY zone
    ADD CONSTRAINT shipping_pkey PRIMARY KEY (zo_id);


--
-- Name: material supplier_copy_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro
--

ALTER TABLE ONLY material
    ADD CONSTRAINT supplier_copy_pkey PRIMARY KEY (mt_id);


--
-- Name: tariffcode tariffcode_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro
--

ALTER TABLE ONLY tariffcode
    ADD CONSTRAINT tariffcode_pkey PRIMARY KEY (tc_id);


--
-- Name: machine user_copy_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro
--

ALTER TABLE ONLY machine
    ADD CONSTRAINT user_copy_pkey PRIMARY KEY (ma_id);


--
-- Name: wo wo_pkey; Type: CONSTRAINT; Schema: public; Owner: Alejandro
--

ALTER TABLE ONLY wo
    ADD CONSTRAINT wo_pkey PRIMARY KEY (wo_id);


--
-- Name: client_cl_type_cl_tin_unique; Type: INDEX; Schema: public; Owner: Alejandro
--

CREATE UNIQUE INDEX client_cl_type_cl_tin_unique ON client USING btree (((cl_jsonb ->> 'cl_type'::text)), ((cl_jsonb ->> 'cl_tin'::text)));


--
-- Name: wo_po_line_linetotal_unique; Type: INDEX; Schema: public; Owner: Alejandro
--

CREATE UNIQUE INDEX wo_po_line_linetotal_unique ON wo USING btree (((wo_jsonb ->> 'wo_po'::text)), ((wo_jsonb ->> 'wo_line'::text)), ((wo_jsonb ->> 'wo_linetotal'::text)));


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO "Alejandro";


--
-- PostgreSQL database dump complete
--

