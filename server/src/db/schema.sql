--
-- PostgreSQL database dump
--

\restrict P0fa6QRBHa728pquD1BEsWZy62afo55f0BLE6dcb591RIJevMvXJaDQy1upay8p

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

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

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: completed_sets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.completed_sets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    workout_exercise_id uuid NOT NULL,
    set_number integer NOT NULL,
    reps integer,
    weight numeric,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    duration integer
);


ALTER TABLE public.completed_sets OWNER TO postgres;

--
-- Name: completed_workouts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.completed_workouts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    workout_id uuid NOT NULL,
    completed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    session_id uuid NOT NULL
);


ALTER TABLE public.completed_workouts OWNER TO postgres;

--
-- Name: exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK ((length(name) > 0))
);


ALTER TABLE public.exercises OWNER TO postgres;

--
-- Name: sets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workout_exercise_id uuid NOT NULL,
    set_order integer NOT NULL,
    reps integer,
    weight numeric(6,2),
    duration integer
);


ALTER TABLE public.sets OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email character varying(255),
    verified timestamp without time zone,
    verification_token character varying(255),
    verification_token_expires timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: workout_exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workout_exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workout_id uuid NOT NULL,
    exercise_id uuid NOT NULL,
    exercise_order integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    rest_between_sets integer DEFAULT 60,
    rest_after_exercise integer DEFAULT 180,
    type text DEFAULT 'reps'::text
);


ALTER TABLE public.workout_exercises OWNER TO postgres;

--
-- Name: workout_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workout_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    workout_id uuid NOT NULL,
    started_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    ended_at timestamp with time zone,
    status text DEFAULT 'active'::text,
    last_activity timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    progress jsonb
);


ALTER TABLE public.workout_sessions OWNER TO postgres;

--
-- Name: workouts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workouts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.workouts OWNER TO postgres;

