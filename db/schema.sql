--
-- PostgreSQL database dump
--

\restrict hntByrzVYTyYyeD6phayWoaJ8XnGhvh06JWeWkczNmyZbpTAIM3ZzbM0nADBzTg

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_modified_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_modified_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_functions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_functions (
    id integer NOT NULL,
    function_code character varying(10) NOT NULL,
    function_name character varying(100) NOT NULL,
    function_url character varying(1000) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(100)
);


ALTER TABLE public.app_functions OWNER TO postgres;

--
-- Name: app_functions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.app_functions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.app_functions_id_seq OWNER TO postgres;

--
-- Name: app_functions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.app_functions_id_seq OWNED BY public.app_functions.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    country_code character varying(10) NOT NULL,
    country_name character varying(100) NOT NULL,
    capital_city character varying(100),
    latitude numeric(9,6),
    longitude numeric(9,6),
    last_modified_by character varying(100),
    updated_at timestamp with time zone DEFAULT now(),
    continent character varying(50)
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.countries_id_seq OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.members (
    id integer NOT NULL,
    member_code character varying(20) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    email character varying(100),
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by text
);


ALTER TABLE public.members OWNER TO postgres;

--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.members_id_seq OWNER TO postgres;

--
-- Name: members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.members_id_seq OWNED BY public.members.id;


--
-- Name: menu_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_group (
    id integer NOT NULL,
    menu_code character varying(10) NOT NULL,
    menu_name character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(100)
);


ALTER TABLE public.menu_group OWNER TO postgres;

--
-- Name: menu_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menu_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_group_id_seq OWNER TO postgres;

--
-- Name: menu_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menu_group_id_seq OWNED BY public.menu_group.id;


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    menu_group_id integer NOT NULL,
    menu_item_seq integer NOT NULL,
    menu_item_name character varying(100),
    sub_menu_group_id integer,
    app_function_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(100)
);


ALTER TABLE public.menu_items OWNER TO postgres;

--
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_items_id_seq OWNER TO postgres;

--
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'USER'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email character varying(255),
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    last_login timestamp with time zone,
    menu_group_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: app_functions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_functions ALTER COLUMN id SET DEFAULT nextval('public.app_functions_id_seq'::regclass);


--
-- Name: members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);


--
-- Name: menu_group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_group ALTER COLUMN id SET DEFAULT nextval('public.menu_group_id_seq'::regclass);


--
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: app_functions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.app_functions (id, function_code, function_name, function_url, created_at, updated_at, last_modified_by) FROM stdin;
7	F001	Member List	/members	2026-03-31 13:26:30.679748+09	2026-03-31 13:26:30.679748+09	admin
8	F002	Country List	/countries	2026-03-31 13:26:30.679748+09	2026-03-31 13:26:30.679748+09	admin
9	F003	Company List	/companies	2026-03-31 13:26:30.679748+09	2026-03-31 13:26:30.679748+09	admin
10	F011	To-do List	/todo	2026-03-31 13:26:30.679748+09	2026-03-31 13:26:30.679748+09	admin
11	F012	Submit Job	/submit_jobs	2026-03-31 13:26:30.679748+09	2026-03-31 13:26:30.679748+09	admin
12	F021	User List	/users	2026-03-31 13:26:30.679748+09	2026-03-31 13:26:30.679748+09	admin
13	F022	Menu List	/menus	2026-03-31 13:26:30.679748+09	2026-03-31 13:26:30.679748+09	admin
14	F023	Function List	/functions	2026-03-31 13:26:30.679748+09	2026-03-31 13:26:30.679748+09	admin
15	F901	Login Page	/login	2026-03-31 13:26:30.679748+09	2026-03-31 13:26:30.679748+09	admin
16	F902	Dashboard	/dashboard	2026-03-31 13:26:30.679748+09	2026-03-31 13:26:30.679748+09	admin
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.countries (id, country_code, country_name, capital_city, latitude, longitude, last_modified_by, updated_at, continent) FROM stdin;
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.members (id, member_code, first_name, last_name, email, status, created_at, updated_at, last_modified_by) FROM stdin;
7	M005	Demo	Name	demo.name@xxx.com	ACTIVE	2026-02-27 16:00:43.983655+09	2026-02-27 16:00:43.983655+09	\N
4	M004	Jack	Daniel	jack.daniel@xxx.com	ACTIVE	2026-02-27 09:54:30.573308+09	2026-02-27 17:59:56.598433+09	\N
3	M003	David	Johnson	david.johnson@xxx.com	ACTIVE	2026-02-27 09:15:57.326542+09	2026-02-27 18:00:15.245089+09	\N
2	M002	Jane	Smith	jane@example.com	ACTIVE	2026-02-26 10:51:47.668922+09	2026-02-27 18:03:02.64052+09	\N
8	M006	Kathy	Freeman	kathy.freeman@xxx.com	ACTIVE	2026-02-27 21:41:44.501906+09	2026-02-27 21:41:44.501906+09	\N
10	M007	Leo	Gorden	leo.gorden@xxx.com	ACTIVE	2026-03-06 09:51:34.16796+09	2026-03-06 09:51:34.16796+09	Henry Wong
12	M008	TARO	YAMADA	taro.yamada@xxx.com	ACTIVE	2026-03-09 09:14:15.759906+09	2026-03-09 09:14:15.759906+09	Henry Wong
16	M009	Peter	Poon	peter.poon@xxx.com	ACTIVE	2026-03-09 09:21:36.209355+09	2026-03-09 09:21:36.209355+09	Henry Wong
19	M010	TOAST	TEST	toast.test@xxx.com	ACTIVE	2026-03-09 09:57:55.571043+09	2026-03-09 09:57:55.571043+09	Henry Wong
20	M011	TOAST2	TEST	toast2.test@xxx.com	ACTIVE	2026-03-09 10:01:54.95131+09	2026-03-09 10:01:54.95131+09	Henry Wong
22	M013	Member2	Button	member2.button@xxx.com	ACTIVE	2026-03-09 10:25:49.253015+09	2026-03-09 10:25:49.253015+09	Henry Wong
21	M012	Member	Button	member.button@xxx.com	DELETED	2026-03-09 10:22:46.175681+09	2026-03-09 10:26:00.288339+09	Henry Wong
1	M001	John	Doe	john@example.com	ACTIVE	2026-02-26 10:51:47.668922+09	2026-03-25 14:47:10.876234+09	\N
\.


