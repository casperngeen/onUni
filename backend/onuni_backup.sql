--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3 (Homebrew)

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
-- Name: attempt_status_enum; Type: TYPE; Schema: public; Owner: caspe2
--

CREATE TYPE public.attempt_status_enum AS ENUM (
    'submitted',
    'auto-submitted',
    'in-progress',
    'calculating'
);


ALTER TYPE public.attempt_status_enum OWNER TO caspe2;

--
-- Name: onUni_role_enum; Type: TYPE; Schema: public; Owner: caspe2
--

CREATE TYPE public."onUni_role_enum" AS ENUM (
    'student',
    'teacher'
);


ALTER TYPE public."onUni_role_enum" OWNER TO caspe2;

--
-- Name: onuni_user_role_enum; Type: TYPE; Schema: public; Owner: caspe2
--

CREATE TYPE public.onuni_user_role_enum AS ENUM (
    'student',
    'teacher'
);


ALTER TYPE public.onuni_user_role_enum OWNER TO caspe2;

--
-- Name: question_attempt_answerstatus_enum; Type: TYPE; Schema: public; Owner: caspe2
--

CREATE TYPE public.question_attempt_answerstatus_enum AS ENUM (
    'correct',
    'incorrect'
);


ALTER TYPE public.question_attempt_answerstatus_enum OWNER TO caspe2;

--
-- Name: test_scoringformat_enum; Type: TYPE; Schema: public; Owner: caspe2
--

CREATE TYPE public.test_scoringformat_enum AS ENUM (
    'average',
    'highest',
    'latest'
);


ALTER TYPE public.test_scoringformat_enum OWNER TO caspe2;

--
-- Name: test_testtype_enum; Type: TYPE; Schema: public; Owner: caspe2
--

CREATE TYPE public.test_testtype_enum AS ENUM (
    'practice',
    'exam',
    'quiz'
);


ALTER TYPE public.test_testtype_enum OWNER TO caspe2;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: caspe2
--

CREATE TYPE public.user_role_enum AS ENUM (
    'student',
    'teacher'
);


ALTER TYPE public.user_role_enum OWNER TO caspe2;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attempt; Type: TABLE; Schema: public; Owner: caspe2
--

CREATE TABLE public.attempt (
    "attemptId" integer NOT NULL,
    status public.attempt_status_enum DEFAULT 'in-progress'::public.attempt_status_enum NOT NULL,
    start timestamp without time zone,
    "end" timestamp without time zone,
    submitted timestamp without time zone,
    score integer,
    "questionOrder" jsonb,
    "testTestId" integer,
    "userUserId" integer
);


ALTER TABLE public.attempt OWNER TO caspe2;

--
-- Name: attempt_attemptId_seq; Type: SEQUENCE; Schema: public; Owner: caspe2
--

CREATE SEQUENCE public."attempt_attemptId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."attempt_attemptId_seq" OWNER TO caspe2;

--
-- Name: attempt_attemptId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caspe2
--

ALTER SEQUENCE public."attempt_attemptId_seq" OWNED BY public.attempt."attemptId";


--
-- Name: course; Type: TABLE; Schema: public; Owner: caspe2
--

CREATE TABLE public.course (
    "courseId" integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL
);


ALTER TABLE public.course OWNER TO caspe2;

--
-- Name: course_courseId_seq; Type: SEQUENCE; Schema: public; Owner: caspe2
--

CREATE SEQUENCE public."course_courseId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."course_courseId_seq" OWNER TO caspe2;

--
-- Name: course_courseId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caspe2
--

ALTER SEQUENCE public."course_courseId_seq" OWNED BY public.course."courseId";


--
-- Name: onuni_user; Type: TABLE; Schema: public; Owner: caspe2
--

CREATE TABLE public.onuni_user (
    "userId" integer NOT NULL,
    email character varying(100) NOT NULL,
    "passwordHash" text NOT NULL,
    "emailToken" integer,
    "refreshToken" text,
    "profilePic" text,
    name text DEFAULT 'Person'::text NOT NULL,
    role public.onuni_user_role_enum DEFAULT 'student'::public.onuni_user_role_enum NOT NULL
);