--
-- Data for Name: completed_sets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.completed_sets (id, session_id, workout_exercise_id, set_number, reps, weight, completed_at, duration) FROM stdin;
f787a223-c58e-485a-a51b-a3e121f3e46e	61337ae7-e97a-4594-b35d-9efd56d3037d	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-06 12:09:14.543456	0
de5a2b0c-a18d-4cec-927e-17124bbc0978	61337ae7-e97a-4594-b35d-9efd56d3037d	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-06 12:09:22.300953	0
a43183f3-ec5c-40a0-bff8-786fe13dbe7d	61337ae7-e97a-4594-b35d-9efd56d3037d	33420114-4978-45fd-9666-4470b23d17bd	0	1	0	2026-05-06 12:09:28.071122	0
8e0529c4-43db-4069-b434-bc53ea166423	61337ae7-e97a-4594-b35d-9efd56d3037d	33420114-4978-45fd-9666-4470b23d17bd	1	12	0	2026-05-06 12:10:20.067843	0
b47d5ce6-6b48-4763-9cac-e53014f7ad0a	61337ae7-e97a-4594-b35d-9efd56d3037d	33420114-4978-45fd-9666-4470b23d17bd	1	12	0	2026-05-06 12:10:20.077358	0
521ce514-eb0d-48fd-8c28-97d5d0681a1a	61337ae7-e97a-4594-b35d-9efd56d3037d	967412bf-4874-4e14-a4c9-6377b919ae41	0	1	0	2026-05-06 12:10:46.400387	0
184dabe1-a0d2-4258-bdda-ac184a144af4	61337ae7-e97a-4594-b35d-9efd56d3037d	967412bf-4874-4e14-a4c9-6377b919ae41	0	1	0	2026-05-06 12:10:53.654343	0
653b542d-1b21-43b3-8633-154cfa95d869	f6da058f-475d-49ff-9871-b076bfb1c6a9	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-06 12:23:57.429528	0
6b82b8f5-9ef3-4781-9a1e-a33d5686cedc	f6da058f-475d-49ff-9871-b076bfb1c6a9	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-06 12:24:07.937789	0
bb8a8bc2-c91f-4312-b3cb-816612f410ce	f6da058f-475d-49ff-9871-b076bfb1c6a9	33420114-4978-45fd-9666-4470b23d17bd	0	1	0	2026-05-06 12:24:12.411572	0
08f95bcb-fed4-48ec-975d-8b706a01a410	f6da058f-475d-49ff-9871-b076bfb1c6a9	33420114-4978-45fd-9666-4470b23d17bd	1	12	0	2026-05-06 12:24:16.628763	0
15dbe218-588c-4f6f-abd8-8152a7cfb02a	f6da058f-475d-49ff-9871-b076bfb1c6a9	967412bf-4874-4e14-a4c9-6377b919ae41	0	1	0	2026-05-06 12:24:28.942051	0
d0b4baf8-05c1-476f-b97a-8fbd3a9d2054	f6da058f-475d-49ff-9871-b076bfb1c6a9	967412bf-4874-4e14-a4c9-6377b919ae41	0	1	0	2026-05-06 12:24:37.971373	0
6bf5c75a-9a96-40e3-80db-3bdbac1a5a19	6bc356de-2aa7-4ea9-bd53-8d704d522920	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-06 12:24:40.912225	0
9c5fac09-7190-4850-81b9-24dde7168dd5	6bc356de-2aa7-4ea9-bd53-8d704d522920	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-06 12:24:48.989689	0
24e1145d-f9e8-43fe-836f-68fd2f2ef7f6	6bc356de-2aa7-4ea9-bd53-8d704d522920	33420114-4978-45fd-9666-4470b23d17bd	0	1	0	2026-05-06 12:24:53.473751	0
30153424-8df9-492a-ba3c-badfd3b3646c	6bc356de-2aa7-4ea9-bd53-8d704d522920	33420114-4978-45fd-9666-4470b23d17bd	1	12	0	2026-05-06 12:40:39.873763	0
7d64825b-acf9-48c6-bd54-1475825c995d	e53b69aa-1eda-4fb1-a5ce-6d53c007c352	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-07 12:15:53.677929	0
c99dbd30-5bab-4786-9828-255ed3f82111	e53b69aa-1eda-4fb1-a5ce-6d53c007c352	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-07 12:16:08.375672	0
47a340fe-dc69-4a55-a1c9-91369d8fb306	e53b69aa-1eda-4fb1-a5ce-6d53c007c352	33420114-4978-45fd-9666-4470b23d17bd	0	1	0	2026-05-07 12:16:17.315798	0
c40d78f2-4aa9-4dc2-bde4-5ddbd8015c14	e53b69aa-1eda-4fb1-a5ce-6d53c007c352	33420114-4978-45fd-9666-4470b23d17bd	1	12	0	2026-05-07 12:16:24.965908	0
3d2907b9-5bc1-42e6-8ba0-975b7db0b2d5	e53b69aa-1eda-4fb1-a5ce-6d53c007c352	967412bf-4874-4e14-a4c9-6377b919ae41	0	1	0	2026-05-07 12:16:30.340576	0
9ba7b908-459a-406e-95ba-a442c3b2fb7b	3a33ed9b-5490-4f15-9ea9-abaf36f93b0e	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-07 12:16:38.349825	0
5665e8c6-d29b-41ff-a950-315620e8951f	3a33ed9b-5490-4f15-9ea9-abaf36f93b0e	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-07 12:16:42.521398	0
550ae3f5-ccf4-4cf0-bc9d-298a20f3eb94	3a33ed9b-5490-4f15-9ea9-abaf36f93b0e	33420114-4978-45fd-9666-4470b23d17bd	0	1	0	2026-05-07 12:16:48.800984	0
9c41a07d-9981-4429-bee9-80072b1a8928	3a33ed9b-5490-4f15-9ea9-abaf36f93b0e	33420114-4978-45fd-9666-4470b23d17bd	1	12	0	2026-05-07 12:16:54.542041	0
ffd71c52-01c8-4c90-92c8-235bbb27783e	3a33ed9b-5490-4f15-9ea9-abaf36f93b0e	967412bf-4874-4e14-a4c9-6377b919ae41	0	1	0	2026-05-07 12:16:59.392635	0
ee5c277d-8ca1-435b-9245-5cc8fce7994c	ca8bfb42-4ca3-4c3d-b5fb-0ce56cccdb19	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-07 13:00:29.318042	0
2d29bb36-3f90-407f-8621-c8aab45b77fc	ca8bfb42-4ca3-4c3d-b5fb-0ce56cccdb19	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-07 13:02:14.074711	0
7cecd53c-6777-4522-b832-a35488b7344b	ca8bfb42-4ca3-4c3d-b5fb-0ce56cccdb19	33420114-4978-45fd-9666-4470b23d17bd	0	1	0	2026-05-07 13:03:07.695105	0
d16e3b58-aae2-456e-a92f-09c236417363	ca8bfb42-4ca3-4c3d-b5fb-0ce56cccdb19	33420114-4978-45fd-9666-4470b23d17bd	1	12	0	2026-05-07 13:03:55.720911	0
15dff6d7-e72a-43b3-8357-df90c54572ef	ca8bfb42-4ca3-4c3d-b5fb-0ce56cccdb19	967412bf-4874-4e14-a4c9-6377b919ae41	0	1	0	2026-05-07 13:05:09.809908	0
9f63d7ec-bebf-4f8a-a33e-e6dd7e8563c8	23ccedf2-726c-4da9-9295-21b15d792ce4	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-07 13:12:21.764892	0
3920862c-4383-4c97-acbf-92686ef02397	23ccedf2-726c-4da9-9295-21b15d792ce4	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-07 13:12:59.614381	0
be84ad9b-9d92-4783-a2e7-aabd56b88ee1	23ccedf2-726c-4da9-9295-21b15d792ce4	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-07 13:13:43.183879	0
ae538994-9660-4e0f-9ab3-e888d25d30e1	23ccedf2-726c-4da9-9295-21b15d792ce4	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-07 13:15:36.764948	0
429e60a1-b2fe-4476-8ee7-0be2a60913b6	23ccedf2-726c-4da9-9295-21b15d792ce4	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-07 13:16:54.650165	0
271dc09f-fd6d-4c55-8238-b520a12951dc	23ccedf2-726c-4da9-9295-21b15d792ce4	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-07 13:29:05.189495	0
46b5754b-0058-45ad-9b7f-242eba25e1d6	23ccedf2-726c-4da9-9295-21b15d792ce4	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-07 17:38:45.926444	0
aec3aca6-79ad-4de1-98a8-bbbaee60d723	23ccedf2-726c-4da9-9295-21b15d792ce4	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-07 17:38:49.457343	0
9e876813-e4bc-4d83-92a7-cebc562d47d2	23ccedf2-726c-4da9-9295-21b15d792ce4	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-07 17:40:01.832169	0
835d4800-60e8-4be3-bd75-b311a92a49ae	23ccedf2-726c-4da9-9295-21b15d792ce4	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-07 17:40:58.59628	0
56aa4f8f-fb36-4f7e-b297-b01a290b8300	23ccedf2-726c-4da9-9295-21b15d792ce4	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-07 17:42:26.050656	0
d5e14ed4-0105-4414-ba9d-3ce521a8cbc3	23ccedf2-726c-4da9-9295-21b15d792ce4	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-07 17:43:26.29392	0
e4a0e101-9157-41b3-88bb-07f8e27c38f1	23ccedf2-726c-4da9-9295-21b15d792ce4	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-07 17:46:02.667095	0
3ff23029-1a90-465d-9f92-4461c699018e	23ccedf2-726c-4da9-9295-21b15d792ce4	33420114-4978-45fd-9666-4470b23d17bd	0	1	0	2026-05-07 17:55:22.428476	0
b2815e0d-92b6-4632-ac63-35f7c808e0a2	cd93463c-cb20-4211-a80b-58b647566f85	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-08 19:05:08.141047	0
ff0ea878-ec4b-4efe-bdf2-a24f17a60725	cd93463c-cb20-4211-a80b-58b647566f85	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-08 19:05:13.885709	0
f1f24dc4-abe8-42de-bda2-206cafd74431	cd93463c-cb20-4211-a80b-58b647566f85	33420114-4978-45fd-9666-4470b23d17bd	0	1	0	2026-05-08 19:05:58.182834	0
300e2116-14b5-4ec5-a8c7-e9c9334f88ef	cd93463c-cb20-4211-a80b-58b647566f85	33420114-4978-45fd-9666-4470b23d17bd	1	12	0	2026-05-08 19:05:59.274926	0
650edc5b-e728-4eec-a955-841e6e0f13a4	cd93463c-cb20-4211-a80b-58b647566f85	967412bf-4874-4e14-a4c9-6377b919ae41	0	1	0	2026-05-08 19:06:00.44019	0
c3aceb13-55ec-4e1a-b892-2e3ac332bdef	0ef4ec6a-9aaf-44b9-950b-0630bd2ba9ec	700898ec-32ec-4268-8905-cdceed095da5	1	1	0	2026-05-08 19:29:59.612396	0
dc7c9cbd-a534-4a3e-872a-64929ba75bbf	0ef4ec6a-9aaf-44b9-950b-0630bd2ba9ec	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	0	1	0	2026-05-08 19:30:01.409512	0
120248ef-9b46-4185-9b28-a1f1661dc1c7	0ef4ec6a-9aaf-44b9-950b-0630bd2ba9ec	33420114-4978-45fd-9666-4470b23d17bd	0	1	0	2026-05-08 19:30:03.275996	0
d237464e-1f4c-4cc1-8b0c-63332e6e4425	0ef4ec6a-9aaf-44b9-950b-0630bd2ba9ec	33420114-4978-45fd-9666-4470b23d17bd	1	12	0	2026-05-08 19:30:35.101768	0
cb6113cf-4afc-4403-97be-8ee0b0d676ab	14a515c8-6e22-4f43-a758-f973ca88ff24	19a6e277-01f9-4899-b134-d83728b8093c	1	2	0	2026-06-01 09:53:23.642554	0
a8ec327e-3692-4917-913d-72f3e894987c	14a515c8-6e22-4f43-a758-f973ca88ff24	93c594b1-ff2b-4fe8-9ec7-8c7022141ab6	0	2	0	2026-06-01 09:53:27.4335	0
1232dbe9-2c9e-460a-80a0-0b50d54c0cf8	14a515c8-6e22-4f43-a758-f973ca88ff24	a5ee558b-c2b4-400e-9f90-1b1bbaf525a5	0	0	0	2026-06-01 09:53:29.160307	0
\.


