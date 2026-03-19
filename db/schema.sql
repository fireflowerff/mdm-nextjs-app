--
-- PostgreSQL database dump
--

\restrict zK4woKxB9Ppi6LAWz953YuYCQa6P3KLLUKPCCiJqRsjajK5sq2YN9cO9Z3VLv90

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
-- Name: sp_register_member(character varying, character varying, character varying, character varying, integer, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_register_member(IN p_member_code character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_country_id integer, IN p_created_by character varying, OUT p_new_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- 1. Validation: Ensure the country exists
    IF NOT EXISTS (SELECT 1 FROM public.countries WHERE id = p_country_id) THEN
        RAISE EXCEPTION 'Invalid Country ID: %', p_country_id;
    END IF;

    -- 2. Validation: Ensure member_code is unique
    IF EXISTS (SELECT 1 FROM public.members WHERE member_code = p_member_code) THEN
        RAISE EXCEPTION 'Member code % already exists.', p_member_code;
    END IF;

    -- 3. Insert the record
    INSERT INTO public.members (
        member_code, 
        first_name, 
        last_name, 
        email, 
        country_id, 
        last_modified_by
    )
    VALUES (
        p_member_code, 
        p_first_name, 
        p_last_name, 
        p_email, 
        p_country_id, 
        p_created_by
    )
    RETURNING id INTO p_new_id;

    COMMIT;
END;
$$;


ALTER PROCEDURE public.sp_register_member(IN p_member_code character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_country_id integer, IN p_created_by character varying, OUT p_new_id integer) OWNER TO postgres;

--
-- Name: update_modified_audit(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_modified_audit() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update the timestamp
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    -- Attempt to set the user from a session variable if your app supports it
    -- Otherwise, it stays as whatever the application explicitly sent in the UPDATE
    BEGIN
        NEW.last_modified_by = COALESCE(NEW.last_modified_by, current_setting('app.current_user', true));
    EXCEPTION WHEN OTHERS THEN
        -- Fallback if no session user is set
        NULL; 
    END;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_modified_audit() OWNER TO postgres;

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
    last_modified_by character varying(100),
    country_id integer
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
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'USER'::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    email character varying(255),
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    last_login timestamp with time zone,
    last_modified_by character varying(100)
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
-- Name: vw_member_details; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_member_details AS
 SELECT m.id AS member_id,
    m.member_code,
    m.first_name,
    m.last_name,
    concat(m.first_name, ' ', m.last_name) AS full_name,
    m.email AS member_email,
    m.status AS member_status,
    c.country_name,
    c.country_code,
    c.continent,
    m.created_at,
    m.updated_at,
    u.username AS modified_by_user
   FROM ((public.members m
     LEFT JOIN public.countries c ON ((m.country_id = c.id)))
     LEFT JOIN public.users u ON (((m.last_modified_by)::text = u.username)));


ALTER VIEW public.vw_member_details OWNER TO postgres;

--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: countries countries_country_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_country_code_key UNIQUE (country_code);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


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
-- Name: countries trg_countries_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_countries_audit BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.update_modified_audit();


--
-- Name: members trg_members_audit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_members_audit BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_modified_audit();


--
-- Name: members update_member_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_member_modtime BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- Name: members update_members_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_members_modtime BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- Name: members fk_member_country; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT fk_member_country FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict zK4woKxB9Ppi6LAWz953YuYCQa6P3KLLUKPCCiJqRsjajK5sq2YN9cO9Z3VLv90