ALTER TABLE public.onuni_user OWNER TO caspe2;

--
-- Name: onuni_user_courses_course; Type: TABLE; Schema: public; Owner: caspe2
--

CREATE TABLE public.onuni_user_courses_course (
    "onuniUserUserId" integer NOT NULL,
    "courseCourseId" integer NOT NULL
);


ALTER TABLE public.onuni_user_courses_course OWNER TO caspe2;

--
-- Name: onuni_user_userId_seq; Type: SEQUENCE; Schema: public; Owner: caspe2
--

CREATE SEQUENCE public."onuni_user_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."onuni_user_userId_seq" OWNER TO caspe2;

--
-- Name: onuni_user_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caspe2
--

ALTER SEQUENCE public."onuni_user_userId_seq" OWNED BY public.onuni_user."userId";


--
-- Name: option; Type: TABLE; Schema: public; Owner: caspe2
--

CREATE TABLE public.option (
    "optionId" integer NOT NULL,
    "optionText" text NOT NULL,
    "isCorrect" boolean NOT NULL,
    "questionQuestionId" integer
);


ALTER TABLE public.option OWNER TO caspe2;

--
-- Name: option_optionId_seq; Type: SEQUENCE; Schema: public; Owner: caspe2
--

CREATE SEQUENCE public."option_optionId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."option_optionId_seq" OWNER TO caspe2;

--
-- Name: option_optionId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caspe2
--

ALTER SEQUENCE public."option_optionId_seq" OWNED BY public.option."optionId";


--
-- Name: question; Type: TABLE; Schema: public; Owner: caspe2
--

CREATE TABLE public.question (
    "questionId" integer NOT NULL,
    "questionText" text NOT NULL,
    "testTestId" integer
);


ALTER TABLE public.question OWNER TO caspe2;

--
-- Name: question_attempt; Type: TABLE; Schema: public; Owner: caspe2
--

CREATE TABLE public.question_attempt (
    "questionAttemptId" integer NOT NULL,
    "selectedOptionId" integer NOT NULL,
    "answerStatus" public.question_attempt_answerstatus_enum,
    "questionQuestionId" integer,
    "attemptAttemptId" integer
);


ALTER TABLE public.question_attempt OWNER TO caspe2;

--
-- Name: question_attempt_questionAttemptId_seq; Type: SEQUENCE; Schema: public; Owner: caspe2
--

CREATE SEQUENCE public."question_attempt_questionAttemptId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."question_attempt_questionAttemptId_seq" OWNER TO caspe2;

--
-- Name: question_attempt_questionAttemptId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caspe2
--

ALTER SEQUENCE public."question_attempt_questionAttemptId_seq" OWNED BY public.question_attempt."questionAttemptId";


--
-- Name: question_questionId_seq; Type: SEQUENCE; Schema: public; Owner: caspe2
--

CREATE SEQUENCE public."question_questionId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."question_questionId_seq" OWNER TO caspe2;

--
-- Name: question_questionId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caspe2
--

ALTER SEQUENCE public."question_questionId_seq" OWNED BY public.question."questionId";


--
-- Name: test; Type: TABLE; Schema: public; Owner: caspe2
--

CREATE TABLE public.test (
    "testId" integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    start timestamp without time zone,
    deadline timestamp without time zone,
    "scoringFormat" public.test_scoringformat_enum,
    "maxAttempt" integer,
    "timeLimit" integer,
    "maxScore" integer NOT NULL,
    "testType" public.test_testtype_enum NOT NULL,
    "courseCourseId" integer
);


ALTER TABLE public.test OWNER TO caspe2;

--
-- Name: test_testId_seq; Type: SEQUENCE; Schema: public; Owner: caspe2
--

CREATE SEQUENCE public."test_testId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."test_testId_seq" OWNER TO caspe2;

--
-- Name: test_testId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caspe2
--

ALTER SEQUENCE public."test_testId_seq" OWNED BY public.test."testId";