--
-- Data for Name: completed_workouts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.completed_workouts (id, user_id, workout_id, completed_at, session_id) FROM stdin;
324bca59-d947-473c-92e7-8cc69f7ed769	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-06 12:10:53.70574+02	61337ae7-e97a-4594-b35d-9efd56d3037d
6ccc9fa9-6a15-4eda-ba4b-528d2503af3b	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-06 12:24:38.021971+02	f6da058f-475d-49ff-9871-b076bfb1c6a9
0f3a6133-79e5-4bb9-aff3-59f66d16f0dd	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-07 12:17:02.815951+02	3a33ed9b-5490-4f15-9ea9-abaf36f93b0e
e2e33410-db82-45fa-a7f4-5f0ab3d55e1e	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-08 19:06:12.079051+02	cd93463c-cb20-4211-a80b-58b647566f85
\.


--
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercises (id, name) FROM stdin;
c19a0c67-5aa8-4a3b-b110-23c41c875527	1
98c6b1f9-8a69-4b7d-976f-d8f78bf91459	2
b6997df0-82ff-4c3b-87a7-98609093f21e	3
6b956f1b-1f5e-40ef-b84f-266751fee58e	4
95237bfc-f34b-4582-9d6f-5777f5727cf7	5
6fbef146-d218-4338-9c5d-5ba25c7994d7	1
5257ea3f-3c57-4912-8a6a-bb424500c127	2
4cc84122-5f13-4a10-8be4-ed31e2a1d0ee	3
81990334-8b55-49cf-a688-8eddca487885	4
22953496-2a6e-4419-81fd-9c9130d2cc8c	asd
cfa1059d-da67-4533-bddc-d1dac83a02f1	b
ba0ecfb5-7878-4342-8dea-5bf605be25cd	c
851bac77-5e40-4e76-8cd1-4c8a28b0702d	ac
b67dcfcc-fc67-4196-b0fe-9d8505479b9f	1
\.


