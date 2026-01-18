--
-- PostgreSQL database dump
--

\restrict ki6GMJdtXdNOUrWAQqB9IexQpEt3wakjl4YaTJouiy07cuOhwfLvd9TUhVM0NPB

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

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
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.blog_posts (id, title, slug, excerpt, content, status, published_at, reading_time_minutes, view_count, featured, series, series_order, cover_image_url, created_at, updated_at) FROM stdin;
4e333988-c045-4981-aba6-f2276a5d59c1	Observatory Client Project	observatory-client	MSc software engineering semester 1 project	Working in a group of 4 we were tasked with developing a website for the university's observatory, allowing users to make bookings and remotely access the observatory controls.	published	2026-01-12 15:13:07.566087+00	\N	0	t	\N	\N	\N	2026-01-12 15:01:12.796303+00	2026-01-12 15:41:42.994358+00
\.


--
-- Data for Name: education; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.education (id, degree, institution, field_of_study, start_date, end_date, grade, description, slug, display_order, created_at, updated_at) FROM stdin;
d7e0e8ba-86df-4851-a6cc-cb9372f35411	BSc Physics with hons	University of Salford	Physics	2020-09-18	2024-05-14	2:2	Physics degree, with a dissertation in High pressure physics	bsc-physics	2	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
551c9163-f63b-4185-b51b-6d82e3147517	MSc Software Engineering	Cardiff University	Software Engineering	2025-09-22	2026-09-22	N/A	Conversion Course into software engineering	msc-software	1	2025-12-20 14:21:02.041745+00	2026-01-12 01:16:00.697662+00
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.modules (id, education_id, name, code, grade, credits, semester, description, detailed_content, display_order, created_at, updated_at) FROM stdin;
2d4b9adc-a597-49f9-9e0a-6cecc0320f5c	551c9163-f63b-4185-b51b-6d82e3147517	Programming Principles and practice	CMT653	Ongoing	15	1	Introduction to Java and different programming paradigms	{"topics": ["Java", "Object Oriented", "Unit Testing"], "projects": ["Booking system", "Observatory Client Project"], "assessment": "Coursework building a command line booking system and aspects of the Client project"}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
1013bbdd-1597-4272-9127-3a6d8258b2d2	551c9163-f63b-4185-b51b-6d82e3147517	Agile Software Development	CMT651	Ongoing	15	1	Basics of Agile working, SCRUM, INVEST, user stories etc. effective use of Git	{"topics": ["SCRUM", "User Stories", "Git"], "projects": ["Observatory client project"], "assessment": "Coursework surronding Agile working in Client project"}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
d679495c-5f5f-454a-9d2b-7c18cfe7cba4	551c9163-f63b-4185-b51b-6d82e3147517	DevOps	CMT654	N/a	15	2	Not delivered yet	{"topics": ["topic 1"], "projects": ["project 1"], "assessment": "N/A"}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
b4a38bb9-8512-43e0-b905-e5a53229e883	551c9163-f63b-4185-b51b-6d82e3147517	Delivering User Experience	CMT656	N/a	15	2	Not delivered yet	{"topics": ["topic 1"], "projects": ["project 1"], "assessment": "N/A"}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
f9e4f770-0c18-4bd2-8ea6-be56854293ec	551c9163-f63b-4185-b51b-6d82e3147517	Manipulating and exploiting data	CMT655	N/a	15	2	Not delivered yet	{"topics": ["topic 1"], "projects": ["project 1"], "assessment": "N/A"}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
c1a8fca0-7fc8-4346-95b9-bbb3f96e7d4d	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Foundation Mathematics 1	G1000014	76	20	1	Foundation mathematics module covering core mathematical concepts.	{"academic_year": "2020/21", "year_of_study": 1}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
b2063f9b-9597-4367-a4d3-e0136595ab81	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Foundation Mathematics 2	G1000015	93	20	1	Advanced foundation mathematics building on core concepts.	{"academic_year": "2020/21", "year_of_study": 1}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
be38f75d-6675-4a03-a375-91637518b66b	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Foundation Physics A	F3000015	77	20	1	Introduction to fundamental physics principles and concepts.	{"academic_year": "2020/21", "year_of_study": 1}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
4c020ec1-af94-4aeb-89a8-2ec894550ac8	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Foundation Physics B	F3000016	65	20	1	Continuation of fundamental physics principles.	{"academic_year": "2020/21", "year_of_study": 1}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
f756b15f-3e24-4442-be83-ddfb188a2367	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Foundation Physics Laboratory	F3000017	41	20	1	Practical laboratory work in physics.	{"academic_year": "2020/21", "year_of_study": 1}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
d6c6d16d-631a-48c5-bd5a-2c0b892cd22c	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Foundation IT and Study Skills	F3000018	40	20	1	IT skills and study techniques for physics students.	{"academic_year": "2020/21", "year_of_study": 1}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
004ec336-a9cc-42b2-af71-89a283d7351f	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Mechanics, Relativity and Quantum Physics	F30010036	74	20	2	Core concepts in mechanics, special relativity, and quantum physics.	{"academic_year": "2021/22", "year_of_study": 2}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
bc2f0ddb-1e2a-428f-88ad-fce1cc37fe79	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Electricity, Magnetism and Light	F30010037	60	20	2	Electromagnetic theory and optics.	{"academic_year": "2021/22", "year_of_study": 2}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
e95d8b36-0abe-4da8-b11c-3a17fc4291ad	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Modelling of Physical Systems	F30010038	47	20	2	Mathematical and computational modeling of physical systems.	{"academic_year": "2021/22", "year_of_study": 2}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
41883c85-1666-4cbf-a321-2ce82777ddb4	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Mathematics	F30010039	80	20	2	Advanced mathematics for physics applications.	{"academic_year": "2021/22", "year_of_study": 2}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
3b18febb-98c8-4cb8-b981-1d99b364ade2	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Physics in Context	F30010040	57	20	2	Applications of physics in real-world contexts.	{"academic_year": "2021/22", "year_of_study": 2}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
d4b3746a-8958-4928-a62e-2535419e0921	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Physics Laboratory 1	F30010041	57	20	2	Practical laboratory experiments in physics.	{"academic_year": "2021/22", "year_of_study": 2}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
7f44a030-464f-40a5-83af-f2ea321db683	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Physics Laboratory 2	F30020041	47	20	3	Advanced laboratory experiments and techniques.	{"academic_year": "2022/23", "year_of_study": 3}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
53210b32-27cc-4a5c-8fb5-7fc12cd0ac07	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Group Project	F30020045	47	20	3	Collaborative physics research project.	{"academic_year": "2022/23", "year_of_study": 3}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
3419d334-3c31-4b0c-b44d-4f5badd58898	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Electromagnetism	F30020040	40	20	3	Advanced electromagnetic theory and applications.	{"academic_year": "2022/23", "year_of_study": 3}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
eb08d915-7047-4e71-bbfe-9b6a63fdf883	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Thermal Physics	F30020042	44	20	3	Thermodynamics and statistical mechanics.	{"academic_year": "2022/23", "year_of_study": 3}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
2854a9d3-280a-4914-953b-c7556acf6018	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Quantum Physics	F30020043	50	20	3	Advanced quantum mechanics and applications.	{"academic_year": "2022/23", "year_of_study": 3}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
dcf1d74a-f584-42e8-a61d-ecc78970b8f5	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Waves & Optics	F30020044	32	20	3	Wave phenomena and optical physics.	{"academic_year": "2022/23", "year_of_study": 3}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
22ac5a06-10a4-4174-9164-1112ef5a447c	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Nuclear & Particle Physics	F30030091	33	20	4	Study of nuclear structure and particle physics.	{"academic_year": "2023/24", "year_of_study": 4}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
750e15f3-7736-45ca-b26c-162e5044d111	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Physics Laboratory 3	F30030095	70	20	4	Final year advanced laboratory work.	{"academic_year": "2023/24", "year_of_study": 4}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
a126e6b0-feca-4b57-86fd-bdace90cefb3	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Condensed Matter Physics	F30030094	55	20	4	Physics of solids and condensed matter systems.	{"academic_year": "2023/24", "year_of_study": 4}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
d5466188-f2bc-4925-98d6-1e77310dc602	d7e0e8ba-86df-4851-a6cc-cb9372f35411	Astrophysics and Planetary Physics	F30030096	50	20	4	Physics of celestial bodies and planetary systems.	{"academic_year": "2023/24", "year_of_study": 4}	0	2025-12-20 14:21:02.041745+00	2025-12-20 14:21:02.041745+00
543c3f7b-4bfc-4389-8708-cea5df41f04d	551c9163-f63b-4185-b51b-6d82e3147517	Web Development	CMT652	N/A	15	1	Web development and servside programming	{"content": "JavaScript, Spring and a client project"}	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:20:10.615417+00
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.projects (id, name, slug, short_description, full_description, status, start_date, end_date, github_url, live_url, featured, difficulty_level, image_url, demo_video_url, display_order, view_count, created_at, updated_at) FROM stdin;
7fbb2e98-e0ee-4758-bc8a-197458a54d4f	University: Observatory Project	Observatory-Project	Semester 1 client project	Worked in a group to design a website for the universities Physics department to allow remote access to the observatory, primarily in this project worked on Java, Javascript and some Go microservices to allow for FITS files to be converted into PNG	active	\N	\N	N/A	N/A	t	intermediate	/uploads/projects/3fbafb5b-6d97-4056-905c-186a1f97f7de.png	\N	0	8	2026-01-12 00:38:55.538445+00	2026-01-12 15:25:30.007075+00
3d059b3d-d01a-4024-a796-2f93024c4b5a	Full-Stack Portfolio Site	portfolio-site	Production-ready portfolio site with Go backend, PostgreSQL database, and Next.js frontend	A comprehensive portfolio platform built from scratch to showcase professional work and document continuous learning. The backend features a RESTful API built with Go and Fiber framework, PostgreSQL database with 12 normalized tables, Redis caching, and proper database design including UUID primary keys, JSONB fields, and automated triggers. The frontend uses Next.js 15 with TypeScript, Tailwind CSS, and modern React patterns. Key features include dynamic content management, interactive CV with nested module details, blog system with tagging and series support, universal content linking system connecting projects to skills and blog posts, and analytics tracking. The project demonstrates full-stack development skills, database architecture, API design, and modern web development practices.	active	2025-12-10	\N	\N	\N	t	intermediate	\N	\N	0	2	2025-12-20 14:21:02.041745+00	2026-01-12 14:40:08.450853+00
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.skills (id, name, category, proficiency_level, years_experience, status, first_learned_date, last_used_date, description, icon, display_order, created_at, updated_at) FROM stdin;
2b4cbff6-e89a-4161-8b28-ca09c95ceb75	Unit Testing	Tools	51	\N	active	\N	\N	\N	check-circle	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:44:59.249065+00
ab133ede-fbe3-458b-9f6d-aaa99e10f419	Git	Tools	51	\N	active	\N	\N	\N	git-branch	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:01.445935+00
eef6caf2-29be-425a-854f-7605236dde4a	Agile/SCRUM	Tools	52	\N	active	\N	\N	\N	users	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:03.528262+00
f5e035b6-15f6-460c-b4e8-af75fc289646	Redis	Backend	51	\N	active	\N	\N	\N	server	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:08.422194+00
ee0761c8-cb85-41f0-86fc-8f552f6744dd	PostgreSQL	Backend	52	\N	active	\N	\N	\N	database	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:09.426483+00
c86e9511-22ff-4501-bf93-3f3be7906f07	Fiber	Backend	51	\N	active	\N	\N	\N	zap	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:11.504073+00
ab9362d3-1ed8-4284-b1a4-1f11b15046d1	sqlx	Backend	51	\N	active	\N	\N	\N	database	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:12.895333+00
bd203cb9-fea3-4efd-bc42-ceac0a11733e	REST APIs	Backend	52	\N	active	\N	\N	\N	network	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:14.967996+00
4cccf436-eff5-43c2-9439-8d7dd6a828e8	Docker	Backend	52	\N	active	\N	\N	\N	container	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:17.183822+00
b3f8c6d6-234f-4de7-a372-e1be85dd8ba7	Spring	Backend	52	\N	active	\N	\N	\N	leaf	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:19.844246+00
3b5b916d-d536-4764-8a17-57dc8353847c	Go	Backend	75	1.0	active	2024-12-01	\N	\N	code	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:23.344923+00
c0c23c78-e57e-4c2c-b33d-07f6af7e722c	HTML	Frontend	52	\N	active	\N	\N	\N	code	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:28.363478+00
7e0d735c-fb59-45e7-8f9d-ca1170f88f8b	CSS	Frontend	52	\N	active	\N	\N	\N	palette	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:29.262643+00
76cf1411-ff86-46d9-8f8c-d45ddf5a76e5	JavaScript	Frontend	53	\N	active	\N	\N	\N	code	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:30.843935+00
7dbd1107-62aa-484d-9b30-139522ff5c08	TypeScript	Frontend	53	\N	active	\N	\N	\N	code	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:32.210332+00
12744f58-f237-4f2a-a254-8ba0aeeeebc6	React	Frontend	52	\N	active	\N	\N	\N	layout	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:32.961649+00
7c6c82bb-b11f-4f05-b908-53262d3f8467	Next.js	Frontend	53	\N	active	\N	\N	\N	zap	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:34.880329+00
6979af4e-a3ce-45e1-b157-51010c9729da	Tailwind CSS	Frontend	52	\N	active	\N	\N	\N	palette	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:36.09704+00
55249c6e-8c3e-494c-90c6-41b19f338380	Java	Languages	53	\N	active	\N	\N	\N	code	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:38.110184+00
eead2ffe-c982-46ef-9131-881a0ead57d5	Python	Languages	53	\N	active	\N	\N	\N	code	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:39.826875+00
da463558-c6f9-408a-96c4-944dcc0b36e8	MATLAB	Data	51	\N	active	\N	\N	\N	calculator	0	2025-12-20 14:21:02.041745+00	2026-01-12 00:45:41.409118+00
48ee9121-cfa5-42f4-9d7c-4de1c028683e	RUST	Backend	1	0.0	active	\N	\N	\N	code	0	2026-01-12 00:59:26.634241+00	2026-01-12 00:59:26.634241+00
\.