--
-- Data for Name: menu_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_group (id, menu_code, menu_name, created_at, updated_at, last_modified_by) FROM stdin;
1	ADMIN	MDM ADMIN	2026-03-31 13:11:38.771634+09	2026-03-31 13:11:38.771634+09	admin
2	MDM_SUP	MDM SUPER USER	2026-03-31 13:12:12.449685+09	2026-03-31 13:12:12.449685+09	admin
3	MDM_USER	MDM OFFICER	2026-03-31 13:12:43.124906+09	2026-03-31 13:12:43.124906+09	admin
4	MDM_MAIN	MDM Main Function	2026-03-31 13:49:01.058071+09	2026-03-31 13:49:01.058071+09	admin
5	MDM_JOB	Job and To-do	2026-03-31 13:49:01.058071+09	2026-03-31 13:49:01.058071+09	admin
6	MDM_SETUP	Setup	2026-03-31 13:49:01.058071+09	2026-03-31 13:49:01.058071+09	admin
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_items (id, menu_group_id, menu_item_seq, menu_item_name, sub_menu_group_id, app_function_id, created_at, updated_at, last_modified_by) FROM stdin;
1	6	10	\N	\N	12	2026-03-31 13:52:21.530845+09	2026-03-31 13:52:21.530845+09	admin
2	6	20	\N	\N	13	2026-03-31 13:52:21.530845+09	2026-03-31 13:52:21.530845+09	admin
3	6	30	\N	\N	14	2026-03-31 13:52:21.530845+09	2026-03-31 13:52:21.530845+09	admin
4	5	10	\N	\N	10	2026-03-31 13:54:53.913361+09	2026-03-31 13:54:53.913361+09	admin
5	5	20	\N	\N	11	2026-03-31 13:54:53.913361+09	2026-03-31 13:54:53.913361+09	admin
6	4	10	\N	\N	7	2026-03-31 13:54:53.913361+09	2026-03-31 13:54:53.913361+09	admin
7	4	20	\N	\N	8	2026-03-31 13:54:53.913361+09	2026-03-31 13:54:53.913361+09	admin
8	4	30	\N	\N	9	2026-03-31 13:54:53.913361+09	2026-03-31 13:54:53.913361+09	admin
9	1	10	\N	\N	16	2026-03-31 13:57:25.692581+09	2026-03-31 13:57:25.692581+09	admin
10	1	20	\N	6	\N	2026-03-31 13:57:25.692581+09	2026-03-31 13:57:25.692581+09	admin
11	1	30	\N	5	\N	2026-03-31 13:57:25.692581+09	2026-03-31 13:57:25.692581+09	admin
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password_hash, role, created_at, email, status, last_login, menu_group_id) FROM stdin;
1	admin	password123	ADMIN	2026-02-27 20:53:19.476835	wonghkc@gmail.com	ACTIVE	2026-03-31 15:04:34.723367+09	1
\.


--
-- Name: app_functions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.app_functions_id_seq', 16, true);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.countries_id_seq', 1, false);


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.members_id_seq', 54, true);


--
-- Name: menu_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_group_id_seq', 6, true);


--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 11, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: members members_member_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_member_code_key UNIQUE (member_code);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: members update_member_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_member_modtime BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- Name: members update_members_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_members_modtime BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- PostgreSQL database dump complete
--

\unrestrict hntByrzVYTyYyeD6phayWoaJ8XnGhvh06JWeWkczNmyZbpTAIM3ZzbM0nADBzTg