--
-- Data for Name: sets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sets (id, workout_exercise_id, set_order, reps, weight, duration) FROM stdin;
fffd52c0-ea85-41fc-8ef5-671273115d2c	33420114-4978-45fd-9666-4470b23d17bd	1	12	1.00	6
38a5a58b-be7a-419e-926f-7c1c69e0c3b9	33420114-4978-45fd-9666-4470b23d17bd	2	1	0.00	20
360176e4-f67e-4357-a6ef-1c4ae60f002e	700898ec-32ec-4268-8905-cdceed095da5	1	1	0.00	\N
b9db2611-3e36-4936-8a76-c74fcafed15c	57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	1	1	0.00	\N
6c03e2df-8f73-4b1f-9e47-515e6f1f949d	967412bf-4874-4e14-a4c9-6377b919ae41	1	1	0.00	\N
cd4d04d0-20a5-491a-a95b-e05e0c35cbde	700898ec-32ec-4268-8905-cdceed095da5	2	1	0.00	\N
ec2645b6-f607-478f-ad22-1e4727ffd765	a0423468-de09-41d8-a3b5-f20d44f1ff59	1	12	0.00	\N
106bf9f9-43ce-4cf5-9bf1-8b480f9dd82a	19a6e277-01f9-4899-b134-d83728b8093c	2	2	1.00	\N
5fee822c-5db0-4dc9-857d-1c2372fd24bc	19a6e277-01f9-4899-b134-d83728b8093c	1	2	0.00	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, created_at, email, verified, verification_token, verification_token_expires) FROM stdin;
af7778bc-f412-4f4a-aba1-b8a662bdd5b2	bob	$2b$10$VIfGYCtxJ3jpcKk4hRoE5evv5iSuMZk2XNLFC.lCvQQ.u4dE1OUZi	2026-05-04 12:16:09.549846	\N	\N	\N	\N
1f9e3063-cccb-4998-8335-dd36ae7e05fc	bob1	$2b$10$EC/npc9ExjA5YI5RbIJ/.O5lQu4l.yOmrVG0dYSyt5DbDEQ7/cObW	2026-05-05 12:12:33.925595	\N	\N	\N	\N
02c4fc4a-5d41-46ed-bf5c-176e13908008	Etern	$2b$10$pey2qvH.6wkclsrIToFDhe5QwM7dpMOn.QL5etEsdJWqYSBROsC96	2026-06-01 09:32:26.07708	\N	\N	\N	\N
82bfa113-f556-46cd-bddc-69b81954fc10	vasili	$2b$10$Ws/TehuynBZBf/BgI9ew9uBGmBk6ckTbfYjgclLpDQIoT9Q4tayS6	2026-06-06 12:30:54.953883	btriantafyllidis45@gmail.com	\N	b8adf9f89772d969a3c184d97e1470a3feead623acaf794660368f3ab8a000d9	2026-06-07 13:30:54.951
d98c39ac-0f73-4dda-a5dc-72af1756f94f	vas	$2b$10$k7rDauHWb9T3GVHMRjhSSe2.4Al55w/egI0nhZK1aGqQoaW.plnfW	2026-06-04 12:15:23.5272	btriantafyllidis18@gmail.com	\N	\N	\N
211839ac-f5ae-4bd4-bef1-df32017622b4	vasil	$2b$10$n/HrAOUPwESJ/E5FYsZPze0LJh//k5.F3dEcvv5V0VUIL6/1n.WuK	2026-06-06 19:48:28.054791	vtrian3@gmail.com	\N	b9efa82a079b9383b9fef17dd2dc269dadc7a70dba28cb62d650f9931fde9456	2026-06-07 20:48:23.38
dd0375e5-650b-4e8a-8793-8dc2cfa2d28d	box	$2b$10$DtP1/wxfRNGi2YPHrP7JfujRNlvatY0rN/HrhC.e00qvII/qAimUe	2026-06-11 14:35:12.659341	vtarsiial@gmail.com	\N	0e133c3cc8587172aa5d5401bf104c2691575834ac8745043d43bab39ef88c7a	2026-06-12 15:35:12.657
\.


