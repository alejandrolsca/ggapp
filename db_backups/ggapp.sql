--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

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
-- Name: wo_after_update(); Type: FUNCTION; Schema: public; Owner: Alejandro
--

CREATE FUNCTION wo_after_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE wo
	SET wo_jsonb = jsonb_set(wo_jsonb,'{wo_updatedate}',to_jsonb(now()), true)
	WHERE wo_id = NEW.wo_id;
	RETURN NULL;
END;
$$;


ALTER FUNCTION public.wo_after_update() OWNER TO "Alejandro";

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
7	{"cl_rfc": "AMC071211FE2", "cl_city": 8581816, "cl_name": "Karla", "cl_type": "legal", "cl_email": "karlaag_muebles@hotmail.com", "cl_phone": "6145411495", "cl_state": 4014336, "cl_mobile": "6145411495", "cl_status": "A", "cl_street": "71", "cl_country": 3996063, "cl_zipcode": "31390", "cl_firstsurname": "Gallegos", "cl_neighborhood": "Aeropuerto", "cl_streetnumber": "6802", "cl_corporatename": "AG Muebles y Cocinas, S. A de C. V.", "cl_receiptschedule": "9:00 - 17:00"}	2017-12-26 18:13:26.20325+00
2	{"cl_rfc": "XEXX010101000", "cl_city": 4518598, "cl_name": "Gilda", "cl_type": "legal", "cl_email": "gilda.zambrano@standardregister.com", "cl_phone": "8111569000", "cl_state": 5165418, "cl_county": 4509920, "cl_mobile": "8111569000", "cl_ssntin": "47-4290991", "cl_status": "A", "cl_street": "Albany Street", "cl_country": 6252001, "cl_zipcode": "45408", "cl_creditdays": "45", "cl_firstsurname": "Zambrano", "cl_streetnumber": "600", "cl_corporatename": "Standard Register, Inc.", "cl_secondsurname": "Melin", "cl_phoneextension": "9005", "cl_receiptschedule": "8:00 - 17:00"}	2017-12-26 15:55:07.613618+00
3	{"cl_rfc": "IUN941111CQ3", "cl_city": 8582427, "cl_name": "Cristian", "cl_type": "legal", "cl_email": "cristian.cantu@standardregister.com", "cl_phone": "8111569000", "cl_state": 3522542, "cl_mobile": "8111569000", "cl_status": "A", "cl_street": "Carrtera a Huinala Km. 2.8", "cl_country": 3996063, "cl_zipcode": "66645", "cl_creditdays": "45", "cl_suitenumber": "A", "cl_firstsurname": "Cantu", "cl_neighborhood": "Parque Industrial Las Americas", "cl_streetnumber": "404", "cl_corporatename": "Standard Register Latinoamerica, S. de R. L. de C. V.", "cl_receiptschedule": "8:00 - 17:00"}	2017-12-26 16:28:48.849182+00
4	{"cl_rfc": "XEXX010101000", "cl_city": 5137620, "cl_name": "Enrique", "cl_type": "legal", "cl_email": "Enrique.Zavala@Xyleminc.com", "cl_phone": "6142142050", "cl_state": 5128638, "cl_county": 5137625, "cl_mobile": "6142142050", "cl_status": "A", "cl_street": "East Bayard Street", "cl_country": 6252001, "cl_zipcode": "13148", "cl_suitenumber": "Suit B", "cl_firstsurname": "Zavala", "cl_streetnumber": "2881", "cl_corporatename": "Xylem Flow Control LLC", "cl_phoneextension": "2142141", "cl_receiptschedule": "7:00 - 14:00"}	2017-12-26 16:51:39.106969+00
5	{"cl_rfc": "ACI1612028W2", "cl_city": 8581816, "cl_name": "Laura", "cl_type": "legal", "cl_email": "laura.parra@acelec-chihuahua.com", "cl_phone": "6142368442", "cl_state": 4014336, "cl_mobile": "6142368442", "cl_status": "A", "cl_street": "Retorno El Saucito", "cl_country": 3996063, "cl_zipcode": "31125", "cl_suitenumber": "8", "cl_firstsurname": "Parra", "cl_neighborhood": "Complejo Industrial El Saucito", "cl_streetnumber": "1030", "cl_corporatename": "Acelec Chihuahua, S. A. de C. V.", "cl_receiptschedule": "8:00 - 17:00", "cl_addressreference": "Bodega de enseguida"}	2017-12-26 17:07:07.43513+00
6	{"cl_rfc": "AES120101NW6", "cl_city": 8583272, "cl_name": "Cyndi", "cl_type": "legal", "cl_email": "curibe@aciarium.mx", "cl_phone": "4424296600", "cl_state": 3520914, "cl_mobile": "4424296600", "cl_status": "A", "cl_street": "Av. del Tepeyac", "cl_country": 3996063, "cl_zipcode": "76250", "cl_firstsurname": "Montiel", "cl_neighborhood": "Parque Industrial El Tepeyac", "cl_streetnumber": "11190", "cl_corporatename": "Aciarium Estructuras, S. A de C. V.", "cl_phoneextension": "327", "cl_receiptschedule": "8:00 - 13:00 y 14:00 - 17:00"}	2017-12-26 17:19:38.346838+00
8	{"cl_rfc": "AUDA580126LRA", "cl_city": 8581816, "cl_name": "Alicia Hortensia", "cl_type": "natural", "cl_email": "imprenta_acevedo@hotmail.com", "cl_phone": "6144210557", "cl_state": 4014336, "cl_mobile": "6144210557", "cl_status": "A", "cl_street": "Parcutin", "cl_country": 3996063, "cl_zipcode": "31107", "cl_firstsurname": "Andujo", "cl_neighborhood": "Panoramico", "cl_streetnumber": "5705", "cl_secondsurname": "Dominguez", "cl_receiptschedule": "8:00 - 16:00"}	2017-12-26 18:22:55.648812+00
9	{"cl_rfc": "AME810406RN2", "cl_city": 8581816, "cl_name": "Sandra", "cl_type": "legal", "cl_email": "fe.admx@mssl.motherson.com", "cl_phone": "6144260707", "cl_state": 4014336, "cl_mobile": "6144260707", "cl_status": "A", "cl_street": "Washingtong", "cl_country": 3996063, "cl_zipcode": "31114", "cl_firstsurname": "Huerta", "cl_neighborhood": "Complejo Industrial Las Americas", "cl_streetnumber": "3701", "cl_corporatename": "Alphabet de Mexico, S. A. de C. V."}	2017-12-26 18:41:50.129639+00
10	{"cl_rfc": "MEBA910404R70", "cl_city": 8581816, "cl_name": "Arely", "cl_type": "natural", "cl_email": "alba.chavez@enosa.com.mx", "cl_phone": "6142628092", "cl_state": 4014336, "cl_mobile": "6142628092", "cl_status": "A", "cl_street": "Bosque de Moctezuma", "cl_country": 3996063, "cl_zipcode": "31205", "cl_firstsurname": "Mendez", "cl_neighborhood": "Los Sicomoros", "cl_streetnumber": "1809", "cl_secondsurname": "Blanco", "cl_receiptschedule": "9:00 - 13:00 y 14:00 - 17:00", "cl_addressreference": "Empacados del Norte"}	2017-12-26 18:56:44.264275+00
11	{"cl_rfc": "NAPC5407161T9", "cl_city": 8581816, "cl_name": "Carmen Alicia", "cl_type": "natural", "cl_email": "diezydiez10@gmail.com", "cl_phone": "6144140910", "cl_state": 4014336, "cl_mobile": "6144140910", "cl_status": "A", "cl_street": "Av. Tecnologico", "cl_country": 3996063, "cl_zipcode": "31200", "cl_firstsurname": "Navarrete", "cl_neighborhood": "Altavista", "cl_streetnumber": "2101", "cl_secondsurname": "Peña", "cl_receiptschedule": "9:00 - 16:00"}	2017-12-26 19:03:07.112278+00
12	{"cl_rfc": "CDE890310KA0", "cl_city": 8581818, "cl_name": "Paula", "cl_type": "legal", "cl_email": "paula.vargas@cardinalhealth.com", "cl_phone": "6394708400", "cl_state": 4014336, "cl_mobile": "6394708400", "cl_status": "A", "cl_street": "Parque Industrial Las Virgenes", "cl_country": 3996063, "cl_zipcode": "33018", "cl_firstsurname": "Vargas", "cl_neighborhood": "Parque Industrial Las Virgenes", "cl_streetnumber": "SN", "cl_corporatename": "Cirpro de Delicias, S. A. de C. V.", "cl_receiptschedule": "8:00-13:00 y 16:00-17:30"}	2017-12-26 19:09:01.09725+00
13	{"cl_rfc": "DAM121126BT1", "cl_city": 8581816, "cl_name": "Oscar", "cl_type": "legal", "cl_email": "dgfactu@tiendasdg.com", "cl_phone": "6144104041", "cl_state": 4014336, "cl_mobile": "6144104041", "cl_status": "A", "cl_street": "Paseo Bolivar", "cl_country": 3996063, "cl_zipcode": "31000", "cl_firstsurname": "Herrera", "cl_neighborhood": "Centro", "cl_streetnumber": "2", "cl_corporatename": "DG Americas, S. de R. L. de C. V.", "cl_receiptschedule": "10:00 - 17:00"}	2017-12-26 19:23:40.724314+00
14	{"cl_rfc": "DAM121126BT1", "cl_city": 8581816, "cl_name": "Cristina", "cl_type": "legal", "cl_email": "dgamericas@tiendasdg.com", "cl_phone": "6144131182", "cl_state": 4014336, "cl_mobile": "6144131182", "cl_status": "A", "cl_street": "Av. de las Americas", "cl_country": 3996063, "cl_zipcode": "31167", "cl_firstsurname": "X", "cl_neighborhood": "Fidel Velazquez", "cl_streetnumber": "200", "cl_corporatename": "DG Americas, S. de R. L. de C. V.", "cl_receiptschedule": "10:00 - 17:00"}	2017-12-26 19:26:58.756833+00
15	{"cl_rfc": "DES940923PH4", "cl_city": 8581816, "cl_name": "Antonio", "cl_type": "legal", "cl_email": "jcarlos.sistemas@distribuidoraesquer.com.mx", "cl_phone": "6144214966", "cl_state": 4014336, "cl_mobile": "6141970582", "cl_status": "A", "cl_street": "Av. Tecnologico", "cl_country": 3996063, "cl_zipcode": "31114", "cl_suitenumber": "E", "cl_firstsurname": "Olizas", "cl_neighborhood": "Revolucion", "cl_streetnumber": "9900", "cl_corporatename": "Distribuidora Esquer, S. A. de C. V.", "cl_phoneextension": "102", "cl_receiptschedule": "9:00 - 15:00"}	2017-12-26 19:30:52.300411+00
16	{"cl_rfc": "APA8002291D9", "cl_city": 8581816, "cl_name": "Gabriela", "cl_type": "legal", "cl_email": "gabriela_mendoza64@yahoo.com.mx", "cl_phone": "6144151011", "cl_state": 4014336, "cl_mobile": "6144151011", "cl_status": "A", "cl_street": "Ocampo", "cl_country": 3996063, "cl_zipcode": "31000", "cl_firstsurname": "Mendoza", "cl_neighborhood": "Centro", "cl_streetnumber": "1415", "cl_corporatename": "El Almacen Papeleria, S. A de C. V."}	2017-12-26 19:34:23.71722+00
17	{"cl_rfc": "ELE950724JH9", "cl_city": 8581829, "cl_name": "Patricia", "cl_type": "legal", "cl_email": "pramos@elektrisola.com.mx", "cl_phone": "6255819000", "cl_state": 4014336, "cl_mobile": "6255819000", "cl_status": "A", "cl_street": "Periferico Manuel Gomez Morin", "cl_country": 3996063, "cl_zipcode": "31607", "cl_firstsurname": "Ramos", "cl_neighborhood": "Menonita", "cl_streetnumber": "1800", "cl_corporatename": "Elektrisola, S. A de C. V.", "cl_receiptschedule": "8:30 - 12:30 y 13:30 - 15:00"}	2017-12-26 19:49:38.663476+00
18	{"cl_rfc": "BAME9012031G0", "cl_city": 8581838, "cl_name": "Emilio", "cl_type": "natural", "cl_email": "adriau17@msn.com", "cl_phone": "6361361225", "cl_state": 4014336, "cl_mobile": "6361361225", "cl_status": "A", "cl_street": "Revolucion", "cl_country": 3996063, "cl_zipcode": "31700", "cl_firstsurname": "Barrio", "cl_neighborhood": "Centro", "cl_streetnumber": "1903", "cl_secondsurname": "Membrila", "cl_receiptschedule": "9:00 - 15:00"}	2017-12-26 19:58:37.915834+00
19	{"cl_rfc": "EOC750923SZ4", "cl_city": 8581816, "cl_name": "Luis Fernando", "cl_type": "legal", "cl_email": "equiposdeoficina@gmail.com", "cl_phone": "6144109348", "cl_state": 4014336, "cl_mobile": "6144109348", "cl_status": "A", "cl_street": "Av. Venustiano Carranza", "cl_country": 3996063, "cl_zipcode": "31000", "cl_firstsurname": "Martinez", "cl_neighborhood": "Centro", "cl_streetnumber": "1816", "cl_corporatename": "Equipos de Oficina y Comercio, S. A de C. V.", "cl_receiptschedule": "9:00 - 13:00 y 15:00 - 18:00"}	2017-12-26 20:03:02.839142+00
20	{"cl_rfc": "FRC070208M85", "cl_city": 8581816, "cl_name": "Mireya", "cl_type": "legal", "cl_email": "gerencia@flashrecarga.com.mx", "cl_phone": "6144217373", "cl_state": 4014336, "cl_mobile": "6144217373", "cl_status": "A", "cl_street": "Acacias", "cl_country": 3996063, "cl_zipcode": "31160", "cl_firstsurname": "Lechuga", "cl_neighborhood": "Granjas", "cl_streetnumber": "412", "cl_corporatename": "Flash Recarga de Cartuchos, S. de R. L. MI", "cl_receiptschedule": "8:30 - 17:30", "cl_addressreference": "Esquina con Ponciano Arriaga"}	2017-12-26 20:06:54.370708+00
21	{"cl_rfc": "COCF710708TW6", "cl_city": 8581816, "cl_name": "Francisco Javier", "cl_type": "natural", "cl_email": "fcorte@sytecmx.com", "cl_phone": "6142600504", "cl_state": 4014336, "cl_mobile": "6143063360", "cl_status": "A", "cl_street": "Lomita", "cl_country": 3996063, "cl_zipcode": "31205", "cl_firstsurname": "Corte", "cl_neighborhood": "Arquitos", "cl_streetnumber": "1401", "cl_secondsurname": "Chavez", "cl_receiptschedule": "9:00 - 13:00 y 15:00 - 18:00"}	2017-12-26 20:10:44.04943+00
22	{"cl_rfc": "GPR031203C36", "cl_city": 8581816, "cl_name": "Sandra", "cl_type": "legal", "cl_email": "manuel.gonzalez@batesville.com", "cl_phone": "6141581221", "cl_state": 4014336, "cl_mobile": "6141581221", "cl_status": "A", "cl_street": "Nicolas Gogol", "cl_country": 3996063, "cl_zipcode": "31109", "cl_firstsurname": "Flores", "cl_neighborhood": "Complejo Industrial Chihuahua", "cl_streetnumber": "11300", "cl_corporatename": "Global Products Co. S. A de C. V.", "cl_receiptschedule": "9:00 - 11:00 y 13:00 - 15:00"}	2017-12-26 20:17:59.510752+00
23	{"cl_rfc": "SAHH840919FIA", "cl_city": 8581809, "cl_name": "Hector Antonio", "cl_type": "natural", "cl_email": "velia.hdez@hotmail.com", "cl_phone": "6484695437", "cl_state": 4014336, "cl_mobile": "6484695437", "cl_status": "A", "cl_street": "Zafiro", "cl_country": 3996063, "cl_zipcode": "33737", "cl_firstsurname": "Saenz", "cl_neighborhood": "Fracc. Villa Diamante", "cl_streetnumber": "146", "cl_secondsurname": "Hernandez", "cl_receiptschedule": "9:00 - 17:00", "cl_addressreference": "SAFLOSA de Camargo"}	2017-12-26 20:23:13.80106+00
24	{"cl_rfc": "HAM791206MF9", "cl_city": 6942831, "cl_name": "Cynthia", "cl_type": "legal", "cl_email": "cynthia.lara@honeywell.com", "cl_phone": "6144295459", "cl_state": 4017700, "cl_mobile": "6144295459", "cl_status": "A", "cl_street": "Circuito Aerospacial L2", "cl_country": 3996063, "cl_zipcode": "21397", "cl_firstsurname": "Lara", "cl_neighborhood": "Parque Industrial El Vigia", "cl_streetnumber": "SN", "cl_corporatename": "Honeywell Aerospace de Mexico, S. de R. L. de C. V.", "cl_receiptschedule": "9:00 - 13:00"}	2017-12-26 20:27:42.83765+00
25	{"cl_rfc": "IIE12041684A", "cl_city": 8581816, "cl_name": "Daniel", "cl_type": "legal", "cl_email": "ieda@live.com.mx", "cl_phone": "6144996356", "cl_state": 4014336, "cl_mobile": "6144996356", "cl_status": "A", "cl_street": "69", "cl_country": 3996063, "cl_zipcode": "31384", "cl_firstsurname": "Acosta", "cl_neighborhood": "Aeropuerto", "cl_streetnumber": "7202", "cl_corporatename": "IEDA Instalaciones Electricas, S. A de C. V.", "cl_receiptschedule": "9:00 - 13:00"}	2017-12-26 20:38:05.004847+00
26	{"cl_rfc": "MIDI590201JLA", "cl_city": 8581816, "cl_name": "Ignacio", "cl_type": "natural", "cl_email": "j_c_broken@hotmail.com", "cl_phone": "6142076850", "cl_state": 4014336, "cl_mobile": "6141043716", "cl_status": "A", "cl_street": "Ejido Labor de Terrazas", "cl_country": 3996063, "cl_zipcode": "31223", "cl_firstsurname": "Minjarez", "cl_neighborhood": "Labor de Terrazas", "cl_streetnumber": "SN", "cl_secondsurname": "Delgado", "cl_receiptschedule": "7:00 - 15:00"}	2017-12-26 21:13:14.205558+00
27	{"cl_rfc": "IPR120504KK7", "cl_city": 8581816, "cl_name": "Georgina", "cl_type": "legal", "cl_email": "gmiramontes@industrialprosup.com", "cl_phone": "6144143332", "cl_state": 4014336, "cl_mobile": "6141682128", "cl_status": "A", "cl_street": "Av. Francisco Villa", "cl_country": 3996063, "cl_zipcode": "31210", "cl_suitenumber": "10", "cl_firstsurname": "Miramontes", "cl_neighborhood": "Panamericana", "cl_streetnumber": "6501", "cl_corporatename": "Industrial Prosup, S. de R. L. de C. V.", "cl_phoneextension": "1105", "cl_receiptschedule": "9:00 - 15:00"}	2017-12-26 21:30:38.254856+00
28	{"cl_rfc": "ISN051122RW7", "cl_city": 8583647, "cl_name": "Enrique", "cl_type": "legal", "cl_email": "lopez@indsupplymex.com", "cl_phone": "6566256110", "cl_state": 4014336, "cl_mobile": "6562824080", "cl_status": "A", "cl_street": "Av. Lopez Mateos", "cl_country": 3996063, "cl_zipcode": "32310", "cl_suitenumber": "17", "cl_firstsurname": "Lopez", "cl_neighborhood": "Fracc. Cordova Americas", "cl_streetnumber": "1524", "cl_corporatename": "Industrial Supplies del Norte, S. A. de C. V.", "cl_secondsurname": "Rocco", "cl_receiptschedule": "8:00 - 16:00"}	2017-12-26 21:46:42.997501+00
29	{"cl_rfc": "IEM070906H41", "cl_city": 8583647, "cl_name": "Luisa", "cl_type": "legal", "cl_email": "paola.loaiza@ipaper.com", "cl_phone": "6143803900", "cl_state": 4014336, "cl_mobile": "6143803900", "cl_status": "A", "cl_street": "Blvd. Independencia", "cl_country": 3996063, "cl_zipcode": "32575", "cl_firstsurname": "Vazquez", "cl_neighborhood": "Parque Industrial Independencia 1", "cl_streetnumber": "2550", "cl_corporatename": "IP EMPAQUES DE MEXICO, S. de R. L. de C. V."}	2017-12-26 21:50:21.257397+00
30	{"cl_rfc": "HORJ770503HU5", "cl_city": 8581816, "cl_name": "Javier Alonso", "cl_type": "natural", "cl_email": "holguin_javier@hotmail.com", "cl_phone": "6144848531", "cl_state": 4014336, "cl_mobile": "6144848531", "cl_status": "A", "cl_street": "Jose Gutierrez", "cl_country": 3996063, "cl_zipcode": "31125", "cl_firstsurname": "Holguin", "cl_neighborhood": "Deportistas", "cl_streetnumber": "407", "cl_secondsurname": "Rico", "cl_receiptschedule": "8:00 - 16:00"}	2017-12-26 22:00:35.00324+00
31	{"cl_rfc": "CRE080528I37", "cl_city": 8581816, "cl_name": "Alonso", "cl_type": "legal", "cl_email": "huertaslosgavilanes@prodigy.net.mx", "cl_phone": "6144207576", "cl_state": 4014336, "cl_mobile": "6142017429", "cl_status": "A", "cl_street": "Blvd. Juan Pablo II", "cl_country": 3996063, "cl_zipcode": "31384", "cl_suitenumber": "CCEB 10", "cl_firstsurname": "Garcia", "cl_neighborhood": "Central de Abastos", "cl_streetnumber": "4507", "cl_corporatename": "La Cordillera de la Regina, S. A. de C.V.", "cl_receiptschedule": "9:00 - 17:00"}	2017-12-26 22:10:33.32835+00
32	{"cl_rfc": "MAC8407034C8", "cl_city": 8581809, "cl_name": "Ruth", "cl_type": "legal", "cl_email": "sofiaruth1@gmail.com", "cl_phone": "6484620101", "cl_state": 4014336, "cl_mobile": "6484620101", "cl_status": "A", "cl_street": "Centenario", "cl_country": 3996063, "cl_zipcode": "33700", "cl_firstsurname": "Chavez", "cl_neighborhood": "Centro", "cl_streetnumber": "501", "cl_corporatename": "Madereria San Antonio de Camargo, S. A de C. V.", "cl_receiptschedule": "9:00 - 13:00 y 15:00 - 18:00"}	2017-12-26 22:15:50.359695+00
33	{"cl_rfc": "BOMA7307176Q4", "cl_city": 8581816, "cl_name": "Maria", "cl_type": "natural", "cl_email": "mariaborunda@me.com", "cl_phone": "6144216266", "cl_state": 4014336, "cl_mobile": "6142338794", "cl_status": "A", "cl_street": "Del Onyx", "cl_country": 3996063, "cl_zipcode": "31137", "cl_firstsurname": "Borunda", "cl_neighborhood": "Fracc. Villa del Real", "cl_streetnumber": "17339", "cl_receiptschedule": "7:30 - 17:30"}	2017-12-26 22:20:02.738945+00
34	{"cl_rfc": "RALJ6704157TA", "cl_city": 8581816, "cl_name": "Maria de Jesus Gabriela", "cl_type": "natural", "cl_email": "gramirez@ciic.com.mx", "cl_phone": "6144130202", "cl_state": 4014336, "cl_mobile": "6141421145", "cl_status": "A", "cl_street": "Av. Division del Norte", "cl_country": 3996063, "cl_zipcode": "31200", "cl_firstsurname": "Ramirez", "cl_neighborhood": "Altavista", "cl_streetnumber": "3512", "cl_secondsurname": "Lui", "cl_receiptschedule": "8:00 - 16:00"}	2017-12-26 22:23:46.283837+00
35	{"cl_rfc": "BEMM650719TZA", "cl_city": 8581816, "cl_name": "Martha Rebeca", "cl_type": "natural", "cl_email": "rebeca_664@hotmail.com", "cl_phone": "6144155455", "cl_state": 4014336, "cl_mobile": "6141845365", "cl_status": "A", "cl_street": "Priv. Samaniego", "cl_country": 3996063, "cl_zipcode": "31460", "cl_firstsurname": "Becerra", "cl_neighborhood": "Cerro de la Cruz", "cl_streetnumber": "6406", "cl_secondsurname": "Medina", "cl_receiptschedule": "9:00 - 16:00"}	2017-12-26 22:26:30.949222+00
36	{"cl_rfc": "TME050503BM4", "cl_city": 8581816, "cl_name": "Wendy", "cl_type": "legal", "cl_email": "wendy.valenzuela@mgsmfg.com", "cl_phone": "6142004650", "cl_state": 4014336, "cl_mobile": "6142004650", "cl_status": "A", "cl_street": "Juan Ruiz de Alarcon", "cl_country": 3996063, "cl_zipcode": "31136", "cl_firstsurname": "Valenzuela", "cl_neighborhood": "Complejo Industrial Chihuahua", "cl_streetnumber": "345", "cl_corporatename": "MGS Plastics Chihuahua, S. A. de C. V.", "cl_receiptschedule": "9: 00 - 13:00"}	2017-12-26 22:29:31.393598+00
37	{"cl_rfc": "MOL880517HI2", "cl_city": 8581816, "cl_name": "Carlota", "cl_type": "legal", "cl_email": "cristymt71@hotmail.com", "cl_phone": "6144206409", "cl_state": 4014336, "cl_mobile": "6141848539", "cl_status": "A", "cl_street": "Priv. de Industrial 1", "cl_country": 3996063, "cl_zipcode": "31074", "cl_firstsurname": "Prieto", "cl_neighborhood": "Robinson", "cl_streetnumber": "4701", "cl_corporatename": "Moldupino, S. A de C. V.", "cl_receiptschedule": "9:00 - 16:00"}	2017-12-26 22:33:28.036804+00
38	{"cl_rfc": "PPL560525RG4", "cl_city": 8581816, "cl_name": "Cristobal", "cl_type": "legal", "cl_email": "ccamargo@lechezaragoza.com", "cl_phone": "6144186570", "cl_state": 4014336, "cl_mobile": "6144186570", "cl_status": "A", "cl_street": "R Flores Magon", "cl_country": 3996063, "cl_zipcode": "31030", "cl_firstsurname": "Camargo", "cl_neighborhood": "Pacifico", "cl_streetnumber": "4201", "cl_corporatename": "Pasteurizadora de los Productores de Leche, S. A. de C. V.", "cl_receiptschedule": "9:00 - 13:00 y 15:00 - 18:00"}	2017-12-26 22:39:08.939634+00
39	{"cl_rfc": "PIC1405138B9", "cl_city": 8581816, "cl_name": "Antonio", "cl_type": "legal", "cl_email": "tonyheimpel@pick-one.mx", "cl_phone": "6141423244", "cl_state": 4014336, "cl_mobile": "6141423244", "cl_status": "A", "cl_street": "Av. Nicolas Gogol", "cl_country": 3996063, "cl_zipcode": "31136", "cl_firstsurname": "Heimpel", "cl_neighborhood": "Complejo Industrial Chihuahua", "cl_streetnumber": "11342", "cl_corporatename": "Pick-One, S. A. de C. V.", "cl_receiptschedule": "9:00 - 15:00"}	2017-12-26 22:51:32.787925+00
1	{"cl_rfc": "XEXX010101000", "cl_city": 4512214, "cl_name": "Javier", "cl_type": "legal", "cl_email": "Javier.Martinez@cardinalhealth.com", "cl_phone": "0019157759221", "cl_state": 5165418, "cl_county": 7316907, "cl_mobile": "0019159202521", "cl_ssntin": "31-0958666", "cl_status": "A", "cl_street": "Cardinal Place", "cl_country": 6252001, "cl_zipcode": "43017", "cl_firstsurname": "Martinez", "cl_streetnumber": "7000", "cl_corporatename": "Cardinal Health, Inc."}	2017-12-20 19:50:24.048162+00
\.