--
-- Name: attempt attemptId; Type: DEFAULT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.attempt ALTER COLUMN "attemptId" SET DEFAULT nextval('public."attempt_attemptId_seq"'::regclass);


--
-- Name: course courseId; Type: DEFAULT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.course ALTER COLUMN "courseId" SET DEFAULT nextval('public."course_courseId_seq"'::regclass);


--
-- Name: onuni_user userId; Type: DEFAULT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.onuni_user ALTER COLUMN "userId" SET DEFAULT nextval('public."onuni_user_userId_seq"'::regclass);


--
-- Name: option optionId; Type: DEFAULT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.option ALTER COLUMN "optionId" SET DEFAULT nextval('public."option_optionId_seq"'::regclass);


--
-- Name: question questionId; Type: DEFAULT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.question ALTER COLUMN "questionId" SET DEFAULT nextval('public."question_questionId_seq"'::regclass);


--
-- Name: question_attempt questionAttemptId; Type: DEFAULT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.question_attempt ALTER COLUMN "questionAttemptId" SET DEFAULT nextval('public."question_attempt_questionAttemptId_seq"'::regclass);


--
-- Name: test testId; Type: DEFAULT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.test ALTER COLUMN "testId" SET DEFAULT nextval('public."test_testId_seq"'::regclass);


--
-- Data for Name: attempt; Type: TABLE DATA; Schema: public; Owner: caspe2
--

COPY public.attempt ("attemptId", status, start, "end", submitted, score, "questionOrder", "testTestId", "userUserId") FROM stdin;
2430	submitted	2024-07-24 09:07:30.405	\N	2024-07-24 09:07:37.241	2	[{"questionId": 65, "optionOrder": [42, 44, 43]}, {"questionId": 66, "optionOrder": [46, 47, 45]}, {"questionId": 67, "optionOrder": [50, 49, 48]}, {"questionId": 69, "optionOrder": [54, 55, 56]}, {"questionId": 68, "optionOrder": [52, 53, 51]}]	8	9
2431	submitted	2024-07-24 14:33:10.846	2024-07-24 14:34:10.846	2024-07-24 14:34:30.545	0	[{"questionId": 70, "optionOrder": [58, 57, 59]}, {"questionId": 73, "optionOrder": [67, 66, 68]}, {"questionId": 74, "optionOrder": [70, 69, 71]}, {"questionId": 72, "optionOrder": [63, 65, 64]}, {"questionId": 71, "optionOrder": [61, 62, 60]}]	9	9
2432	submitted	2024-07-24 14:34:53.349	\N	2024-07-24 14:34:59.772	0	[{"questionId": 67, "optionOrder": [50, 49, 48]}, {"questionId": 65, "optionOrder": [44, 43, 42]}, {"questionId": 66, "optionOrder": [46, 45, 47]}, {"questionId": 68, "optionOrder": [53, 51, 52]}, {"questionId": 69, "optionOrder": [54, 55, 56]}]	8	9
\.


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: caspe2
--

COPY public.course ("courseId", title, description, "startDate", "endDate") FROM stdin;
3	Course 2	This is another course	2023-01-01	2025-01-01
4	Course XYZ	This is Course XYZ	2024-01-01	2025-01-01
5	Demo Course 1	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.	2024-01-01	2024-12-31
6	Demo Course 2	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.	2024-12-01	2024-12-31
\.


--
-- Data for Name: onuni_user; Type: TABLE DATA; Schema: public; Owner: caspe2
--