--
-- Data for Name: workout_exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workout_exercises (id, workout_id, exercise_id, exercise_order, created_at, rest_between_sets, rest_after_exercise, type) FROM stdin;
45d61e5b-1374-4700-9456-a808e74dee77	d6542a95-ec35-4543-9e3b-3eaae1c1f59c	95237bfc-f34b-4582-9d6f-5777f5727cf7	5	2026-05-04 12:16:23.392476	60	180	reps
700898ec-32ec-4268-8905-cdceed095da5	eabe1b6b-54f5-4cce-9c00-bb7783124029	6fbef146-d218-4338-9c5d-5ba25c7994d7	1	2026-05-05 12:12:54.007173	60	180	reps
57f4ee00-19c8-45b3-bb1a-b4b4cbeb8e79	eabe1b6b-54f5-4cce-9c00-bb7783124029	4cc84122-5f13-4a10-8be4-ed31e2a1d0ee	2	2026-05-05 12:12:56.485216	60	180	reps
33420114-4978-45fd-9666-4470b23d17bd	eabe1b6b-54f5-4cce-9c00-bb7783124029	5257ea3f-3c57-4912-8a6a-bb424500c127	3	2026-05-05 12:12:55.27796	60	180	reps
a0423468-de09-41d8-a3b5-f20d44f1ff59	b7ef7564-eccd-46c6-ac8d-900f8c59f407	22953496-2a6e-4419-81fd-9c9130d2cc8c	1	2026-05-06 11:57:03.337967	60	180	reps
4fb082ce-fd3a-473c-a0e1-e68ad1a194bc	d6542a95-ec35-4543-9e3b-3eaae1c1f59c	98c6b1f9-8a69-4b7d-976f-d8f78bf91459	2	2026-05-04 12:16:19.662202	60	180	reps
93c594b1-ff2b-4fe8-9ec7-8c7022141ab6	389743bf-bcb7-4ce2-855f-5c07a1ec4e27	cfa1059d-da67-4533-bddc-d1dac83a02f1	2	2026-06-01 09:32:40.368995	60	180	reps
a5ee558b-c2b4-400e-9f90-1b1bbaf525a5	389743bf-bcb7-4ce2-855f-5c07a1ec4e27	ba0ecfb5-7878-4342-8dea-5bf605be25cd	3	2026-06-01 09:42:17.660766	60	180	reps
3c3b416b-c5f3-490b-965b-4869979690f6	d6542a95-ec35-4543-9e3b-3eaae1c1f59c	b6997df0-82ff-4c3b-87a7-98609093f21e	3	2026-05-04 12:16:20.919244	60	180	reps
83e266a2-9d57-4488-9a9c-204888a0e203	d6542a95-ec35-4543-9e3b-3eaae1c1f59c	c19a0c67-5aa8-4a3b-b110-23c41c875527	4	2026-05-04 12:16:18.086035	60	180	reps
d2b50868-6955-4ab0-bc9a-dba586978f32	d6542a95-ec35-4543-9e3b-3eaae1c1f59c	6b956f1b-1f5e-40ef-b84f-266751fee58e	1	2026-05-04 12:16:22.048431	60	180	reps
19a6e277-01f9-4899-b134-d83728b8093c	389743bf-bcb7-4ce2-855f-5c07a1ec4e27	851bac77-5e40-4e76-8cd1-4c8a28b0702d	1	2026-06-01 09:32:39.037315	0	0	reps
b4470e33-09b8-4352-b511-f2c9eeb45ac3	f2351c29-f6e0-4179-b83c-3932cd0c95ac	b67dcfcc-fc67-4196-b0fe-9d8505479b9f	1	2026-06-11 13:28:40.818319	60	180	reps
967412bf-4874-4e14-a4c9-6377b919ae41	eabe1b6b-54f5-4cce-9c00-bb7783124029	81990334-8b55-49cf-a688-8eddca487885	4	2026-05-05 12:12:57.630343	60	180	reps
\.