--
-- Data for Name: ink; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY ink (in_id, in_jsonb, in_date) FROM stdin;
2	{"su_id": 4, "in_code": "2995 Pantone", "in_type": "offset", "in_status": "A", "in_description": "Azul 2995 Pantone"}	2017-12-09 00:04:43.958354+00
3	{"su_id": 4, "in_code": "Process Blue Pantone", "in_type": "offset", "in_status": "A", "in_description": "Azul ProcesoPantone"}	2017-12-09 00:06:33.556072+00
4	{"su_id": 4, "in_code": "254 Pantone", "in_type": "offset", "in_status": "A", "in_description": "Purpura 254 Pantone"}	2017-12-09 00:07:17.902896+00
5	{"su_id": 4, "in_code": "021 Pantone", "in_type": "offset", "in_status": "A", "in_description": "Naranja 021 Pantone"}	2017-12-09 00:10:23.641935+00
7	{"su_id": 5, "in_code": "286 Pantone", "in_type": "flexo", "in_status": "A", "in_description": "286 Azul Pantone"}	2017-12-09 00:11:02.251001+00
8	{"su_id": 4, "in_code": "Reflex Blue Pantone", "in_type": "offset", "in_status": "A", "in_description": "Azul Reflejo Pantone"}	2017-12-09 00:11:04.942788+00
9	{"su_id": 5, "in_code": "Negro", "in_type": "flexo", "in_status": "A", "in_description": "Negro denso"}	2017-12-09 00:12:03.277409+00
10	{"su_id": 4, "in_code": "2925 Pantone", "in_type": "offset", "in_status": "A", "in_description": "Azul 2925 Pantone"}	2017-12-09 00:14:43.881895+00
6	{"su_id": 5, "in_code": "185 PANTONE", "in_type": "flexo", "in_status": "A", "in_description": "Rojo 185 Pantone"}	2017-12-09 00:10:30.854878+00
11	{"su_id": 5, "in_code": "Warm Red Pantone", "in_type": "flexo", "in_status": "A", "in_description": "Rojo Warm Pantone"}	2017-12-19 21:44:53.712586+00
12	{"su_id": 5, "in_code": "Magenta Process Pantone", "in_type": "flexo", "in_status": "A", "in_description": "Magenta Proceso Pantone"}	2017-12-19 23:57:21.179868+00
13	{"su_id": 5, "in_code": "Yellow Process Pantone", "in_type": "flexo", "in_status": "A", "in_description": "Amarillo Proceso Pantone"}	2017-12-19 23:59:43.053263+00
14	{"su_id": 5, "in_code": "Orange 021 Pantone", "in_type": "flexo", "in_status": "A", "in_description": "Naranja 021 Pantone"}	2017-12-20 00:00:59.180856+00
15	{"su_id": 5, "in_code": "306 Pantone", "in_type": "flexo", "in_status": "A", "in_description": "Azul 306 Pantone"}	2017-12-20 17:02:03.539157+00
16	{"su_id": 5, "in_code": "2925 Pantone", "in_type": "flexo", "in_status": "A", "in_description": "Azul 2925 Pantone"}	2017-12-20 17:02:31.56939+00
17	{"su_id": 5, "in_code": "2995 Pantone", "in_type": "flexo", "in_status": "A", "in_description": "Azul 2995 Pantone"}	2017-12-20 17:03:27.282312+00
18	{"su_id": 5, "in_code": "2592 Pantone", "in_type": "flexo", "in_status": "A", "in_description": "Purpura 2592 Pantone"}	2017-12-20 17:05:52.336784+00
19	{"su_id": 5, "in_code": "254 Pantone", "in_type": "flexo", "in_status": "A", "in_description": "Purpura 254 Pantone"}	2017-12-20 17:06:24.908667+00
20	{"su_id": 5, "in_code": "Cool Gray 4", "in_type": "flexo", "in_status": "A", "in_description": "Cool Gray 4C"}	2017-12-20 17:13:28.715487+00
21	{"su_id": 5, "in_code": "Opaque White", "in_type": "flexo", "in_status": "A", "in_description": "Blanco Opaco"}	2017-12-20 17:15:51.60165+00
1	{"su_id": 4, "in_code": "Negro", "in_type": "offset", "in_status": "A", "in_description": "Negro Concentrado"}	2017-12-09 00:01:37.36636+00
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
12	{"ma_name": "Trotec Speedy 100", "ma_status": "A", "ma_printbg": "no", "ma_process": "laser", "ma_fullcolor": "no", "ma_totalinks": "1", "ma_sizemeasure": "cm", "ma_maxsizewidth": "60.00", "ma_minsizewidth": "1.00", "ma_maxsizeheight": "30.00", "ma_minsizeheight": "1.00"}	2017-12-27 19:24:53.114466+00
\.


