--
-- PostgreSQL database dump
--

\restrict mmvPbhSw27Mc9weSHAHp5378PXkMUJFSjrF28TKx5AEkr9wnUXgLWkvStN9lYrJ

-- Dumped from database version 18.4 (Debian 18.4-1.pgdg13+1)
-- Dumped by pg_dump version 18.4 (Debian 18.4-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: class; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class (
    id_class integer NOT NULL,
    name_class character varying
);


ALTER TABLE public.class OWNER TO postgres;

--
-- Name: exams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exams (
    id_exam integer NOT NULL,
    id_subject integer NOT NULL,
    name_exam character varying,
    data_exam jsonb
);


ALTER TABLE public.exams OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id_student integer NOT NULL,
    name_student character varying
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    id_subject integer NOT NULL,
    name_subject character varying
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- Data for Name: class; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class (id_class, name_class) FROM stdin;
\.


--
-- Data for Name: exams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams (id_exam, id_subject, name_exam, data_exam) FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id_student, name_student) FROM stdin;
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id_subject, name_subject) FROM stdin;
\.


--
-- Name: class class_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_pk PRIMARY KEY (id_class);


--
-- Name: exams exams_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pk PRIMARY KEY (id_exam);


--
-- Name: students students_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pk PRIMARY KEY (id_student);


--
-- Name: subjects subjects_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pk PRIMARY KEY (id_subject);


--
-- Name: exams exams_subjects_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_subjects_fk FOREIGN KEY (id_subject) REFERENCES public.subjects(id_subject);


--
-- PostgreSQL database dump complete
--

\unrestrict mmvPbhSw27Mc9weSHAHp5378PXkMUJFSjrF28TKx5AEkr9wnUXgLWkvStN9lYrJ