--
-- Data for Name: workout_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workout_sessions (id, user_id, workout_id, started_at, ended_at, status, last_activity, progress) FROM stdin;
ece3dd0a-1a2f-4419-8fec-5ed32a0cab27	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-05 12:25:22.871292+02	2026-05-06 11:55:53.524832+02	DISCARDED	2026-05-05 12:25:22.871292+02	\N
2f7ec1f4-620f-4106-a803-f09103f368e9	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-06 11:56:09.396388+02	2026-05-06 11:57:08.667005+02	DISCARDED	2026-05-06 11:56:09.396388+02	\N
cd93463c-cb20-4211-a80b-58b647566f85	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-08 18:37:33.633084+02	2026-05-08 19:06:12.114951+02	FINISHED	2026-05-08 19:06:00.44019+02	{"restUntil": "2026-05-08T17:06:00.431Z", "setNumber": 0, "workout_exercise_id": "967412bf-4874-4e14-a4c9-6377b919ae41"}
ca8bfb42-4ca3-4c3d-b5fb-0ce56cccdb19	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-07 13:00:24.391852+02	2026-05-07 13:12:17.964909+02	DISCARDED	2026-05-07 13:05:09.809908+02	{"setNumber": 0, "workout_exercise_id": "967412bf-4874-4e14-a4c9-6377b919ae41"}
61337ae7-e97a-4594-b35d-9efd56d3037d	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-06 12:09:13.602386+02	2026-05-06 12:10:53.836653+02	FINISHED	2026-05-06 12:10:53.654343+02	{"setNumber": 0, "workout_exercise_id": "967412bf-4874-4e14-a4c9-6377b919ae41"}
0ef4ec6a-9aaf-44b9-950b-0630bd2ba9ec	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-08 19:29:58.76563+02	\N	active	2026-05-08 19:30:35.101768+02	{"restUntil": "2026-05-08T17:31:34.946Z", "setNumber": 1, "workout_exercise_id": "33420114-4978-45fd-9666-4470b23d17bd"}
f6da058f-475d-49ff-9871-b076bfb1c6a9	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-06 12:23:56.582054+02	2026-05-06 12:24:38.152863+02	FINISHED	2026-05-06 12:24:37.971373+02	{"setNumber": 0, "workout_exercise_id": "967412bf-4874-4e14-a4c9-6377b919ae41"}
14a515c8-6e22-4f43-a758-f973ca88ff24	02c4fc4a-5d41-46ed-bf5c-176e13908008	389743bf-bcb7-4ce2-855f-5c07a1ec4e27	2026-06-01 09:53:22.322739+02	2026-06-01 09:53:36.474857+02	DISCARDED	2026-06-01 09:53:29.160307+02	{"restUntil": "2026-06-01T07:56:29.151Z", "setNumber": 0, "workout_exercise_id": "a5ee558b-c2b4-400e-9f90-1b1bbaf525a5"}
6bc356de-2aa7-4ea9-bd53-8d704d522920	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-06 12:24:40.43293+02	2026-05-07 12:15:50.861003+02	DISCARDED	2026-05-06 12:40:39.873763+02	{"setNumber": 1, "workout_exercise_id": "33420114-4978-45fd-9666-4470b23d17bd"}
e53b69aa-1eda-4fb1-a5ce-6d53c007c352	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-07 12:15:52.873728+02	2026-05-07 12:16:33.646777+02	DISCARDED	2026-05-07 12:16:30.340576+02	{"setNumber": 0, "workout_exercise_id": "967412bf-4874-4e14-a4c9-6377b919ae41"}
23ccedf2-726c-4da9-9295-21b15d792ce4	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-07 13:12:20.176471+02	2026-05-08 10:24:39.290128+02	DISCARDED	2026-05-07 17:55:22.428476+02	{"restUntil": "2026-05-07T15:58:22.344Z", "setNumber": 0, "workout_exercise_id": "33420114-4978-45fd-9666-4470b23d17bd"}
3a33ed9b-5490-4f15-9ea9-abaf36f93b0e	1f9e3063-cccb-4998-8335-dd36ae7e05fc	eabe1b6b-54f5-4cce-9c00-bb7783124029	2026-05-07 12:16:35.095495+02	2026-05-07 12:17:02.86576+02	FINISHED	2026-05-07 12:16:59.392635+02	{"setNumber": 0, "workout_exercise_id": "967412bf-4874-4e14-a4c9-6377b919ae41"}
\.