COPY public.onuni_user ("userId", email, "passwordHash", "emailToken", "refreshToken", "profilePic", name, role) FROM stdin;
7	ryan@gmail.com	$2b$10$Wocyd3akkHxQBSUWrEN2Z.D9CWnwGTIUIUNyHlBrqtT8lljU/yROa	\N	\N	\N	Ryan	teacher
8	serwei@gmail.com	$2b$10$1QDQnoepRrXV7Ce/5LQ5qeNb8Jv10OavzOigsy45oDyTSUvdbI3Ki	\N	\N	\N	Ser Wei	student
4	test@gg.com	$2b$10$jjmY7mhLPicauLx/z6WP3uP3d.WYyzW1wZp0PxyzdMQ5hI1fVNWW6	\N	$2b$10$9EOqcoebwnbl8hFgBI4qWu6LwboW2..mlbWpCv/FBDLCPIzZNLHH.	\N	Person	student
5	test@gmail.com	$2b$10$5CHfGjhqDqEqEyXXFYmPH.NBwp2B4L.3Jxx2rIl0LOL05iYz0xCyu	\N	$2b$10$7466bFBCHgXpv8MaDF8DeeHuf//Ic0T8RA26zTyeXjATZ7kE5pTtC	\N	Person	student
6	teacher@gmail.com	$2b$10$sIxIBtnyWPPlRDKQXxI0Qe5BEd4Dk6WSzi5DBPIeE3OG8QkT6MVNC	\N	\N	\N	Teacher 1	teacher
2	test@yahoo.com	$2b$10$l04E3SBYleJi3EHKidmo0.qzoUNiet4xCqS3CwppW0BjwgpcopGhe	\N	\N	\N	Person	student
9	casper@gmail.com	$2b$10$MJk5s7r5wdCt0FL77snDUuI0Dj7AWYCz1ermNpDH137RLf1nWaKry	\N	$2b$10$YdoC/nJoGBj9wWHs1o1Ye.jLn.7IInlv5h4kiJQ7PW79pyEvN4Qui	\N	Casper	student
\.


--
-- Data for Name: onuni_user_courses_course; Type: TABLE DATA; Schema: public; Owner: caspe2
--

COPY public.onuni_user_courses_course ("onuniUserUserId", "courseCourseId") FROM stdin;
2	3
4	3
2	4
8	4
9	5
9	6
\.


--
-- Data for Name: option; Type: TABLE DATA; Schema: public; Owner: caspe2
--

COPY public.option ("optionId", "optionText", "isCorrect", "questionQuestionId") FROM stdin;
\.


--
-- Data for Name: question; Type: TABLE DATA; Schema: public; Owner: caspe2
--

COPY public.question ("questionId", "questionText", "testTestId") FROM stdin;
38	Is this a question for Test 10?	3
39	This is question 1 of test 1 of course XYZ	4
40	This is question 2 of test 1 of course XYZ	4
41	This is question 3 of test 1 of course XYZ	4
42	This is question 4 of test 1 of course XYZ	4
43	This is question 5 of test 1 of course XYZ	4
44	This is question 6 of test 1 of course XYZ	4
45	This is question 7 of test 1 of course XYZ	4
46	This is question 8 of test 1 of course XYZ	4
47	This is question 9 of test 1 of course XYZ	4
48	This is question 10 of test 1 of course XYZ	4
49	This is question 1 of test 2 of course XYZ	5
50	This is question 2 of test 2 of course XYZ	5
52	This is question 4 of test 2 of course XYZ	5
53	This is question 5 of test 2 of course XYZ	5
54	This is question 6 of test 2 of course XYZ	5
55	This is question 7 of test 2 of course XYZ	5
56	This is question 8 of test 2 of course XYZ	5
57	This is question 9 of test 2 of course XYZ	5
58	This is question 10 of test 2 of course XYZ	5
59	This is question 11 of test 2 of course XYZ	5
60	This is question 12 of test 2 of course XYZ	5
61	This is question 13 of test 2 of course XYZ	5
62	This is question 14 of test 2 of course XYZ	5
63	This is question 15 of test 2 of course XYZ	5
64	This is question 16 of test 2 of course XYZ	5
65	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.	8
66	Hello world	8
67	Testing	8
68	Goodbye	8
69	Last question	8
70	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.	9
71	Another question	9
72	Testing question	9
73	Hello world	9
74	Last question	9
75	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.	10
76	Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.	10
77	Another question	10
78	Testing question	10
79	Goodbye	10
\.


