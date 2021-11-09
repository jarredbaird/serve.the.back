--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 13.4

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
-- Name: ensure_qualified(integer, integer); Type: FUNCTION; Schema: public; Owner: jarred
--

CREATE FUNCTION public.ensure_qualified(r_id integer, u_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
declare
  user_qualified integer;
begin
  select count(*)
  into user_qualified
  from user_qualified_roles uqr
  where uqr.r_id = $1 and uqr.u_id = $2;

  return user_qualified;
end;
$_$;


ALTER FUNCTION public.ensure_qualified(r_id integer, u_id integer) OWNER TO jarred;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: event_template_required_roles; Type: TABLE; Schema: public; Owner: jarred
--

CREATE TABLE public.event_template_required_roles (
    etrr_id integer NOT NULL,
    r_id integer,
    et_id integer
);


ALTER TABLE public.event_template_required_roles OWNER TO jarred;

--
-- Name: event_template_required_roles_etrr_id_seq; Type: SEQUENCE; Schema: public; Owner: jarred
--

CREATE SEQUENCE public.event_template_required_roles_etrr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.event_template_required_roles_etrr_id_seq OWNER TO jarred;

--
-- Name: event_template_required_roles_etrr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jarred
--

ALTER SEQUENCE public.event_template_required_roles_etrr_id_seq OWNED BY public.event_template_required_roles.etrr_id;


--
-- Name: event_templates; Type: TABLE; Schema: public; Owner: jarred
--

CREATE TABLE public.event_templates (
    et_id integer NOT NULL,
    et_name text NOT NULL,
    et_descr text,
    m_id integer
);


ALTER TABLE public.event_templates OWNER TO jarred;

--
-- Name: event_templates_e_id_seq; Type: SEQUENCE; Schema: public; Owner: jarred
--

CREATE SEQUENCE public.event_templates_e_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.event_templates_e_id_seq OWNER TO jarred;

--
-- Name: event_templates_e_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jarred
--

ALTER SEQUENCE public.event_templates_e_id_seq OWNED BY public.event_templates.et_id;


--
-- Name: ministries; Type: TABLE; Schema: public; Owner: jarred
--

CREATE TABLE public.ministries (
    m_id integer NOT NULL,
    m_name text NOT NULL
);


ALTER TABLE public.ministries OWNER TO jarred;

--
-- Name: ministries_m_id_seq; Type: SEQUENCE; Schema: public; Owner: jarred
--

CREATE SEQUENCE public.ministries_m_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ministries_m_id_seq OWNER TO jarred;

--
-- Name: ministries_m_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jarred
--

ALTER SEQUENCE public.ministries_m_id_seq OWNED BY public.ministries.m_id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: jarred
--

CREATE TABLE public.roles (
    r_id integer NOT NULL,
    r_title text NOT NULL,
    m_id integer
);


ALTER TABLE public.roles OWNER TO jarred;

--
-- Name: roles_r_id_seq; Type: SEQUENCE; Schema: public; Owner: jarred
--

CREATE SEQUENCE public.roles_r_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_r_id_seq OWNER TO jarred;

--
-- Name: roles_r_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jarred
--

ALTER SEQUENCE public.roles_r_id_seq OWNED BY public.roles.r_id;


--
-- Name: scheduled_events; Type: TABLE; Schema: public; Owner: jarred
--

CREATE TABLE public.scheduled_events (
    se_id integer NOT NULL,
    et_id integer,
    location text NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL
);


ALTER TABLE public.scheduled_events OWNER TO jarred;

--
-- Name: scheduled_events_se_id_seq; Type: SEQUENCE; Schema: public; Owner: jarred
--

CREATE SEQUENCE public.scheduled_events_se_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.scheduled_events_se_id_seq OWNER TO jarred;

--
-- Name: scheduled_events_se_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jarred
--

ALTER SEQUENCE public.scheduled_events_se_id_seq OWNED BY public.scheduled_events.se_id;


--
-- Name: scheduled_users; Type: TABLE; Schema: public; Owner: jarred
--

CREATE TABLE public.scheduled_users (
    su_id integer NOT NULL,
    se_id integer,
    u_id integer,
    etrr_id integer
);


ALTER TABLE public.scheduled_users OWNER TO jarred;

--
-- Name: scheduled_users_su_id_seq; Type: SEQUENCE; Schema: public; Owner: jarred
--

CREATE SEQUENCE public.scheduled_users_su_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.scheduled_users_su_id_seq OWNER TO jarred;

--
-- Name: scheduled_users_su_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jarred
--

ALTER SEQUENCE public.scheduled_users_su_id_seq OWNED BY public.scheduled_users.su_id;


--
-- Name: user_qualified_roles; Type: TABLE; Schema: public; Owner: jarred
--

CREATE TABLE public.user_qualified_roles (
    uqr_id integer NOT NULL,
    u_id integer,
    r_id integer
);


ALTER TABLE public.user_qualified_roles OWNER TO jarred;

--
-- Name: user_qualified_roles_uqr_id_seq; Type: SEQUENCE; Schema: public; Owner: jarred
--

CREATE SEQUENCE public.user_qualified_roles_uqr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_qualified_roles_uqr_id_seq OWNER TO jarred;

--
-- Name: user_qualified_roles_uqr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jarred
--

ALTER SEQUENCE public.user_qualified_roles_uqr_id_seq OWNED BY public.user_qualified_roles.uqr_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: jarred
--

CREATE TABLE public.users (
    u_id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    last text,
    first text,
    active boolean DEFAULT true NOT NULL,
    is_admin boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO jarred;

--
-- Name: users_u_id_seq; Type: SEQUENCE; Schema: public; Owner: jarred
--

CREATE SEQUENCE public.users_u_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_u_id_seq OWNER TO jarred;

--
-- Name: users_u_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jarred
--

ALTER SEQUENCE public.users_u_id_seq OWNED BY public.users.u_id;


--
-- Name: event_template_required_roles etrr_id; Type: DEFAULT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.event_template_required_roles ALTER COLUMN etrr_id SET DEFAULT nextval('public.event_template_required_roles_etrr_id_seq'::regclass);


--
-- Name: event_templates et_id; Type: DEFAULT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.event_templates ALTER COLUMN et_id SET DEFAULT nextval('public.event_templates_e_id_seq'::regclass);


--
-- Name: ministries m_id; Type: DEFAULT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.ministries ALTER COLUMN m_id SET DEFAULT nextval('public.ministries_m_id_seq'::regclass);


--
-- Name: roles r_id; Type: DEFAULT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.roles ALTER COLUMN r_id SET DEFAULT nextval('public.roles_r_id_seq'::regclass);


--
-- Name: scheduled_events se_id; Type: DEFAULT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.scheduled_events ALTER COLUMN se_id SET DEFAULT nextval('public.scheduled_events_se_id_seq'::regclass);


--
-- Name: scheduled_users su_id; Type: DEFAULT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.scheduled_users ALTER COLUMN su_id SET DEFAULT nextval('public.scheduled_users_su_id_seq'::regclass);


--
-- Name: user_qualified_roles uqr_id; Type: DEFAULT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.user_qualified_roles ALTER COLUMN uqr_id SET DEFAULT nextval('public.user_qualified_roles_uqr_id_seq'::regclass);


--
-- Name: users u_id; Type: DEFAULT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.users ALTER COLUMN u_id SET DEFAULT nextval('public.users_u_id_seq'::regclass);


--
-- Data for Name: event_template_required_roles; Type: TABLE DATA; Schema: public; Owner: jarred
--

COPY public.event_template_required_roles (etrr_id, r_id, et_id) FROM stdin;
1	6	1
2	7	1
40	1	15
41	17	15
42	18	15
43	1	1
44	2	1
45	3	1
46	4	1
47	5	1
48	17	1
49	18	1
50	19	1
51	8	1
52	9	1
53	15	1
54	16	1
55	21	1
56	11	1
57	10	1
58	1	16
59	14	16
60	22	16
61	12	17
62	7	18
63	9	18
64	6	18
65	15	18
66	16	18
67	8	18
68	20	18
71	22	23
\.


--
-- Data for Name: event_templates; Type: TABLE DATA; Schema: public; Owner: jarred
--

COPY public.event_templates (et_id, et_name, et_descr, m_id) FROM stdin;
15	Men's Common Table - All Church	All men are welcome at this common table. Often it will meet in the form of monthly meet up's at church, but can also be scheduled for one-off events as well.	\N
1	Sunday Morning Service	A general sunday morning service. All ministries will be required every Sunday, but not all roles will be required	3
16	Women's Common Table - All Church	All women are welcome at this common table. Often it will meet in the form of monthly meet up's at church, but can also be scheduled for one-off events as well.	\N
17	Teach Table - New Testament	An educational gathering. Come learn more about the Bible and our faith as church.	\N
18	Weekday Prayer - All Church	All are welcome here. Will require a worship team, a staff leader, and a congregation prayer leader.	\N
23	Date Night	Parents watch others' kids for the evening	\N
\.


--
-- Data for Name: ministries; Type: TABLE DATA; Schema: public; Owner: jarred
--

COPY public.ministries (m_id, m_name) FROM stdin;
1	Wakey Wakey
3	Worship
2	Kingdom Heroes
6	Welcome Team
4	Teaching
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: jarred
--

COPY public.roles (r_id, r_title, m_id) FROM stdin;
4	Host / Check-In	2
2	Barista Assistant	1
10	Greeter	6
11	Usher	6
12	Theological	4
13	Prophetic	4
14	Staff Teacher	4
7	Electric Guitar	3
8	Piano	3
1	Barista Master	1
9	Sound Board	3
6	Bass Guitar	3
15	Drumset	3
16	Vocals	3
5	Lower Assistant KH	2
17	Upper Assistant KH	2
18	Upper Head Teacher KH	2
19	Lower Head Teacher KH	2
20	General Teaching	4
21	Sunday Morning - Main Service Speaker	4
3	Wakey Cashier	1
22	General Childcare	2
\.


--
-- Data for Name: scheduled_events; Type: TABLE DATA; Schema: public; Owner: jarred
--

COPY public.scheduled_events (se_id, et_id, location, start_time, end_time) FROM stdin;
1	1	sanctuary	2021-10-31 00:00:00-04	2021-10-31 00:00:00-04
3	1	Main Sanctuary	2021-11-04 10:30:00-04	2021-11-04 12:00:00-04
4	17	church	2021-10-26 16:09:53.443-04	2021-10-26 17:30:00.443-04
5	1	8200 Bell Ln, Vienna, VA 22182	2021-11-21 09:00:00-05	2021-11-21 12:00:00-05
6	1	Church	2021-11-28 09:00:00-05	2021-11-28 12:00:00-05
7	23	Lorien Wood	2021-11-22 17:30:49-05	2021-11-22 19:30:00-05
8	16	Jen Baird's House 	2021-12-17 17:00:00-05	2021-12-17 18:00:00-05
\.


--
-- Data for Name: scheduled_users; Type: TABLE DATA; Schema: public; Owner: jarred
--

COPY public.scheduled_users (su_id, se_id, u_id, etrr_id) FROM stdin;
68	5	11	47
3	1	11	45
4	3	16	48
5	1	20	48
7	5	39	43
32	5	16	48
33	6	16	48
36	5	37	46
37	6	37	46
\.


--
-- Data for Name: user_qualified_roles; Type: TABLE DATA; Schema: public; Owner: jarred
--

COPY public.user_qualified_roles (uqr_id, u_id, r_id) FROM stdin;
9	11	1
10	11	2
11	11	3
12	11	4
13	11	5
14	11	19
16	11	22
24	24	19
25	15	1
26	20	17
27	15	18
28	23	5
29	34	3
30	21	5
31	22	5
32	14	17
33	19	17
34	14	18
35	17	17
36	16	17
37	20	18
38	37	4
42	28	1
43	33	1
44	31	3
45	27	3
46	38	3
47	32	10
48	32	11
49	35	4
50	35	5
51	35	18
52	35	17
53	35	19
54	35	22
55	39	1
56	39	2
57	39	3
58	39	10
59	39	11
62	34	10
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jarred
--

COPY public.users (u_id, username, password, last, first, active, is_admin) FROM stdin;
27	arachne@verizon.net	$2b$12$ezra4pPuYZfM9iL3Us28gexlm4jW8WMWkRUVQiYX3WNUjFaFCzQZu	English	Matt	t	f
28	manuals@verizon.net	$2b$12$RL8MsJgSSa72Qgb3QoGakuVoVeZ9k/v6GFypODkWDl9K0KmagU.3a	Quinn	Joey	t	f
29	wkrebs@live.com	$2b$12$66O9VR1N5lCkTQL0fH0Jv.ulywh9FATllORG.ZzBKQ//MnIYryWJ2	Schwartz	Izzy	t	f
14	cosimo@outlook.com	$2b$12$gZueJGqo0Wp7IOGCV7P1AuEMq27MI2EQnS0MqGYk8vduxOKXO54QG	Wang	Bekah	t	f
15	sartak@aol.com	$2b$12$HUQtpbWcbbKCRPhkX9XJku2DSjBzHGa0UwJoP66SmOPhcMjHugLGa	Beard	Gabe	t	f
16	aracne@yahoo.ca	$2b$12$bmz.POITse0AOboz45zq/.98.nqqcRyGkW8bE0mJgC8gp23xLnmHi	Werner	Taylor	t	f
17	msroth@hotmail.com	$2b$12$LbW3bPbVCml5/b0GjcnezuUqaPM4IQJikiS21wFepfSb581CJ8mAK	Mccarty	Robin	t	f
18	lridener@yahoo.com	$2b$12$BJE2W4Z6RAAZON7r3qSJN.VOfZV94VZKuQiZYs6zy3oN4ziC9hhGW	Salazar	Joanna	t	f
19	horrocks@live.com	$2b$12$YJXGmQ0syj5r1Wq8HOQ66uwkte/OCT5a8i/UzWlFNUlxFmeil0SDK	Martin	John	t	f
20	cfhsoft@comcast.net	$2b$12$uqiH7RIeoGsOiBsZ8TWke.Up5MrJwLvKAl3VrkaQdmlhWDeNMI4fG	Meyer	Maddie	t	f
21	padme@aol.com	$2b$12$fqeXHbdqYFht3K9RGnNkTu.SKsNPSad.A2viv/rBqzFU1TMMP4CJu	Montoya	Gabrielle	t	f
22	leviathan@verizon.net	$2b$12$aobk3vilneYBFpIMkuKF9upTYOld..c/3pSN6aeyhaT0CHkpYaQ4K	Stout	Monique	t	f
23	mpiotr@hotmail.com	$2b$12$eag8Q3xMCfbPuqrfdjVF6.GBYMXg/Unq63F22GoRH6DeENFnbypBO	Sanders	Michelle	t	f
24	kobayasi@verizon.net	$2b$12$So/Afdm6Iqbwgql8jjq/QehRH/tNCCRK6L9H2Csvv1IzqJ3gjmQFC	Bautista	Amy	t	f
26	dgriffith@live.com	$2b$12$B5qymU5HosL38azfpU9mruWcy0L5CruzndyO46PkkVt3UNOQRQP7S	Adams	Genevieve	t	f
30	solomon@verizon.net	$2b$12$WUIyJrHaayPS3qBODKgtNuib4dhnFKf5ChSyv.HPelkMQ.p8J4zly	Rose	Krista	t	f
31	gomor@optonline.net	$2b$12$KQjc9avtGhIGwqY8aaxKbuRtvlKjeVvtLDBDa6E2U2zOr.BAhSCIO	Bray	Liz	t	f
32	fmtbebuck@msn.com	$2b$12$BHK2jrmxruxh6vwERua9zOyaGcXB42t/Ho47JmCOVsKlis.oCuUYq	Donovan	Angela	t	f
33	dwsauder@comcast.net	$2b$12$raQWLI0Jjusjx3R/0IZ4cuym0Bxs8mLFRy8dUBq/j9T65c/AHtCSy	Weiss	Abigail	t	f
34	tromey@me.com	$2b$12$tl8JGNzubTkhhm0RPFL/Je3nKPepOmmBFkVMJAlI2GBjzCA1EOo/e	Vasquez	Tifa	t	t
35	seurat@hotmail.com	$2b$12$2zQrXv/3CuGolz/lipmDE.1wRcvu1k9CVTApop6gLGeMewJrfF2oG	Mullen	Christa	t	t
13	vganesh@yahoo.ca	$2b$12$I43te/aQAXYuciOnmYcA5ezSX.jYgSwsV3Cj.VLLHWlvQQuFUqcmu	Marshall	Evil	t	f
37	kempsonc@outlook.com	$2b$12$xxGoPr3XOI4oXLx3aUNt2.67cdVnTMCgBTgcERe.LgDJqOdFG1rGS	Campos	Jason	t	f
38	mgreen@aol.com	$2b$12$fhSA4eFrwwL./qe0Ebse6ubmqhYARLZ1Kve9JbrgUrvrueKOnnhtO	Palmer	Patrick	t	f
11	giafly@live.com	$2b$12$lJrIdGHCO4MW9WKiCuoTMu6Qyrtdx9NKz2l1Af7spTquQpmMVdvqi	Kramer	Jarred	t	t
39	tubesteak@sbcglobal.net	$2b$12$XrWVKBTzBmnzev6KtTurqO9V7E8vYvqbA1j1L9rDukYfVcfvWcJ2S	Pitts	Common	t	f
\.


--
-- Name: event_template_required_roles_etrr_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jarred
--

SELECT pg_catalog.setval('public.event_template_required_roles_etrr_id_seq', 71, true);


--
-- Name: event_templates_e_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jarred
--

SELECT pg_catalog.setval('public.event_templates_e_id_seq', 23, true);


--
-- Name: ministries_m_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jarred
--

SELECT pg_catalog.setval('public.ministries_m_id_seq', 6, true);


--
-- Name: roles_r_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jarred
--

SELECT pg_catalog.setval('public.roles_r_id_seq', 22, true);


--
-- Name: scheduled_events_se_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jarred
--

SELECT pg_catalog.setval('public.scheduled_events_se_id_seq', 8, true);


--
-- Name: scheduled_users_su_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jarred
--

SELECT pg_catalog.setval('public.scheduled_users_su_id_seq', 69, true);


--
-- Name: user_qualified_roles_uqr_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jarred
--

SELECT pg_catalog.setval('public.user_qualified_roles_uqr_id_seq', 62, true);


--
-- Name: users_u_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jarred
--

SELECT pg_catalog.setval('public.users_u_id_seq', 39, true);


--
-- Name: event_template_required_roles event_template_required_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.event_template_required_roles
    ADD CONSTRAINT event_template_required_roles_pkey PRIMARY KEY (etrr_id);


--
-- Name: event_templates event_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.event_templates
    ADD CONSTRAINT event_templates_pkey PRIMARY KEY (et_id);


--
-- Name: ministries ministries_pkey; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.ministries
    ADD CONSTRAINT ministries_pkey PRIMARY KEY (m_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (r_id);


--
-- Name: scheduled_events scheduled_events_pkey; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.scheduled_events
    ADD CONSTRAINT scheduled_events_pkey PRIMARY KEY (se_id);


--
-- Name: scheduled_users scheduled_users_etrr_id_se_id_key; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.scheduled_users
    ADD CONSTRAINT scheduled_users_etrr_id_se_id_key UNIQUE (etrr_id, se_id);


--
-- Name: scheduled_users scheduled_users_pkey; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.scheduled_users
    ADD CONSTRAINT scheduled_users_pkey PRIMARY KEY (su_id);


--
-- Name: scheduled_users scheduled_users_se_id_u_id_key; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.scheduled_users
    ADD CONSTRAINT scheduled_users_se_id_u_id_key UNIQUE (se_id, u_id);


--
-- Name: user_qualified_roles user_qualified_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.user_qualified_roles
    ADD CONSTRAINT user_qualified_roles_pkey PRIMARY KEY (uqr_id);


--
-- Name: user_qualified_roles user_qualified_roles_r_id_u_id_key; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.user_qualified_roles
    ADD CONSTRAINT user_qualified_roles_r_id_u_id_key UNIQUE (r_id, u_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (u_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: event_template_required_roles event_template_required_roles_et_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.event_template_required_roles
    ADD CONSTRAINT event_template_required_roles_et_id_fkey FOREIGN KEY (et_id) REFERENCES public.event_templates(et_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_template_required_roles event_template_required_roles_r_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.event_template_required_roles
    ADD CONSTRAINT event_template_required_roles_r_id_fkey FOREIGN KEY (r_id) REFERENCES public.roles(r_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_templates event_templates_ministry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.event_templates
    ADD CONSTRAINT event_templates_ministry_id_fkey FOREIGN KEY (m_id) REFERENCES public.ministries(m_id);


--
-- Name: roles roles_ministry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ministry_id_fkey FOREIGN KEY (m_id) REFERENCES public.ministries(m_id);


--
-- Name: scheduled_events scheduled_events_e_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.scheduled_events
    ADD CONSTRAINT scheduled_events_e_id_fkey FOREIGN KEY (et_id) REFERENCES public.event_templates(et_id);


--
-- Name: scheduled_users scheduled_users_etrr_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.scheduled_users
    ADD CONSTRAINT scheduled_users_etrr_id_fkey FOREIGN KEY (etrr_id) REFERENCES public.event_template_required_roles(etrr_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: scheduled_users scheduled_users_scheduled_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.scheduled_users
    ADD CONSTRAINT scheduled_users_scheduled_event_fkey FOREIGN KEY (se_id) REFERENCES public.scheduled_events(se_id);


--
-- Name: scheduled_users scheduled_users_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.scheduled_users
    ADD CONSTRAINT scheduled_users_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.users(u_id);


--
-- Name: user_qualified_roles user_qualified_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.user_qualified_roles
    ADD CONSTRAINT user_qualified_roles_role_id_fkey FOREIGN KEY (r_id) REFERENCES public.roles(r_id);


--
-- Name: user_qualified_roles user_qualified_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jarred
--

ALTER TABLE ONLY public.user_qualified_roles
    ADD CONSTRAINT user_qualified_roles_user_id_fkey FOREIGN KEY (u_id) REFERENCES public.users(u_id);


--
-- PostgreSQL database dump complete
--