--
-- Data for Name: workouts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workouts (id, user_id, name, created_at) FROM stdin;
d6542a95-ec35-4543-9e3b-3eaae1c1f59c	af7778bc-f412-4f4a-aba1-b8a662bdd5b2	test	2026-05-04 12:16:15.645838
eabe1b6b-54f5-4cce-9c00-bb7783124029	1f9e3063-cccb-4998-8335-dd36ae7e05fc	test	2026-05-05 12:12:51.123715
b7ef7564-eccd-46c6-ac8d-900f8c59f407	1f9e3063-cccb-4998-8335-dd36ae7e05fc	asd	2026-05-06 11:56:59.957952
389743bf-bcb7-4ce2-855f-5c07a1ec4e27	02c4fc4a-5d41-46ed-bf5c-176e13908008	Push	2026-06-01 09:32:35.766051
f2351c29-f6e0-4179-b83c-3932cd0c95ac	d98c39ac-0f73-4dda-a5dc-72af1756f94f	asdf	2026-06-06 15:35:28.457552
\.


--
-- Name: completed_sets completed_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_sets
    ADD CONSTRAINT completed_sets_pkey PRIMARY KEY (id);


--
-- Name: completed_workouts completed_workouts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_workouts
    ADD CONSTRAINT completed_workouts_pkey PRIMARY KEY (id);