--
-- Data for Name: question_attempt; Type: TABLE DATA; Schema: public; Owner: caspe2
--

COPY public.question_attempt ("questionAttemptId", "selectedOptionId", "answerStatus", "questionQuestionId", "attemptAttemptId") FROM stdin;
270	42	correct	65	2430
271	45	correct	66	2430
272	49	incorrect	67	2432
\.


--
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: caspe2
--

COPY public.test ("testId", title, description, start, deadline, "scoringFormat", "maxAttempt", "timeLimit", "maxScore", "testType", "courseCourseId") FROM stdin;
3	Test 10	This is the description for test 10	\N	\N	\N	\N	\N	20	practice	3
4	Test 1	Test 1 belongs to Course XYZ	\N	\N	\N	\N	\N	10	quiz	4
5	Test 2	Test 2 belongs to Course XYZ	\N	\N	\N	\N	20	50	practice	4
7	Test 3	Test 3 belongs to Course XYZ	2024-01-01 07:00:00	2025-01-01 07:00:00	highest	3	5	10	exam	4
8	Demo Test 1	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.	\N	\N	\N	\N	\N	5	quiz	5
9	Demo Test 2	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.	\N	\N	\N	\N	1	5	practice	5
10	Demo Exam Test 3	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.	2024-07-01 07:00:00	2024-07-31 23:59:00	highest	3	1	5	exam	5
11	Demo Test 4	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.	\N	\N	\N	\N	\N	5	quiz	6
\.


--
-- Name: attempt_attemptId_seq; Type: SEQUENCE SET; Schema: public; Owner: caspe2
--

SELECT pg_catalog.setval('public."attempt_attemptId_seq"', 2432, true);


--
-- Name: course_courseId_seq; Type: SEQUENCE SET; Schema: public; Owner: caspe2
--

SELECT pg_catalog.setval('public."course_courseId_seq"', 6, true);


--
-- Name: onuni_user_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: caspe2
--

SELECT pg_catalog.setval('public."onuni_user_userId_seq"', 9, true);


--
-- Name: option_optionId_seq; Type: SEQUENCE SET; Schema: public; Owner: caspe2
--

SELECT pg_catalog.setval('public."option_optionId_seq"', 86, true);


--
-- Name: question_attempt_questionAttemptId_seq; Type: SEQUENCE SET; Schema: public; Owner: caspe2
--

SELECT pg_catalog.setval('public."question_attempt_questionAttemptId_seq"', 272, true);


--
-- Name: question_questionId_seq; Type: SEQUENCE SET; Schema: public; Owner: caspe2
--

SELECT pg_catalog.setval('public."question_questionId_seq"', 79, true);


--
-- Name: test_testId_seq; Type: SEQUENCE SET; Schema: public; Owner: caspe2
--

SELECT pg_catalog.setval('public."test_testId_seq"', 11, true);


--
-- Name: question_attempt PK_0369fe15c6e4f2ddd8f14e7e42a; Type: CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.question_attempt
    ADD CONSTRAINT "PK_0369fe15c6e4f2ddd8f14e7e42a" PRIMARY KEY ("questionAttemptId");


--
-- Name: onuni_user PK_3b5c089282e23f9728930c41f16; Type: CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.onuni_user
    ADD CONSTRAINT "PK_3b5c089282e23f9728930c41f16" PRIMARY KEY ("userId");


--
-- Name: option PK_8c13edc70074ba589656874050f; Type: CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.option
    ADD CONSTRAINT "PK_8c13edc70074ba589656874050f" PRIMARY KEY ("optionId");


--
-- Name: attempt PK_b09547457ec450091f70f6266d3; Type: CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.attempt
    ADD CONSTRAINT "PK_b09547457ec450091f70f6266d3" PRIMARY KEY ("attemptId");


--
-- Name: onuni_user_courses_course PK_c3d0e9bf37cc202208b7fd44de4; Type: CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.onuni_user_courses_course
    ADD CONSTRAINT "PK_c3d0e9bf37cc202208b7fd44de4" PRIMARY KEY ("onuniUserUserId", "courseCourseId");