--
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY material (mt_id, mt_jsonb, mt_date) FROM stdin;
1	{"su_id": 2, "mt_code": "M-002-00001", "mt_type": 1, "mt_width": "43.00", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.0092", "mt_measure": "cm", "mt_thickness": "0.10", "mt_description": "Papel HP Doble Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-09 01:01:35.937097+00
21	{"su_id": 2, "mt_code": "M-002-00021", "mt_type": 1, "mt_width": "57.00", "mt_height": "87.00", "mt_status": "A", "mt_weight": "0.038", "mt_measure": "cm", "mt_thickness": "0.09", "mt_description": "Papel Bond Bco Offset-EB 57x87cm 75g", "mt_thicknessmeasure": "mm"}	2017-12-27 16:57:16.339677+00
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
22	{"su_id": 2, "mt_code": "M-002-00022", "mt_type": 1, "mt_width": "57.00", "mt_height": "87.00", "mt_status": "A", "mt_weight": "0.046", "mt_measure": "cm", "mt_thickness": "0.11", "mt_description": "Papel Bond Bco Offset-EB 57x87cm 90g", "mt_thicknessmeasure": "mm"}	2017-12-27 17:02:43.976963+00
23	{"su_id": 2, "mt_code": "M-002-00023", "mt_type": 1, "mt_width": "61.00", "mt_height": "90.00", "mt_status": "A", "mt_weight": "0.052", "mt_measure": "cm", "mt_thickness": "0.11", "mt_description": "Papel Bond Bco Offset-EB 61x90cm 90g", "mt_thicknessmeasure": "cm"}	2017-12-27 17:04:27.798963+00
24	{"su_id": 2, "mt_code": "M-002-00024", "mt_type": 1, "mt_width": "70.00", "mt_height": "95.00", "mt_status": "A", "mt_weight": "0.058", "mt_measure": "cm", "mt_thickness": "0.11", "mt_description": "Papel Bond Bco Offset-EB 70x95cm 75g", "mt_thicknessmeasure": "cm"}	2017-12-27 17:05:23.932465+00
25	{"su_id": 2, "mt_code": "M-002-00025", "mt_type": 1, "mt_width": "57.00", "mt_height": "87.00", "mt_status": "A", "mt_weight": "0.038", "mt_measure": "cm", "mt_thickness": "0.09", "mt_description": "Papel Bond Colores 57x87cm 75g Azul", "mt_thicknessmeasure": "mm"}	2017-12-27 17:07:32.178455+00
26	{"su_id": 2, "mt_code": "M-002-00026", "mt_type": 5, "mt_width": "71.00", "mt_height": "125.00", "mt_status": "A", "mt_weight": "0.192", "mt_measure": "cm", "mt_thickness": "0.30", "mt_description": "Cartulina recubierta 1C Sulfatado SBS Nordic 12pts 71x125cm 215g Bco", "mt_thicknessmeasure": "mm"}	2017-12-27 17:11:57.674744+00
27	{"su_id": 2, "mt_code": "M-002-00027", "mt_type": 5, "mt_width": "90.00", "mt_height": "125.00", "mt_status": "A", "mt_weight": "0.244", "mt_measure": "cm", "mt_thickness": "0.32", "mt_description": "Cartulina recubierta 1C Sulfatado SBS Nordic 12pts 90x125cm 215g Bco", "mt_thicknessmeasure": "mm"}	2017-12-27 17:17:34.711887+00
28	{"su_id": 2, "mt_code": "M-002-00028", "mt_type": 5, "mt_width": "90.00", "mt_height": "125.00", "mt_status": "A", "mt_weight": "0.268", "mt_measure": "cm", "mt_thickness": "0.35", "mt_description": "Cartulina recubierta 1C Sulfatado SBS Nordic 14pts 90x125cm 235g Bco", "mt_thicknessmeasure": "mm"}	2017-12-27 17:20:34.56114+00
29	{"su_id": 8, "mt_code": "M-008-00029", "mt_type": 14, "mt_width": "11.00", "mt_height": "7400.00", "mt_status": "A", "mt_weight": "0.084", "mt_measure": "cm", "mt_thickness": "0.02", "mt_description": "Ribbon 110 x 74 Resina AXR7", "mt_thicknessmeasure": "mm"}	2017-12-27 17:42:35.9159+00
30	{"su_id": 2, "mt_code": "M-002-00030", "mt_type": 5, "mt_width": "90.00", "mt_height": "125.00", "mt_status": "A", "mt_weight": "0.306", "mt_measure": "cm", "mt_thickness": "0.40", "mt_description": "Cartulina recubierta 1C Sulfatado SBS Nordic 16pts 90x125cm 270g Bco", "mt_thicknessmeasure": "mm"}	2017-12-27 17:48:41.926687+00
31	{"su_id": 2, "mt_code": "M-002-00031", "mt_type": 5, "mt_width": "50.00", "mt_height": "66.00", "mt_status": "A", "mt_weight": "0.058", "mt_measure": "cm", "mt_thickness": "0.23", "mt_description": "Cartulina recubierta 2C Colores Astrobright 50x66cm 175g Amarillo Fluorescente", "mt_thicknessmeasure": "cm"}	2017-12-27 18:27:49.037409+00
32	{"su_id": 2, "mt_code": "M-002-00032", "mt_type": 5, "mt_width": "50.00", "mt_height": "65.00", "mt_status": "A", "mt_weight": "0.054", "mt_measure": "cm", "mt_thickness": "0.21", "mt_description": "Cartulina recubierta 2C Colores Iris Cover 50x65cm 180g Gris Perla", "mt_thicknessmeasure": "cm"}	2017-12-27 18:30:30.172196+00
33	{"su_id": 2, "mt_code": "M-002-00033", "mt_type": 4, "mt_width": "50.00", "mt_height": "65.00", "mt_status": "A", "mt_weight": "0.044", "mt_measure": "cm", "mt_thickness": "0.20", "mt_description": "Cartulina Bristol Bco Uni-Bristolina 50x65cm 180g", "mt_thicknessmeasure": "cm"}	2017-12-27 18:35:34.898394+00
34	{"su_id": 8, "mt_code": "M-008-00034", "mt_type": 14, "mt_width": "4.00", "mt_height": "30000.00", "mt_status": "A", "mt_weight": "0.118", "mt_measure": "cm", "mt_thickness": "0.02", "mt_description": "Ribbon 40 x 300 Resina AXR7", "mt_thicknessmeasure": "mm"}	2017-12-27 18:37:17.467844+00
35	{"su_id": 2, "mt_code": "M-002-00035", "mt_type": 4, "mt_width": "50.00", "mt_height": "65.00", "mt_status": "A", "mt_weight": "0.066", "mt_measure": "cm", "mt_thickness": "0.23", "mt_description": "Cartulina Bristol Bco Uni-Bristolina 50x65cm 200g", "mt_thicknessmeasure": "mm"}	2017-12-27 18:38:27.57524+00
36	{"su_id": 2, "mt_code": "M-002-00036", "mt_type": 4, "mt_width": "50.00", "mt_height": "65.00", "mt_status": "A", "mt_weight": "0.078", "mt_measure": "cm", "mt_thickness": "0.28", "mt_description": "Cartulina Bristol Bco Uni-Bristolina 50x65cm 240g", "mt_thicknessmeasure": "mm"}	2017-12-27 18:40:49.884291+00
37	{"su_id": 8, "mt_code": "M-008-00037", "mt_type": 14, "mt_width": "11.00", "mt_height": "45000.00", "mt_status": "A", "mt_weight": "0.448", "mt_measure": "cm", "mt_thickness": "0.02", "mt_description": "Ribbon 110 x 450 Resina AXR1", "mt_thicknessmeasure": "mm"}	2017-12-27 18:42:50.553097+00
38	{"su_id": 2, "mt_code": "M-002-00038", "mt_type": 4, "mt_width": "50.00", "mt_height": "70.00", "mt_status": "A", "mt_weight": "0.052", "mt_measure": "cm", "mt_thickness": "0.23", "mt_description": "Cartulina Colores Arco Iris 50x70cm Azul", "mt_thicknessmeasure": "cm"}	2017-12-27 18:43:04.302734+00
39	{"su_id": 8, "mt_code": "M-008-00039", "mt_type": 14, "mt_width": "11.00", "mt_height": "45000.00", "mt_status": "A", "mt_weight": "0.450", "mt_measure": "cm", "mt_thickness": "0.02", "mt_description": "Ribbon 110 x 450 Cera AWR1", "mt_thicknessmeasure": "mm"}	2017-12-27 18:44:11.276057+00
40	{"su_id": 8, "mt_code": "M-008-00040", "mt_type": 14, "mt_width": "9.00", "mt_height": "45000.00", "mt_status": "A", "mt_weight": "0.400", "mt_measure": "cm", "mt_thickness": "0.02", "mt_description": "Ribbon 90 x 450 Cera GWR Outside", "mt_thicknessmeasure": "mm"}	2017-12-27 19:13:33.64308+00
41	{"su_id": 8, "mt_code": "M-008-00041", "mt_type": 14, "mt_width": "0.60", "mt_height": "450000.00", "mt_status": "A", "mt_weight": "0.276", "mt_measure": "cm", "mt_thickness": "0.02", "mt_description": "Ribbon 60 x 450 Cera GWR Outside", "mt_thicknessmeasure": "mm"}	2017-12-27 19:18:45.976956+00
42	{"su_id": 2, "mt_code": "M-002-00042", "mt_type": 4, "mt_width": "61.00", "mt_height": "95.00", "mt_status": "A", "mt_weight": "0.120", "mt_measure": "cm", "mt_thickness": "0.23", "mt_description": "Cartulina Manila Folder Unibristol 61x95cm 200g", "mt_thicknessmeasure": "mm"}	2017-12-27 19:19:46.107591+00
43	{"su_id": 8, "mt_code": "M-008-00043", "mt_type": 14, "mt_width": "16.50", "mt_height": "45000.00", "mt_status": "A", "mt_weight": "0.758", "mt_measure": "cm", "mt_thickness": "0.02", "mt_description": "Ribbon 165 x 450 Cera GWR Outside", "mt_thicknessmeasure": "mm"}	2017-12-27 19:20:47.016436+00
44	{"su_id": 2, "mt_code": "M-002-00044", "mt_type": 4, "mt_width": "70.00", "mt_height": "95.00", "mt_status": "A", "mt_weight": "0.160", "mt_measure": "cm", "mt_thickness": "0.28", "mt_description": "Cartulina Manila Folder Unibristol 70x95cm 240g", "mt_thicknessmeasure": "mm"}	2017-12-27 19:22:53.514343+00
45	{"su_id": 2, "mt_code": "M-002-00045", "mt_type": 4, "mt_width": "57.00", "mt_height": "87.00", "mt_status": "A", "mt_weight": "0.094", "mt_measure": "cm", "mt_thickness": "0.40", "mt_description": "Cartulina Mina Gris 57x87cm 200g", "mt_thicknessmeasure": "mm"}	2017-12-27 19:43:35.881756+00
46	{"su_id": 3, "mt_code": "M-003-00046", "mt_type": 1, "mt_width": "21.50", "mt_height": "28.00", "mt_status": "A", "mt_weight": "0.0046", "mt_measure": "cm", "mt_thickness": "0.09", "mt_description": "Papel HP Carta 75 g", "mt_thicknessmeasure": "mm"}	2017-12-27 19:45:10.744902+00
47	{"su_id": 2, "mt_code": "M-002-00047", "mt_type": 4, "mt_width": "52.00", "mt_height": "72.00", "mt_status": "A", "mt_weight": "0.094", "mt_measure": "cm", "mt_thickness": "0.26", "mt_description": "Cartulina Opalina Marfil Guarro 57x72cm 225g", "mt_thicknessmeasure": "mm"}	2017-12-27 19:45:44.521358+00
48	{"su_id": 2, "mt_code": "M-002-00048", "mt_type": 5, "mt_width": "61.00", "mt_height": "90.00", "mt_status": "A", "mt_weight": "0.070", "mt_measure": "cm", "mt_thickness": "0.09", "mt_description": "Papel Couche 2 Brillante Galerie 61x90cm 130g", "mt_thicknessmeasure": "mm"}	2017-12-27 20:20:41.350492+00
49	{"su_id": 3, "mt_code": "M-003-00049", "mt_type": 11, "mt_width": "66.00", "mt_height": "51.00", "mt_status": "A", "mt_weight": "0.060", "mt_measure": "cm", "mt_thickness": "0.16", "mt_description": "Adhesivo Raflatac Bco Brillante Con Suaje 66 x 51 cm", "mt_thicknessmeasure": "mil"}	2017-12-27 20:23:04.27633+00
50	{"su_id": 3, "mt_code": "M-003-00050", "mt_type": 11, "mt_width": "66.00", "mt_height": "51.00", "mt_status": "A", "mt_weight": "0.060", "mt_measure": "cm", "mt_thickness": "0.16", "mt_description": "Adhesivo Raflatac Bco Brillante Sin Suaje 66 x 51 cm", "mt_thicknessmeasure": "mm"}	2017-12-27 20:26:59.074905+00
51	{"su_id": 2, "mt_code": "M-002-00051", "mt_type": 5, "mt_width": "61.00", "mt_height": "90.00", "mt_status": "A", "mt_weight": "0.108", "mt_measure": "cm", "mt_thickness": "0.15", "mt_description": "Cartulina Couche 2C Brillante Galerie 61x90cm 200g", "mt_thicknessmeasure": "mm"}	2017-12-27 20:30:42.334783+00
52	{"su_id": 2, "mt_code": "M-002-00052", "mt_type": 3, "mt_width": "72.00", "mt_height": "95.00", "mt_status": "A", "mt_weight": "0.072", "mt_measure": "cm", "mt_thickness": "0.08", "mt_description": "Papel Couche 2C Brillante Galerie 72x95cm 115g", "mt_thicknessmeasure": "mm"}	2017-12-27 20:32:22.940211+00
53	{"su_id": 3, "mt_code": "M-003-00053", "mt_type": 11, "mt_width": "66.00", "mt_height": "51.00", "mt_status": "A", "mt_weight": "0.060", "mt_measure": "cm", "mt_thickness": "0.16", "mt_description": "Adhesivo Raflatac Bco Mate Con Suaje 66 x 51 cm", "mt_thicknessmeasure": "mm"}	2017-12-27 20:39:15.433166+00
54	{"su_id": 3, "mt_code": "M-003-00054", "mt_type": 11, "mt_width": "66.00", "mt_height": "51.00", "mt_status": "A", "mt_weight": "0.060", "mt_measure": "cm", "mt_thickness": "0.16", "mt_description": "Adhesivo Raflatac Bco Mate Sin Suaje 66 x 51 cm", "mt_thicknessmeasure": "mm"}	2017-12-27 20:40:35.203835+00
55	{"su_id": 2, "mt_code": "M-002-00055", "mt_type": 3, "mt_width": "72.00", "mt_height": "95.00", "mt_status": "A", "mt_weight": "0.080", "mt_measure": "cm", "mt_thickness": "0.09", "mt_description": "Papel Couche 2C Brillante 72x95cm 130g", "mt_thicknessmeasure": "mm"}	2017-12-27 20:43:13.220638+00
56	{"su_id": 2, "mt_code": "M-002-00056", "mt_type": 5, "mt_width": "72.00", "mt_height": "95.00", "mt_status": "A", "mt_weight": "0.170", "mt_measure": "cm", "mt_thickness": "0.18", "mt_description": "Cartulina Couche 2C Brillante 72x95cm 250g", "mt_thicknessmeasure": "mm"}	2017-12-27 20:44:29.058492+00
57	{"su_id": 2, "mt_code": "M-002-00057", "mt_type": 5, "mt_width": "71.00", "mt_height": "125.00", "mt_status": "A", "mt_weight": "0.262", "mt_measure": "cm", "mt_thickness": "0.35", "mt_description": "Cartulina recubierta 2C Brillante Nordic Plus 14pts 71x125cm 300g", "mt_thicknessmeasure": "mm"}	2017-12-27 20:52:25.696762+00
58	{"su_id": 2, "mt_code": "M-002-00058", "mt_type": 5, "mt_width": "90.00", "mt_height": "125.00", "mt_status": "A", "mt_weight": "0.330", "mt_measure": "cm", "mt_thickness": "0.35", "mt_description": "Cartulina recubierta 2C Brillante Nordic Plus 14pts 90x125cm 300g", "mt_thicknessmeasure": "mm"}	2017-12-27 20:53:46.391437+00
59	{"su_id": 2, "mt_code": "M-002-00059", "mt_type": 5, "mt_width": "90.00", "mt_height": "125.00", "mt_status": "A", "mt_weight": "0.386", "mt_measure": "cm", "mt_thickness": "0.40", "mt_description": "Cartulina Recubierta 2C Brillante Nordic Plus 16pts 90x125cm 350g", "mt_thicknessmeasure": "cm"}	2017-12-27 21:06:15.03602+00
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
1	{"cl_id": 1, "mt_id": 19, "tc_id": 4, "pr_code": "P-0001-0000001-flexo-labels", "pr_core": 3, "pr_name": "14594", "pr_type": "labels", "pr_folio": "no", "pr_partno": "14594", "pr_precut": "horizontal", "pr_status": "A", "pr_inkback": 0, "pr_process": "flexo", "pr_varnish": "no", "pr_inkfront": 1, "pr_laminate": "no", "pr_language": "distintos al español", "pr_inksfront": {"0": 16}, "pr_description": "ETIQUETA ADHESIVA IMPRESA 3 X 2 PULGADAS", "pr_finalsizewidth": "3.00", "pr_finalsizeheight": "2.00", "pr_finalsizemeasure": "in", "pr_materialformatsqty": "1"}	2017-12-20 22:58:43.508128+00
2	{"cl_id": 1, "mt_id": 1, "tc_id": 4, "pr_code": "P-0001-0000002-offset-general", "pr_cord": "no", "pr_name": "R29013-62", "pr_type": "general", "pr_wire": "no", "pr_drill": 0, "pr_folio": "no", "pr_blocks": "no", "pr_partno": "R29013-62", "pr_precut": "no", "pr_status": "A", "pr_inkback": 0, "pr_process": "offset", "pr_varnish": "no", "pr_inkfront": 1, "pr_laminate": "no", "pr_language": "distintos al español", "pr_foldunit1": 0, "pr_foldunit2": 0, "pr_foldunit3": 0, "pr_inksfront": {"0": 4}, "pr_description": "ETIQUETA IMPRESA 21.50 X 28.00 CM", "pr_diecuttingqty": "0", "pr_reinforcement": "no", "pr_finalsizewidth": "21.50", "pr_finalsizeheight": "28.00", "pr_finalsizemeasure": "cm", "pr_materialsizewidth": "43.00", "pr_materialformatsqty": "2", "pr_materialsizeheight": "28.00", "pr_materialsizemeasure": "cm"}	2017-12-20 23:20:17.952142+00
\.


--
-- Data for Name: supplier; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY supplier (su_id, su_jsonb, su_date) FROM stdin;
7	{"su_rfc": "CIN000414QF1", "su_city": 8581816, "su_name": "David", "su_type": "legal", "su_email": "david.gonzalez@celupal.com", "su_phone": "6144170071", "su_state": 4014336, "su_mobile": "6141248144", "su_status": "A", "su_street": "Av. Industrias", "su_country": 3996063, "su_zipcode": "31104", "su_suitenumber": "13", "su_firstsurname": "Gonzalez", "su_neighborhood": "Nombre de Dios", "su_streetnumber": "6501", "su_corporatename": "Celupal Internacional, S. de R.L. de C.V.", "su_phoneextension": "104", "su_addressreference": "Suc. Chihuahua"}	2017-12-26 16:14:24.172448+00
8	{"su_rfc": "GTM0404025C5", "su_city": 8582219, "su_name": "Jaime", "su_type": "legal", "su_email": "info@gem.com", "su_phone": "3337777448", "su_state": 4004156, "su_mobile": "3337777448", "su_status": "A", "su_street": "Calzada Norte", "su_country": 3996063, "su_zipcode": "45010", "su_suitenumber": "C", "su_firstsurname": "Germes", "su_neighborhood": "Ciudad Granja", "su_streetnumber": "189", "su_corporatename": "GEM Tecnologia de Mexico, S.A. de C.V."}	2017-12-27 16:54:46.213262+00
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
1	{"cl_id": 1, "ma_id": 2, "pr_id": 1, "wo_po": "123COMPRA", "zo_id": 3, "wo_qty": "100", "wo_line": "1", "wo_type": "N", "wo_email": "no", "wo_notes": "TEST", "wo_price": "9.99", "wo_boxqty": "100", "wo_status": 0, "wo_release": "123RELEASE", "wo_currency": "MXN", "wo_attention": "MARCO", "wo_createdby": "alejandrolsca", "wo_linetotal": "1", "wo_orderedby": "CASPER", "wo_packageqty": "10", "wo_materialqty": "100.00", "wo_commitmentdate": "2018-01-06"}	2017-12-22 03:14:14.177774+00
\.


--
-- Data for Name: zone; Type: TABLE DATA; Schema: public; Owner: Alejandro
--

COPY zone (zo_id, zo_jsonb, zo_date) FROM stdin;
3	{"cl_id": 1, "zo_rfc": "CDE890310KA0", "zo_city": 8581818, "zo_name": "Ramon", "zo_type": "legal", "zo_zone": "Delicias", "zo_email": "Ramon.Villa@cardinalhealth.com", "zo_immex": "2647-2006", "zo_phone": "016390000000", "zo_state": 4014336, "zo_mobile": "016390000000", "zo_status": "A", "zo_street": "Libramiento Carr. Panamericana", "zo_country": 3996063, "zo_zipcode": "33018", "zo_firstsurname": "Villa", "zo_neighborhood": "Parque Industrial Las Virgenes", "zo_streetnumber": "SN", "zo_corporatename": "Cirpro de Delicias, S. A. de C. V.", "zo_addressreference": "NA"}	2017-12-20 22:20:13.75527+00
4	{"cl_id": 2, "zo_rfc": "IUN941111CQ3", "zo_city": 8582427, "zo_name": "Gilda", "zo_type": "legal", "zo_zone": "SRL Parque Industrial Las Americas", "zo_email": "gilda.zambrano@standardregister.com", "zo_immex": "299-2015", "zo_phone": "8111569000", "zo_state": 3522542, "zo_mobile": "8111569000", "zo_status": "A", "zo_street": "Carretera a Huinala Km. 2.8", "zo_country": 3996063, "zo_zipcode": "66645", "zo_suitenumber": "A", "zo_firstsurname": "Zambrano", "zo_neighborhood": "Parque Industrial Las Americas", "zo_streetnumber": "404", "zo_corporatename": "Standard Register Latinoamerica, S. de R. L. de C. V.", "zo_secondsurname": "Melin", "zo_phoneextension": "9005", "zo_receiptschedule": "8:00 - 17:00", "zo_addressreference": "Parque Ind. Las Americas"}	2017-12-26 16:07:01.399918+00
5	{"cl_id": 2, "zo_rfc": "IUN941111CQ3", "zo_city": 8583647, "zo_name": "Cristian", "zo_type": "legal", "zo_zone": "SRL Juarez Bodega Impulse", "zo_email": "cristian.cantu@standardregister.com", "zo_immex": "299-2015", "zo_phone": "8111569000", "zo_state": 4014336, "zo_mobile": "8111569000", "zo_status": "A", "zo_street": "Av. Santiago Troncoso", "zo_country": 3996063, "zo_zipcode": "32599", "zo_suitenumber": "Suit A y B", "zo_firstsurname": "Cantu", "zo_neighborhood": "Complejo Cielo", "zo_streetnumber": "931", "zo_corporatename": "Standard Register Latinoamerica, S. de R. L de C. V.", "zo_receiptschedule": "8:00 - 17:00", "zo_addressreference": "Bodega Impulse"}	2017-12-26 16:12:36.767911+00
1	{"cl_id": 1, "zo_rfc": "QCU9002028A5", "zo_city": 8581829, "zo_name": "Raul", "zo_type": "legal", "zo_zone": "Cuauhtemoc Planta 1", "zo_email": "Raul.Villanueva@cardinalhealth.com", "zo_immex": "3301-2006", "zo_phone": "016560000000", "zo_state": 4014336, "zo_mobile": "016560000000", "zo_status": "A", "zo_street": "Av. Rio Santa Clara", "zo_country": 3996063, "zo_zipcode": "31543", "zo_firstsurname": "Villanueva", "zo_neighborhood": "Parque Industrial Cuauhtemoc", "zo_streetnumber": "Lotes 12 y 13", "zo_corporatename": "Quiroproductos de Cuauhtemoc, S. de R. L. de C. V", "zo_addressreference": "NA"}	2017-12-20 21:22:16.385854+00
6	{"cl_id": 2, "zo_rfc": "IUN941111CQ3", "zo_city": 8582427, "zo_name": "Critian", "zo_type": "legal", "zo_zone": "SRL Parque Industrial Prologis", "zo_email": "cristian.cantu@standardregister.com", "zo_immex": "299-2015", "zo_phone": "8111569000", "zo_state": 3522542, "zo_mobile": "8111569000", "zo_status": "A", "zo_street": "Septima", "zo_country": 3996063, "zo_zipcode": "66603", "zo_suitenumber": "Mic 9", "zo_firstsurname": "Cantu", "zo_neighborhood": "Parque Industrial Prologis", "zo_streetnumber": "300", "zo_corporatename": "Standard Register Latinoamerica, S. de R. L. de C. V.", "zo_receiptschedule": "8:00 - 17:00", "zo_addressreference": "Parque Ind. Prologis"}	2017-12-26 16:20:21.420918+00
8	{"cl_id": 3, "zo_rfc": "IUN941111CQ3", "zo_city": 8582427, "zo_name": "Cristian", "zo_type": "legal", "zo_zone": "SRL Parque Industrial Prologis", "zo_email": "cristian.cantu@standardregister.com", "zo_phone": "8111569000", "zo_state": 3522542, "zo_mobile": "8111569000", "zo_status": "A", "zo_street": "Septima", "zo_country": 3996063, "zo_zipcode": "66603", "zo_suitenumber": "Mic 9", "zo_firstsurname": "Cantu", "zo_neighborhood": "Parque Industrial Prologis", "zo_streetnumber": "300", "zo_corporatename": "Standard Register Latinoamerica, S. de R. L. de C. V.", "zo_receiptschedule": "8:00 - 17:00", "zo_addressreference": "Parque Ind. Prologis"}	2017-12-26 16:45:36.034541+00
7	{"cl_id": 3, "zo_rfc": "IUN941111CQ3", "zo_city": 8582427, "zo_name": "Cristian", "zo_type": "legal", "zo_zone": "SRL Juarez Bodega Impulse", "zo_email": "cristian.cantu@standardregister.com", "zo_phone": "8111569000", "zo_state": 3522542, "zo_mobile": "8111569000", "zo_status": "A", "zo_street": "Av. Santiago Troncoso", "zo_country": 3996063, "zo_zipcode": "32599", "zo_suitenumber": "Suite A y B", "zo_firstsurname": "Cantu", "zo_neighborhood": "Complejo Cielo", "zo_streetnumber": "931", "zo_corporatename": "Standard Register Latinoamerica, S. de R. L. de C. V.", "zo_receiptschedule": "8:00 - 17:00", "zo_addressreference": "Bodega Impulse"}	2017-12-26 16:42:53.548909+00
2	{"cl_id": 1, "zo_rfc": "QCU9002028A5", "zo_city": 8581829, "zo_name": "Raul", "zo_type": "legal", "zo_zone": "Cuauhtemoc Planta 2", "zo_email": "Raul.Villanueva@cardinalhealth.com", "zo_immex": "3301-2006", "zo_phone": "016560000000", "zo_state": 4014336, "zo_mobile": "016560000000", "zo_status": "A", "zo_street": "Av. Rio Chuviscar", "zo_country": 3996063, "zo_zipcode": "31543", "zo_firstsurname": "Villanueva", "zo_neighborhood": "Parque Industrial Cuauhtemoc", "zo_streetnumber": "8950", "zo_corporatename": "Quiroproductos de Cuauhtemoc, S. de R. L. de C. V.", "zo_addressreference": "NA"}	2017-12-20 21:28:59.287441+00
9	{"cl_id": 4, "zo_rfc": "GAI020902FG4", "zo_city": 8581816, "zo_name": "Enrique", "zo_type": "legal", "zo_zone": "Xylem Flow Control LLC", "zo_email": "Enrique.Zavala@Xyleminc.com", "zo_immex": "1005-2006", "zo_phone": "6142142050", "zo_state": 4014336, "zo_mobile": "6142142050", "zo_status": "A", "zo_street": "Av. Washington", "zo_country": 3996063, "zo_zipcode": "31200", "zo_suitenumber": "Edificio 8", "zo_firstsurname": "Zavala", "zo_neighborhood": "Parque Industrial Las Americas", "zo_streetnumber": "3701", "zo_corporatename": "Grupo American Industries, S. A. de C. V.", "zo_phoneextension": "2142141", "zo_receiptschedule": "7:00 - 14:00", "zo_addressreference": "Xylem"}	2017-12-26 16:59:33.806241+00
10	{"cl_id": 24, "zo_rfc": "HAM791206MF9", "zo_city": 8581816, "zo_name": "Cynthia", "zo_type": "legal", "zo_zone": "Honeywell Aerospace Chihuahua", "zo_email": "cynthia.lara@honeywell.com", "zo_phone": "6144295459", "zo_state": 4014336, "zo_mobile": "6144295459", "zo_status": "A", "zo_street": "Vialidad Tabalaopa", "zo_country": 3996063, "zo_zipcode": "31074", "zo_firstsurname": "Lara", "zo_neighborhood": "Parque Industrial Avalos", "zo_streetnumber": "8507", "zo_corporatename": "Honeywell Aerospace de Mexico, S. de R. L. de C. V.", "zo_receiptschedule": "9:00 - 13:00", "zo_addressreference": "Planta Chihuahua"}	2017-12-26 20:35:29.64415+00
11	{"cl_id": 29, "zo_rfc": "IEM070906H41", "zo_city": 8581816, "zo_name": "Paola", "zo_type": "legal", "zo_zone": "International Paper", "zo_email": "paola.loaiza@ipaper.com", "zo_phone": "6143803900", "zo_state": 4014336, "zo_mobile": "6143803900", "zo_status": "A", "zo_street": "Rudyard Kipling", "zo_country": 3996063, "zo_zipcode": "31136", "zo_firstsurname": "Loaiza", "zo_neighborhood": "Complejo Industrial Chihuahua", "zo_streetnumber": "11319", "zo_corporatename": "IP Empaques de Mexico, S. de R. L. de C. V.", "zo_receiptschedule": "8:00 - 15:00", "zo_addressreference": "International Paper"}	2017-12-26 21:56:36.806011+00
\.


--
-- Name: seq_client_cl_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_client_cl_id', 39, true);


--
-- Name: seq_ink_in_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_ink_in_id', 21, true);


--
-- Name: seq_machine_ma_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_machine_ma_id', 12, true);


--
-- Name: seq_material_mt_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_material_mt_id', 59, true);


--
-- Name: seq_materialtype_maty_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_materialtype_maty_id', 30, true);


--
-- Name: seq_product_pr_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_product_pr_id', 2, true);


--
-- Name: seq_supplier_su_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_supplier_su_id', 8, true);


--
-- Name: seq_tariffcode_tc_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_tariffcode_tc_id', 7, true);


--
-- Name: seq_wo_wo_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_wo_wo_id', 1, true);


--
-- Name: seq_zone_zo_id; Type: SEQUENCE SET; Schema: public; Owner: Alejandro
--

SELECT pg_catalog.setval('seq_zone_zo_id', 11, true);


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
-- Name: wo wo_after_update; Type: TRIGGER; Schema: public; Owner: Alejandro
--

CREATE TRIGGER wo_after_update AFTER UPDATE ON wo FOR EACH ROW WHEN ((pg_trigger_depth() = 0)) EXECUTE PROCEDURE wo_after_update();


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO "Alejandro";


--
-- PostgreSQL database dump complete
--