--
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);


--
-- Name: sets sets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT sets_pkey PRIMARY KEY (id);


--
-- Name: sets sets_workout_exercise_id_set_order_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT sets_workout_exercise_id_set_order_key UNIQUE (workout_exercise_id, set_order);


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
-- Name: workout_exercises workout_exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_pkey PRIMARY KEY (id);


--
-- Name: workout_exercises workout_exercises_workout_id_exercise_order_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_workout_id_exercise_order_key UNIQUE (workout_id, exercise_order);


--
-- Name: workout_sessions workout_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_sessions
    ADD CONSTRAINT workout_sessions_pkey PRIMARY KEY (id);


--
-- Name: workouts workouts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workouts
    ADD CONSTRAINT workouts_pkey PRIMARY KEY (id);


--
-- Name: idx_completed_sets_session_exercise; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_completed_sets_session_exercise ON public.completed_sets USING btree (session_id, workout_exercise_id);


--
-- Name: idx_workouts_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_workouts_user_id ON public.workouts USING btree (user_id);


--
-- Name: one_active_session_per_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX one_active_session_per_user ON public.workout_sessions USING btree (user_id) WHERE (status = 'active'::text);


--
-- Name: completed_sets completed_sets_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_sets
    ADD CONSTRAINT completed_sets_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.workout_sessions(id) ON DELETE CASCADE;


--
-- Name: completed_sets completed_sets_workout_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_sets
    ADD CONSTRAINT completed_sets_workout_exercise_id_fkey FOREIGN KEY (workout_exercise_id) REFERENCES public.workout_exercises(id) ON DELETE CASCADE;


--
-- Name: completed_workouts completed_workouts_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_workouts
    ADD CONSTRAINT completed_workouts_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.workout_sessions(id) ON DELETE CASCADE;


--
-- Name: completed_workouts completed_workouts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_workouts
    ADD CONSTRAINT completed_workouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: completed_workouts completed_workouts_workout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_workouts
    ADD CONSTRAINT completed_workouts_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(id) ON DELETE CASCADE;


--
-- Name: sets sets_workout_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT sets_workout_exercise_id_fkey FOREIGN KEY (workout_exercise_id) REFERENCES public.workout_exercises(id) ON DELETE CASCADE;


--
-- Name: workout_exercises workout_exercises_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id);


--
-- Name: workout_exercises workout_exercises_workout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(id) ON DELETE CASCADE;


--
-- Name: workout_sessions workout_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_sessions
    ADD CONSTRAINT workout_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: workout_sessions workout_sessions_workout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_sessions
    ADD CONSTRAINT workout_sessions_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(id) ON DELETE CASCADE;


--
-- Name: workouts workouts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workouts
    ADD CONSTRAINT workouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict P0fa6QRBHa728pquD1BEsWZy62afo55f0BLE6dcb591RIJevMvXJaDQy1upay8p