--
-- Name: test PK_e2e0ec0a7eef4314a739d10d81b; Type: CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.test
    ADD CONSTRAINT "PK_e2e0ec0a7eef4314a739d10d81b" PRIMARY KEY ("testId");


--
-- Name: course PK_eda8475dda5090c7f747251dd2e; Type: CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT "PK_eda8475dda5090c7f747251dd2e" PRIMARY KEY ("courseId");


--
-- Name: question PK_f5c864430d1f3626bc6671d6b8d; Type: CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT "PK_f5c864430d1f3626bc6671d6b8d" PRIMARY KEY ("questionId");


--
-- Name: IDX_2c8ca1663545253172369ebef3; Type: INDEX; Schema: public; Owner: caspe2
--

CREATE INDEX "IDX_2c8ca1663545253172369ebef3" ON public.onuni_user_courses_course USING btree ("onuniUserUserId");


--
-- Name: IDX_a96619a32e3e4b57948ef25557; Type: INDEX; Schema: public; Owner: caspe2
--

CREATE INDEX "IDX_a96619a32e3e4b57948ef25557" ON public.onuni_user_courses_course USING btree ("courseCourseId");


--
-- Name: onuni_user_courses_course FK_2c8ca1663545253172369ebef3b; Type: FK CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.onuni_user_courses_course
    ADD CONSTRAINT "FK_2c8ca1663545253172369ebef3b" FOREIGN KEY ("onuniUserUserId") REFERENCES public.onuni_user("userId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: option FK_2d4e6126f45821a7d1bdc405e3d; Type: FK CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.option
    ADD CONSTRAINT "FK_2d4e6126f45821a7d1bdc405e3d" FOREIGN KEY ("questionQuestionId") REFERENCES public.question("questionId") ON DELETE CASCADE;


--
-- Name: question_attempt FK_31f73b38c0c406a3e6f4e36e419; Type: FK CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.question_attempt
    ADD CONSTRAINT "FK_31f73b38c0c406a3e6f4e36e419" FOREIGN KEY ("attemptAttemptId") REFERENCES public.attempt("attemptId") ON DELETE CASCADE;


--
-- Name: question_attempt FK_4169edc4f2b16d3409383460812; Type: FK CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.question_attempt
    ADD CONSTRAINT "FK_4169edc4f2b16d3409383460812" FOREIGN KEY ("questionQuestionId") REFERENCES public.question("questionId") ON DELETE CASCADE;


--
-- Name: question FK_6b0d4708449a84a27c153ef8360; Type: FK CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT "FK_6b0d4708449a84a27c153ef8360" FOREIGN KEY ("testTestId") REFERENCES public.test("testId") ON DELETE CASCADE;


--
-- Name: attempt FK_770b9f4c68c681a251e15953e10; Type: FK CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.attempt
    ADD CONSTRAINT "FK_770b9f4c68c681a251e15953e10" FOREIGN KEY ("userUserId") REFERENCES public.onuni_user("userId") ON DELETE CASCADE;


--
-- Name: attempt FK_873c1ad0aa3a40d8e22b554ce9b; Type: FK CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.attempt
    ADD CONSTRAINT "FK_873c1ad0aa3a40d8e22b554ce9b" FOREIGN KEY ("testTestId") REFERENCES public.test("testId") ON DELETE CASCADE;


--
-- Name: onuni_user_courses_course FK_a96619a32e3e4b57948ef255579; Type: FK CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.onuni_user_courses_course
    ADD CONSTRAINT "FK_a96619a32e3e4b57948ef255579" FOREIGN KEY ("courseCourseId") REFERENCES public.course("courseId") ON DELETE CASCADE;


--
-- Name: test FK_e19521423c670eec9c57037e6cd; Type: FK CONSTRAINT; Schema: public; Owner: caspe2
--

ALTER TABLE ONLY public.test
    ADD CONSTRAINT "FK_e19521423c670eec9c57037e6cd" FOREIGN KEY ("courseCourseId") REFERENCES public.course("courseId") ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

