--
-- PostgreSQL database dump
--

\restrict tRhQz1LkLg08B9yO3o6oGAxGqchRjR9jG8n63jtJbtetPVDOzhQWJ4Q0qasbKHZ

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
-- Name: app_functions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.app_functions_id_seq', 16, true);


--
-- Name: menu_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_group_id_seq', 6, true);


--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 11, true);


--
-- PostgreSQL database dump complete
--

\unrestrict tRhQz1LkLg08B9yO3o6oGAxGqchRjR9jG8n63jtJbtetPVDOzhQWJ4Q0qasbKHZ