--
-- Data for Name: project_skills; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.project_skills (project_id, skill_id, is_primary) FROM stdin;
3d059b3d-d01a-4024-a796-2f93024c4b5a	3b5b916d-d536-4764-8a17-57dc8353847c	t
3d059b3d-d01a-4024-a796-2f93024c4b5a	ee0761c8-cb85-41f0-86fc-8f552f6744dd	t
3d059b3d-d01a-4024-a796-2f93024c4b5a	7dbd1107-62aa-484d-9b30-139522ff5c08	t
3d059b3d-d01a-4024-a796-2f93024c4b5a	12744f58-f237-4f2a-a254-8ba0aeeeebc6	t
3d059b3d-d01a-4024-a796-2f93024c4b5a	7c6c82bb-b11f-4f05-b908-53262d3f8467	t
3d059b3d-d01a-4024-a796-2f93024c4b5a	6979af4e-a3ce-45e1-b157-51010c9729da	t
3d059b3d-d01a-4024-a796-2f93024c4b5a	f5e035b6-15f6-460c-b4e8-af75fc289646	f
3d059b3d-d01a-4024-a796-2f93024c4b5a	c86e9511-22ff-4501-bf93-3f3be7906f07	f
3d059b3d-d01a-4024-a796-2f93024c4b5a	ab9362d3-1ed8-4284-b1a4-1f11b15046d1	f
3d059b3d-d01a-4024-a796-2f93024c4b5a	bd203cb9-fea3-4efd-bc42-ceac0a11733e	f
3d059b3d-d01a-4024-a796-2f93024c4b5a	4cccf436-eff5-43c2-9439-8d7dd6a828e8	f
7fbb2e98-e0ee-4758-bc8a-197458a54d4f	3b5b916d-d536-4764-8a17-57dc8353847c	f
7fbb2e98-e0ee-4758-bc8a-197458a54d4f	76cf1411-ff86-46d9-8f8c-d45ddf5a76e5	f
7fbb2e98-e0ee-4758-bc8a-197458a54d4f	55249c6e-8c3e-494c-90c6-41b19f338380	f
7fbb2e98-e0ee-4758-bc8a-197458a54d4f	b3f8c6d6-234f-4de7-a372-e1be85dd8ba7	f
7fbb2e98-e0ee-4758-bc8a-197458a54d4f	c0c23c78-e57e-4c2c-b33d-07f6af7e722c	f
7fbb2e98-e0ee-4758-bc8a-197458a54d4f	7e0d735c-fb59-45e7-8f9d-ca1170f88f8b	f
7fbb2e98-e0ee-4758-bc8a-197458a54d4f	bd203cb9-fea3-4efd-bc42-ceac0a11733e	f
7fbb2e98-e0ee-4758-bc8a-197458a54d4f	eef6caf2-29be-425a-854f-7605236dde4a	f
\.


--
-- PostgreSQL database dump complete
--

\unrestrict ki6GMJdtXdNOUrWAQqB9IexQpEt3wakjl4YaTJouiy07cuOhwfLvd9TUhVM0NPB

