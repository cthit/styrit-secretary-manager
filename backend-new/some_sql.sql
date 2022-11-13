--
-- PostgreSQL database dump
--

-- Dumped from database version 15.0 (Debian 15.0-1.pgdg110+1)
-- Dumped by pg_dump version 15.0 (Debian 15.0-1.pgdg110+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: archivecode; Type: TABLE; Schema: public; Owner: secretary
--

CREATE TABLE public.archivecode (
    meeting uuid NOT NULL,
    archive_location text NOT NULL,
    code uuid NOT NULL
);


ALTER TABLE public.archivecode OWNER TO secretary;

--
-- Name: config; Type: TABLE; Schema: public; Owner: secretary
--

CREATE TABLE public.config (
    key text NOT NULL,
    value text NOT NULL,
    config_type text NOT NULL,
    description text DEFAULT 'none'::text NOT NULL
);


ALTER TABLE public.config OWNER TO secretary;

--
-- Name: configtype; Type: TABLE; Schema: public; Owner: secretary
--

CREATE TABLE public.configtype (
    type text NOT NULL
);


ALTER TABLE public.configtype OWNER TO secretary;

--
-- Name: group; Type: TABLE; Schema: public; Owner: secretary
--

CREATE TABLE public."group" (
    name text NOT NULL,
    display_name text NOT NULL
);


ALTER TABLE public."group" OWNER TO secretary;

--
-- Name: groupmeeting; Type: TABLE; Schema: public; Owner: secretary
--

CREATE TABLE public.groupmeeting (
    group_group text NOT NULL,
    group_year text NOT NULL,
    meeting uuid NOT NULL,
    code uuid NOT NULL
);


ALTER TABLE public.groupmeeting OWNER TO secretary;

--
-- Name: groupmeetingfile; Type: TABLE; Schema: public; Owner: secretary
--

CREATE TABLE public.groupmeetingfile (
    group_task_group_group_group text NOT NULL,
    group_task_group_group_year text NOT NULL,
    group_task_group_meeting uuid NOT NULL,
    group_task_task text NOT NULL,
    file_location text NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.groupmeetingfile OWNER TO secretary;

--
-- Name: groupmeetingtask; Type: TABLE; Schema: public; Owner: secretary
--

CREATE TABLE public.groupmeetingtask (
    group_group_group text NOT NULL,
    group_group_year text NOT NULL,
    group_meeting uuid NOT NULL,
    task text NOT NULL
);


ALTER TABLE public.groupmeetingtask OWNER TO secretary;

--
-- Name: groupyear; Type: TABLE; Schema: public; Owner: secretary
--

CREATE TABLE public.groupyear (
    "group" text NOT NULL,
    year text NOT NULL,
    finished boolean NOT NULL
);


ALTER TABLE public.groupyear OWNER TO secretary;

--
-- Name: meeting; Type: TABLE; Schema: public; Owner: secretary
--

CREATE TABLE public.meeting (
    id uuid NOT NULL,
    year integer NOT NULL,
    date timestamp without time zone NOT NULL,
    last_upload timestamp without time zone NOT NULL,
    lp integer NOT NULL,
    meeting_no integer NOT NULL,
    check_for_deadline boolean NOT NULL
);


ALTER TABLE public.meeting OWNER TO secretary;

--
-- Name: task; Type: TABLE; Schema: public; Owner: secretary
--

CREATE TABLE public.task (
    name text NOT NULL,
    display_name text NOT NULL
);


ALTER TABLE public.task OWNER TO secretary;

--
-- Data for Name: archivecode; Type: TABLE DATA; Schema: public; Owner: secretary
--

COPY public.archivecode (meeting, archive_location, code) FROM stdin;
cb2e9be8-bb2b-4663-8c44-0830be007b7f	archives/documents_lp3_0_2020	76588895-d1f3-4545-b08b-5f053918cd78
475f5eaf-1d3c-469f-b712-c368d143efbe	archives/documents_lp2_0_2019	0e19a99c-16f2-4a0b-9e33-7f989dbf5c96
00c538b8-470c-4e14-ab31-efd323086102	archives/documents_lp4_0_2020	3e644971-9ca8-4af6-978f-5afa6ca37af2
3d4ad9ec-a03a-432f-9570-a4eb9a698886	archives/documents_lp1_0_2020	bdcd28c1-f4b3-4364-8bc3-b840d1e89488
8c36696f-6bbe-4420-ba26-7839af9041a4	archives/documents_lp2_0_2020	e2eacac6-6d4d-4538-be5b-44880e257919
cc892b3e-936b-4799-b0aa-b46c340a4b13	archives/documents_lp3_0_2021	ab30dd9d-bf84-4968-8109-7b2b3ccf079a
b69fb3af-3140-4d8c-b498-cebf5a86d1b2	archives/documents_lp4_0_2021	20983ec3-b180-4dd8-9658-436d9e04068d
c1b76f1c-3ed7-4852-ae5c-7498603793d3	archives/documents_lp2_0_2021	d0b40872-cc87-478d-9d4f-01a9b1789094
f9687302-9d51-4d31-9080-f60059976a0e	archives/documents_lp1_0_2021	7c5d9311-9ba6-4908-9cc7-c78953133c8e
84b0c794-3670-40f4-9f9a-e69ce67b94c0	archives/documents_lp3_0_2022	b4c0fc82-b9fa-4393-8faf-5a0db70ac1b7
ade47d19-0ad1-48db-a200-6833b98a6058	archives/documents_lp4_0_2022	86ecde52-a1b9-475e-be83-e27317057484
dc1a605e-75ee-410a-be31-ec128297f6da	archives/documents_lp1_0_2022	e38e9008-5a64-4278-aeb2-b54b704bb9f7
\.


--
-- Data for Name: config; Type: TABLE DATA; Schema: public; Owner: secretary
--

COPY public.config (key, value, config_type, description) FROM stdin;
archive_base_url	secretary.chalmers.it/api/archive/download	string	The base url to download archives from (used in emails to the board)
document_template_url	https://www.overleaf.com/read/nczbknjmcpzk	string	The template overleaf document for the different reports (used in the emails)
gotify_url	http://gotify:8080/mail	string	The url to the gotify service
secretary_email	sekreterare@chalmers.it	string	The email to the secretary
board_email	styrit@chalmers.it	string	The email to the board
group_email_domain	@chalmers.it	string	The domain to send emails to
from_email_address	admin@chalmers.it	string	The email to send from
mail_to_groups_subject	Dokument till sektionsmote - Deadline {deadline_date}	string	The subject for "regular" email sendout (that goes out to all active groups that have documents to turn in for the meeting). \n\nDescription of the formatting values:  \n\n - {group_name} = The display name of the group \n\n - {meeting_day} = The day of month for the meeting \n\n - {meeting_month} = The month (number) of the meeting \n\n - {deadline_time} = The deadline time (hh:mm) \n\n - {deadline_date} = The deadline date (dd/mm) \n\n - {task_list} = A list of the tasks that the group should upload \n\n - {frontend_url} = The url to the website \n\n - {group_code} = Their unique code \n\n - {template_url} = The document (overleaf) template url \n\n - {secretary_email} = The email to the secretary \n\n - {board_display_name} = The display name of the board \n\n - {board_email} = The email to the board
mail_to_board_subject	Dokument för sektionsmote {meeting_number} lp {meeting_lp}	string	The subject of the email that is sent to the board upon reaching the deadline.  \n\nDescription of the formatting values:  \n\n - {board_name} = The display name of the board \n\n - {meeting_number} = The number of the meeting (usually 0) \n\n - {meeting_lp} = The study period of the meeting \n\n - {meeting_archive_url} = A link to the archive download \n\n - {secretary_email} = The email to the secretary
frontend_url	secretary.chalmers.it	string	The url to this frontend page (used for links in the emails)
mail_for_stories_subject	Dokument till sektionsmote - Deadline {deadline_date}	string	The subject of the email that is sent to the "story groups" (i.e. the groups that needs to turn in eberattelser / vberattelser. \n\nDescription of the formatting values:  \n\n - {group_name_year} = Display name of the group. \n\n - {meeting_day} = The day of month that the meeting will take place \n\n - {meeting_month} = The month (number) of the meeting \n\n - {deadline_time} = The deadline time \n\n - {deadline_date} = The deadline date \n\n - {task_list} = A list of the tasks that the group will have to turn in. \n\n - {frontend_url} = A url to the frontend (upload page) \n\n - {group_code} = Their unique code \n\n - {template_url} = A link the overleaf template for the documents. \n\n - {secretary_email} = The email to the secretary \n\n - {board_display_name} = The display name of the board \n\n - {board_email} = The email to the board \n\n - {meeting_number} = The number of the meeting that study period (usually 0) \n\n - {meeting_lp} = The study period
board_display_name	styrIT	string	The display name of the board
minutes_after_deadline_to_mail	5	number	The amount of minutes to wait extra after the deadline before sending the email to the board
check_for_deadline_frequency	5	number	The frequence (in minutes) to check if any deadlines have been reached
possible_years_back_for_stories	5	number	The number of years back that one should be able to select story groups for (usually 5 due to tax reasons)
mail_to_board_message	--- English below ---\n\nHej {board_name}!\n\nDeadlinen för dokumentinsamling till sektionsmote {meeting_number} i LP {meeting_lp} är nu nådd.\nFör nedladdning av dessa dokument klicka på denna länk: {meeting_archive_url}\n\nVid frågor, kontakta sekreteraren på {secretary_email}\n\n\n\n\nHello {board_name}!\n\nDeadlinen for document collection for student devision meeting {meeting_number} in SP {meeting_lp} is now reached.\nTo download these documents press this link: {meeting_archive_url}\n\nVid frågor, kontakta sekreteraren på {secretary_email}	long_string	The contents of the email that is sent out to the board upon reaching the deadline. \n\nDescription of the formatting values:  \n\n - {board_name} = The display name of the board \n\n - {meeting_number} = The number of the meeting (usually 0) \n\n - {meeting_lp} = The study period of the meeting \n\n - {meeting_archive_url} = A link to the archive download \n\n - {secretary_email} = The email to the secretary
mail_to_groups_message	--- English below ---\n\nHej {group_name}!\n\nDen {meeting_day}/{meeting_month} är det dags för sektionsmöte och senast {deadline_time} den {deadline_date} behöver ni lämna in följande dokument: {task_list}\n\nDetta görs på sidan: {frontend_url}\nAnge koden: {group_code}\n\nMall för vissa dokument finns här: {template_url}\nGör en kopia av projektet (Menu -> Copy Project) och fyll i.\n\n\nFrån revisorerna:\nKassören ska även skicka in sin bokföring till revisorer@chalmers.it senast den 14/11.  Det som ska skickas in är:\n - Transaktionslista/bankutdrag för hela erat verksamhetsår. Namnge den "kommitténamn_trans.pdf"\n - Huvudbok för erat verksamhetsår, men som är under nuvarande styrIT år. Namnge den "kommitténamn_huvud.pdf"\n - Kontoanalys för fortnoxkontot som representerar ert bankkonto. Namnge det "kommitténamn_konto.pdf"\n\nDetta, med exempel, står även på howto.chalmers.it\n\n\nOm ni har några frågor eller stöter på några problem kan kan ni kontakta mig på {secretary_email} eller hela {board_display_name} på {board_email}. : )\n\n\n\n\nHello {group_name}!\n\nThe {meeting_day}/{meeting_month} it's time for the student devision meeting and no later than {deadline_time} the {deadline_date} you need to have handed in the following documents: {task_list}\n\nYou can hand them in on this page: {frontend_url}\nUse the code: {group_code}\n\nTemplate for some of the ducuments can be found here: {template_url}\nMake a copy of the project (Menu -> Copy Project) and fill it in.\n\nFrom the auditors:\nThe treasurer should also send his/her bookkeeping to revisorer@chalmers.it 14/11 at the latest.  What should be handed in is:\n - Transaction list/bank statements (Transaktionslista/bankutdrag) for your entire financial year. Name it "committeename_trans.pdf"\n - Ledger (Huvudbok) for your financial year, but only the part that's during the current styrIT year (starting 07-01). Name it "committeename_huvud.pdf"\n - Account analysis (Kontoanalys) for the fortnox account that represents your bank account. Name it "committeename_konto.pdf"\n\nThis, with examples, can also be found at howto.chalmers.it (in swedish)\n\n\nIf you have any questions or encounter any problems, you can contact me at {secretary_email} or {board_display_name} at {board_email}. : )	long_string	The body of the "regular" emails (the ones that are sent to all the active groups that should turn in documents for the meeting).  \n\nDescription of the formatting values:  \n\n - {group_name} = The display name of the group \n\n - {meeting_day} = The day of month for the meeting \n\n - {meeting_month} = The month (number) of the meeting \n\n - {deadline_time} = The deadline time (hh:mm) \n\n - {deadline_date} = The deadline date (dd/mm) \n\n - {task_list} = A list of the tasks that the group should upload \n\n - {frontend_url} = The url to the website \n\n - {group_code} = Their unique code \n\n - {template_url} = The document (overleaf) template url \n\n - {secretary_email} = The email to the secretary \n\n - {board_display_name} = The display name of the board \n\n - {board_email} = The email to the board
mail_for_stories	--- English below ---\n\nHej {group_name_year}!\n\nNu är det äntligen dags att bli ansvarsbefriade!\nDen {meeting_day}/{meeting_month} är det dags för sektionsmöte och senast {deadline_time} den {deadline_date} behöver ni lämna in följande dokument: {task_list}\n\nDetta görs på sidan: {frontend_url}\nAnge koden: {group_code}\n\nMall för vissa dokument finns här: {template_url}\nGör en kopia av projektet (Menu -> Copy Project) och fyll i.\n\nKontakta revisorerna på revisorer@chalmers.it för mer information om vad som behövs göras innan ni kan bli rekommenderade att bli ansvarsbefriade.\n\nOm ni har några frågor eller stöter på några problem kan ni kontakta mig på {secretary_email} eller hela {board_display_name} på {board_email}. : )\n\n\n\n\nHello {group_name_year}!\n\nIt's finally time to get discharged from liability!\nThe {meeting_day}/{meeting_month} it's time for the student devision meeting and no later than {deadline_time} the {deadline_date} you need to have handed in\n the following documents: {task_list}\n\nYou can hand them in on this page: {frontend_url}\nUse the code: {group_code}\n\nTemplate for some of the ducuments can be found here: {template_url}\nMake a copy of the project (Menu -> Copy Project) and fill it in.\n\n\nContact the auditors at revisorer@chalmers.it for more information of what needs to be done before you can be recommended for discharge of liability.\n\nIf you have any questions or encounter any problems, you can contact me at {secretary_email} or {board_display_name} at {board_email}. : )	long_string	The body of the email that is sent to the "story groups" (i.e. the groups that needs to turn in eberattelser / vberattelser) \n\nDescription of the formatting values:  \n\n - {group_name_year} = Display name of the group. \n\n - {meeting_day} = The day of month that the meeting will take place \n\n - {meeting_month} = The month (number) of the meeting \n\n - {deadline_time} = The deadline time \n\n - {deadline_date} = The deadline date \n\n - {task_list} = A list of the tasks that the group will have to turn in. \n\n - {frontend_url} = A url to the frontend (upload page) \n\n - {group_code} = Their unique code \n\n - {template_url} = A link the overleaf template for the documents. \n\n - {secretary_email} = The email to the secretary \n\n - {board_display_name} = The display name of the board \n\n - {board_email} = The email to the board \n\n - {meeting_number} = The number of the meeting that study period (usually 0) \n\n - {meeting_lp} = The study period
\.


--
-- Data for Name: configtype; Type: TABLE DATA; Schema: public; Owner: secretary
--

COPY public.configtype (type) FROM stdin;
long_string
string
number
\.


--
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: secretary
--

COPY public."group" (name, display_name) FROM stdin;
armit	ArmIT
digit	digIT
fanbarerit	FanbärerIT
fritid	frITid
mrcit	MRCIT
nollkit	NollKIT
prit	P.R.I.T.
sexit	sexIT
snit	snIT
styrit	styrIT
equalit	EqualIT
flashit	FlashIT
tradgardsmasterit	TrädgårdsmästerIT
\.


--
-- Data for Name: groupmeeting; Type: TABLE DATA; Schema: public; Owner: secretary
--

COPY public.groupmeeting (group_group, group_year, meeting, code) FROM stdin;
armit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	dbeffdd1-e49b-4c14-a965-9128da7bae32
digit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	885ffa19-fb2b-43a4-b43f-50a56d84e419
fanbarerit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	8f86a981-b533-4af5-8195-72bfb17cd15e
fritid	active	475f5eaf-1d3c-469f-b712-c368d143efbe	626f6bf0-7f80-4337-92eb-24bce3919593
mrcit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	9e8dcb5e-d27b-4d98-8ba9-3450ede9f511
nollkit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	895b85ba-8f69-4dbb-9f73-14b240898fb2
prit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	16f76f1e-c919-4313-8381-d17e3a9cee68
sexit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	edbe733c-bec6-4eff-887e-95f5860235d2
snit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	cca366e1-79ca-4eef-8ea4-f0ac324a023d
styrit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	b1b43c1e-6dd2-4602-bae4-dbc82f321681
armit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	2564f575-5141-46d7-8177-7cd140c413b3
digit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	0b5b11f7-2242-48f6-958e-f4346d2b34cd
fanbarerit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	90077b45-3ee0-4e49-a303-8dc0cc8d3a2c
fritid	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	64d2f595-b124-4174-a2cc-27439869138f
mrcit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	d10a42a2-e5c6-4ce4-afbf-688f90f6d166
nollkit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	4e733b59-16a2-43dc-a981-bec238be9a6b
prit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	f2976753-0f82-472b-9a84-673c3643fcf2
sexit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	dae6ab32-ef2c-48ea-9348-1d2e50ccfbba
snit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	a442cd68-412c-401b-95ae-790a6abffd99
styrit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	29cf24e0-3202-4fcd-8141-51c284852ad1
armit	active	00c538b8-470c-4e14-ab31-efd323086102	59f8fb74-8296-4846-b4fb-7f0cf32d34a6
digit	active	00c538b8-470c-4e14-ab31-efd323086102	5e7b2e34-66a7-4c08-969f-74e03b236804
fanbarerit	active	00c538b8-470c-4e14-ab31-efd323086102	5646d8bc-65d5-4035-96e1-22f94bdbacb7
fritid	active	00c538b8-470c-4e14-ab31-efd323086102	c3b5dc5b-569f-4f85-aa4e-33415a932747
mrcit	active	00c538b8-470c-4e14-ab31-efd323086102	cd6a3398-855c-43e5-babd-7ce9fe993d4c
nollkit	active	00c538b8-470c-4e14-ab31-efd323086102	7fc8d2d5-374d-4685-bbae-5e6aa74b5d36
prit	active	00c538b8-470c-4e14-ab31-efd323086102	629613d8-6d60-48ce-9e08-97bd09745ff7
sexit	active	00c538b8-470c-4e14-ab31-efd323086102	984b15ad-53bb-46f9-ae34-0064bcef02c0
snit	active	00c538b8-470c-4e14-ab31-efd323086102	1a10b20b-fcf9-48c5-b4bd-b5becfa45d9d
styrit	active	00c538b8-470c-4e14-ab31-efd323086102	7e21cf56-dd22-45e8-a5a1-952d26ef7832
styrit	2019	cb2e9be8-bb2b-4663-8c44-0830be007b7f	4c7724ea-7e13-426b-a035-f5c72cbc17ac
fanbarerit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	9e5bbcd0-ab38-4b1b-9a75-b4720bc2c6f1
fritid	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	7bf1d73c-7fa9-4af1-99a0-f0dc21d7682e
snit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	056ef49b-b05a-435f-88b6-aa2598ac5786
styrit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	f8874f44-a5e6-4434-b815-b928acd7a4eb
armit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	e2ad0c24-4fa0-468c-b329-ec0f22b1e555
digit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	26969111-53d2-4f97-b938-15c2346d3c56
mrcit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	140c937b-abca-43b9-9a8f-9c2b79386e7a
nollkit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	30287dc3-1a5a-461e-9225-156952b722e0
prit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	2ae684fd-1d30-4395-b643-f19b560c07b9
sexit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	40765f1c-98f9-4ae8-a27e-85ef896fc070
styrit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	4781967a-5bb8-4045-a395-71ca65dd5f73
prit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	911e9a2a-1528-4f82-804c-f249a022cfc3
sexit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	ae7244f7-1c05-47c4-a9a0-9c062bba2f09
armit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	30ae1e8b-3b7d-48dc-a094-f4cba550ad69
fritid	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	7a2fdd3e-6d81-4085-b4b6-a31c5466aaed
fanbarerit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	1b307794-bc10-4574-bd81-d76781f31646
snit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	7070cdde-0dd2-4e35-9251-698a70ac1729
equalit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	0a402904-59a4-4cd9-a763-23eb57cca86b
styrit	2019	00c538b8-470c-4e14-ab31-efd323086102	498f0a4f-f087-4dcb-bc15-fae007398c29
prit	2019	00c538b8-470c-4e14-ab31-efd323086102	76614090-19e9-4765-9a3c-6b48541b05ed
sexit	2019	00c538b8-470c-4e14-ab31-efd323086102	67344cff-a5f1-47ce-917e-5f7165afc384
armit	2019	00c538b8-470c-4e14-ab31-efd323086102	2e7a4932-9b49-40ec-b69d-867891d41d83
fritid	2019	00c538b8-470c-4e14-ab31-efd323086102	2b5c73be-8096-4dcb-94b3-9d9f29d69e76
fanbarerit	2019	00c538b8-470c-4e14-ab31-efd323086102	d49da52d-b1d8-424e-86b8-14699a950008
snit	2019	00c538b8-470c-4e14-ab31-efd323086102	87db60df-76fc-476d-831f-c2dff2af0bbe
equalit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	39c6402f-55e1-4049-95d5-b8f7291d7fe8
armit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	4b1f325c-a304-403a-b45d-249db83e0bcb
digit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	484f1a27-8623-4145-a9f5-2d0a5a93d9b6
fanbarerit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	9e424b84-3a68-408c-ac42-fd780e708a4f
fritid	active	8c36696f-6bbe-4420-ba26-7839af9041a4	553e37d9-2ea3-4cc8-a893-dda71f3e293d
mrcit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	6795514a-d97a-41f5-814a-4020d5db5f0f
nollkit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	d9805b3b-90e8-4500-bfc7-4e8a233016e5
prit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	84e4a263-4fca-4611-9ea2-f05812863073
sexit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	9d4a545b-442b-4ae1-9383-ef47ec70595b
snit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	4bb3ab9a-3af0-4c8d-bdb5-f5c5011d46a0
styrit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	afd16fab-84ee-4185-b55a-fff7d8e2e236
equalit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	c3abbb39-5a2e-4ea5-aff3-d96a32fb9fb7
styrit	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	c8cf925b-42e5-4b1f-9209-ea130a66ba53
armit	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	a57d5891-1d28-47db-8df9-662334bbf61d
fritid	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	06700d33-3bb8-4975-a60f-c1c946723f72
armit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	99c6b574-b730-478a-b4a8-3ed36e42856b
digit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	fb690ea5-2dd5-4ea0-a188-8377016af532
fanbarerit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	6dc96f40-c1e8-444e-ac9b-ec07596a68db
fritid	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	c8552881-1e89-4746-8cb1-3a0d12c9f265
mrcit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	e30aab3d-cef2-4655-80bd-c41e7bbae7c8
nollkit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	9d5fb0b8-f728-49b8-b47e-92d2c50df293
prit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	21b0e9a9-8664-4183-9124-c6ab0abe94c1
sexit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	5dc2014e-7bc1-4919-bf6f-4b50727a3074
snit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	ada1bb0c-e7d4-455f-b6d3-6e48fb6857be
styrit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	a8f9a5a9-1144-4162-b676-9e8f61a15465
equalit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	2e28086d-2be9-43b9-879d-7eff9e5635a4
prit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	16a511fc-4780-4071-b8ad-9435cbbbcd54
sexit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	712f6d90-531b-4acd-9f76-5d974799d419
nollkit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	2fa3b279-5bba-4ae1-bd8f-45f7f89a0338
mrcit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	a60877a2-b95a-4417-8265-e45023ca1be6
armit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	8425e9ce-ccd7-4068-b1aa-56da95d54c28
digit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	678e348e-42c5-49c8-bec3-4ee038c5f21a
flashit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	e2bb6837-b3ee-40dd-b92d-42ec0a2f9bc6
fanbarerit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	c463c2ca-b659-4090-854a-453d5ec75b86
fritid	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	78df34a7-1f1e-4f2e-b734-bc4d1057ca61
mrcit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	3f6b2dad-f904-4c5e-b249-296e8f215b03
nollkit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	411330be-cee1-41eb-8973-b26e1547f66a
prit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	98699040-0329-4bd8-91ea-b50462ee8924
sexit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	43377926-1a44-4a7d-9dfd-5046bbce8975
snit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	4714d0c1-2967-42f2-b386-643cdf11507c
styrit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	0173ef50-283d-4580-a0a2-6dff37ed3248
equalit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	c97106bf-f14d-4034-9dda-d7de6006870b
digit	2020	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	c7925301-01be-4f25-a139-a1c2508bb0d5
armit	2020	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	723558f5-8058-44b4-9284-4b7d022e495f
fanbarerit	active	f9687302-9d51-4d31-9080-f60059976a0e	b9e204f1-ec3f-424c-a7da-2f5e6e11d987
fritid	active	f9687302-9d51-4d31-9080-f60059976a0e	e2d3f452-71ec-4205-ad23-c02cc510d49b
snit	active	f9687302-9d51-4d31-9080-f60059976a0e	629423ca-62a4-4734-a882-5a14328b479a
styrit	active	f9687302-9d51-4d31-9080-f60059976a0e	6167980c-2bd3-4ba3-8215-ad26f6e6785f
equalit	active	f9687302-9d51-4d31-9080-f60059976a0e	57b1183e-8199-46ab-a670-df50f7de17f8
armit	active	f9687302-9d51-4d31-9080-f60059976a0e	a5794167-22cc-4e37-9eb5-f0a6ec28236a
digit	active	f9687302-9d51-4d31-9080-f60059976a0e	e56c8085-b60a-409d-bdfa-53fc2beb97b1
nollkit	active	f9687302-9d51-4d31-9080-f60059976a0e	8a99a8d4-4065-4252-be91-5a332e445be7
prit	active	f9687302-9d51-4d31-9080-f60059976a0e	06a2c6f8-a222-4ba9-992b-70e5bc896bf1
sexit	active	f9687302-9d51-4d31-9080-f60059976a0e	465ed6af-3616-4ab7-b18a-183659ec039f
flashit	active	f9687302-9d51-4d31-9080-f60059976a0e	21f0facc-cc64-4f54-b71d-5ad05d62e9b7
digit	2020	f9687302-9d51-4d31-9080-f60059976a0e	61ed1a4f-73b7-4327-a984-8e8ed1c6cce4
fritid	2020	f9687302-9d51-4d31-9080-f60059976a0e	7a7036a5-9961-447b-9359-0d4f5f8b60f9
fanbarerit	2020	f9687302-9d51-4d31-9080-f60059976a0e	5d2b2602-fb37-4630-aedc-727b3c0cd191
styrit	2020	f9687302-9d51-4d31-9080-f60059976a0e	21ad4e03-9d3e-4913-b9e5-1cf5609bd2c5
snit	2020	f9687302-9d51-4d31-9080-f60059976a0e	c92a2da0-32f2-493b-819b-e4d3e5acd7c2
equalit	2020	f9687302-9d51-4d31-9080-f60059976a0e	ee9043c7-8751-480a-9af0-95fa46291bcc
armit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	5e213dab-16d3-48a9-84d0-729f00f3dbed
digit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	7936a504-abe5-4c5e-a23b-8b0a0fe6966c
fanbarerit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	c2409ba2-48da-4068-922e-0eac03a3dc7b
fritid	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	abf9199a-7be7-46d9-b92e-4f0f5496bf38
nollkit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	36daa829-6582-4faf-a0b7-d145ccc1e9a0
prit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	b4c022a2-2581-440c-b1d7-c1631b4745e9
sexit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	4f085f67-13e7-4411-9606-879573f557ce
snit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	30e498e0-7962-44a0-94cd-fa661c4f1c97
styrit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	5eaca836-2e38-4bca-aad8-4999f0475745
equalit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	c97f6b7b-776f-4eb0-a8a5-43d679b494e9
flashit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	8fdfb6c1-b6e8-41f5-a4c6-9284f6ed7b6d
styrit	2020	c1b76f1c-3ed7-4852-ae5c-7498603793d3	a7a2c85f-cfde-49ca-88ee-a43e01a2925f
snit	2020	c1b76f1c-3ed7-4852-ae5c-7498603793d3	0351ce77-9dcc-46ff-849f-65ed49bc853c
mrcit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	e05efd12-f4aa-4ea9-b6de-30edc0f7bec2
nollkit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	5acee1e5-a6df-4de5-94a8-81043ee462ad
prit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	d296d575-449b-4bb6-b6b7-04488c79f4b5
sexit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	2cf4ef0e-469c-40ea-953b-69cc15cef4c2
armit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	931e98ce-1274-4fdc-9f36-ffc29ad8b206
digit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	21719182-b57c-4adb-bc5a-95a65e9aff57
fanbarerit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	f5074714-335f-4407-b58e-63e43e74710b
fritid	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	9bbc8e11-14e3-4069-98e3-d78b9ac9b139
snit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	9da32386-fc57-4a76-8a75-a2b985142328
styrit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	b12196da-98dd-4baa-8fe6-9dfc7f89dff5
equalit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	486381eb-dcfc-4c3f-b738-bb7160a23f13
flashit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	eb6e9584-bdb1-4568-b051-f610acb3791b
styrit	2020	84b0c794-3670-40f4-9f9a-e69ce67b94c0	ac280faa-2e26-4fc1-bc36-5c2695fdb06b
snit	2020	84b0c794-3670-40f4-9f9a-e69ce67b94c0	26c690c1-58eb-49d8-b743-cd905b348ef2
nollkit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	d5ba9da9-83a0-47f3-a305-2314251e4aee
prit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	d4d175fa-26af-4c34-83f0-f30478fa0e02
sexit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	aef94285-63d3-4937-bcc8-b7bd24e06622
armit	active	ade47d19-0ad1-48db-a200-6833b98a6058	9767169f-200b-4f12-b064-3536d7220181
digit	active	ade47d19-0ad1-48db-a200-6833b98a6058	855c1c34-e6af-4ac0-8a1f-0e19ada252d0
flashit	active	ade47d19-0ad1-48db-a200-6833b98a6058	23e82947-fe7b-4ad1-8d26-84f4b64a14cf
fanbarerit	active	ade47d19-0ad1-48db-a200-6833b98a6058	a7d45cb5-b725-4b48-a043-313dd4af8608
fritid	active	ade47d19-0ad1-48db-a200-6833b98a6058	492fa1f1-6423-4eeb-a1cd-de1461730eb8
mrcit	active	ade47d19-0ad1-48db-a200-6833b98a6058	b0289639-c740-463d-96c7-d82e119db2c7
nollkit	active	ade47d19-0ad1-48db-a200-6833b98a6058	4dd5cb1f-48e5-4a04-9884-361534ccae3b
prit	active	ade47d19-0ad1-48db-a200-6833b98a6058	ffbbb522-54b6-41a8-bf8f-ff5ee8d90a2c
sexit	active	ade47d19-0ad1-48db-a200-6833b98a6058	efcbc6de-30d4-47a5-9bf5-cd03876078e5
snit	active	ade47d19-0ad1-48db-a200-6833b98a6058	1ddb4bca-42b1-4f15-8ef3-ba0222548e56
styrit	active	ade47d19-0ad1-48db-a200-6833b98a6058	f45d7f9c-86f6-4e55-8448-001ab576434b
equalit	active	ade47d19-0ad1-48db-a200-6833b98a6058	78e98041-f49a-4eef-bc72-c86e55caed15
styrit	2020	ade47d19-0ad1-48db-a200-6833b98a6058	e0324f9a-a5ca-43ff-aa13-790e6064071b
snit	2020	ade47d19-0ad1-48db-a200-6833b98a6058	75f7533e-22e7-4ef1-bd32-39d797d603bc
flashit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	fbb73053-83c8-48eb-a5c3-792b1bc592e1
digit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	7e1228d8-0b21-47d2-8141-685588014ebd
armit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	5d9ca1de-4872-4236-81f3-7aa7ef261fd3
fanbarerit	active	dc1a605e-75ee-410a-be31-ec128297f6da	643d5ad5-d519-42ee-8f27-2f0869eb44f2
fritid	active	dc1a605e-75ee-410a-be31-ec128297f6da	5281f265-8337-4933-8721-84c68a0239ec
snit	active	dc1a605e-75ee-410a-be31-ec128297f6da	d855b5b8-d654-4715-87fa-119d70eb9b08
styrit	active	dc1a605e-75ee-410a-be31-ec128297f6da	f4fb6dd7-7397-4e34-8fe5-6cede1cef313
equalit	active	dc1a605e-75ee-410a-be31-ec128297f6da	329c853c-afb4-46f0-ab28-5a4cac740bdd
armit	active	dc1a605e-75ee-410a-be31-ec128297f6da	01a0d1d6-aea3-403e-8004-0f95215c70d2
digit	active	dc1a605e-75ee-410a-be31-ec128297f6da	3cb63428-83b4-41bf-a31b-c7626b6860e3
mrcit	active	dc1a605e-75ee-410a-be31-ec128297f6da	a67853e6-8970-43ce-a59d-97906b1b95a4
nollkit	active	dc1a605e-75ee-410a-be31-ec128297f6da	8f7f9e81-ce98-4264-997a-5a184c7a72fd
prit	active	dc1a605e-75ee-410a-be31-ec128297f6da	e4b6d9ac-5cc4-4655-994f-62e7fd633a1a
sexit	active	dc1a605e-75ee-410a-be31-ec128297f6da	389515b8-4506-49a6-abd8-a354ab7e1b3a
flashit	active	dc1a605e-75ee-410a-be31-ec128297f6da	4788bc64-051a-4727-9845-a1e447038e3e
armit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	771babb8-31a0-4edb-997b-aa2af16deee1
styrit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	766ae524-51ed-4762-8b70-bb8f4ff90da1
snit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	60cdc881-f267-46ce-9197-33007155c59d
fanbarerit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	0bccb017-a29e-414f-bd8d-4338e991d1b9
fritid	2021	dc1a605e-75ee-410a-be31-ec128297f6da	2a87e1fe-7d9c-4c40-aedd-dfcdbe813cfa
equalit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	5b8b47cd-bae2-4a3d-b033-4883b2fd2aed
armit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	32d8689e-db06-4ccf-9533-ca9db3145702
digit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	278a2e39-88fa-40c5-9a1a-6437ee66a2a7
fanbarerit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	ea2c5277-62b9-40d1-b176-d0c6da87165c
fritid	active	7905c552-62bf-4d98-9a68-67cc47b6492f	47832081-946c-4772-8266-39632925bc4a
mrcit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	603e688a-e33f-43bf-8950-4c8461b0688b
nollkit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	354bece0-269d-4c0a-836b-789f75775d58
prit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	b8fa6964-602d-4b1c-9db8-680c12770e88
sexit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	73328a89-0869-40e5-89c8-1b2c1743a534
snit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	ae7e0754-2f87-42bb-a669-d2df34febcc7
styrit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	1a13d243-789b-4236-a742-a618adcee700
equalit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	9a2a4766-a09b-4cc5-b4d5-7c1862f22473
flashit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	54671377-8dee-4763-add1-49179a90c3f0
armit	2021	7905c552-62bf-4d98-9a68-67cc47b6492f	e244c2b9-ccf3-4d4d-bf12-ac6c9e5255e2
styrit	2021	7905c552-62bf-4d98-9a68-67cc47b6492f	cf26b66f-bbc8-4e08-893e-36650f49fe33
tradgardsmasterit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	504ef061-f349-451a-bdea-701eaeabeab7
\.


--
-- Data for Name: groupmeetingfile; Type: TABLE DATA; Schema: public; Owner: secretary
--

COPY public.groupmeetingfile (group_task_group_group_group, group_task_group_group_year, group_task_group_meeting, group_task_task, file_location, date) FROM stdin;
armit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport	src/uploads/2019/lp2/0/armit/vrapport_armit_2019_2.pdf	2019-11-28 16:15:08
fritid	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport	src/uploads/2019/lp2/0/fritid/vrapport_fritid_2019_2.pdf	2019-11-28 16:16:09
nollkit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport	src/uploads/2019/lp2/0/nollkit/vrapport_nollkit_2019_2.pdf	2019-11-28 16:16:31
fanbarerit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport	src/uploads/2019/lp2/0/fanbarerit/vrapport_fanbarerit_2019_2.pdf	2019-12-02 10:08:06
sexit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport	src/uploads/2019/lp2/0/sexit/vrapport_sexit_2019_2.pdf	2019-12-03 15:18:07
snit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport	src/uploads/2019/lp2/0/snit/vrapport_snit_2019_2.pdf	2019-12-04 11:56:18
digit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport	src/uploads/2019/lp2/0/digit/vrapport_digit_2019_2.pdf	2019-12-05 17:35:44
prit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport	src/uploads/2019/lp2/0/prit/vrapport_prit_2019_2.pdf	2019-12-05 20:14:07
armit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport	src/uploads/2020/lp3/0/armit/vrapport_armit_2020_3.pdf	2020-02-05 12:44:57
fritid	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport	src/uploads/2020/lp3/0/fritid/vrapport_fritid_2020_3.pdf	2020-02-19 08:06:04
fanbarerit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport	src/uploads/2020/lp3/0/fanbarerit/vrapport_fanbarerit_2020_3.pdf	2020-02-19 08:36:54
snit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport	src/uploads/2020/lp3/0/snit/vrapport_snit_2020_3.pdf	2020-02-19 20:37:08
prit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vplan	src/uploads/2020/lp3/0/prit/vplan_prit_2020_3.pdf	2020-02-20 08:02:54
prit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport	src/uploads/2020/lp3/0/prit/vrapport_prit_2020_3.pdf	2020-02-20 08:02:54
sexit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	budget	src/uploads/2020/lp3/0/sexit/budget_sexit_2020_3.pdf	2020-02-20 15:31:11
sexit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vplan	src/uploads/2020/lp3/0/sexit/vplan_sexit_2020_3.pdf	2020-02-20 15:31:11
sexit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport	src/uploads/2020/lp3/0/sexit/vrapport_sexit_2020_3.pdf	2020-02-20 15:31:11
prit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	budget	src/uploads/2020/lp3/0/prit/budget_prit_2020_3.pdf	2020-02-20 16:25:06
digit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport	src/uploads/2020/lp3/0/digit/vrapport_digit_2020_3.pdf	2020-02-20 16:33:16
nollkit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	budget	src/uploads/2020/lp3/0/nollkit/budget_nollkit_2020_3.pdf	2020-02-20 22:35:24
nollkit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vplan	src/uploads/2020/lp3/0/nollkit/vplan_nollkit_2020_3.pdf	2020-02-20 22:35:24
nollkit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport	src/uploads/2020/lp3/0/nollkit/vrapport_nollkit_2020_3.pdf	2020-02-20 22:35:24
styrit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport	src/uploads/2020/lp3/0/styrit/vrapport_styrit_2020_3.pdf	2020-02-20 22:49:30
sexit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport	src/uploads/2020/lp4/0/sexit/vrapport_sexit_2020_4.pdf	2020-04-27 11:08:46
fanbarerit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport	src/uploads/2020/lp4/0/fanbarerit/vrapport_fanbarerit_2020_4.pdf	2020-04-27 13:46:25
armit	active	00c538b8-470c-4e14-ab31-efd323086102	budget	src/uploads/2020/lp4/0/armit/budget_armit_2020_4.pdf	2020-05-02 08:53:44
armit	active	00c538b8-470c-4e14-ab31-efd323086102	vplan	src/uploads/2020/lp4/0/armit/vplan_armit_2020_4.pdf	2020-05-02 08:53:44
armit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport	src/uploads/2020/lp4/0/armit/vrapport_armit_2020_4.pdf	2020-05-02 08:53:44
fritid	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport	src/uploads/2020/lp4/0/fritid/vrapport_fritid_2020_4.pdf	2020-05-02 14:51:24
mrcit	active	00c538b8-470c-4e14-ab31-efd323086102	vplan	src/uploads/2020/lp4/0/mrcit/vplan_mrcit_2020_4.pdf	2020-05-03 09:25:53
mrcit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport	src/uploads/2020/lp4/0/mrcit/vrapport_mrcit_2020_4.pdf	2020-05-03 09:25:53
nollkit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport	src/uploads/2020/lp4/0/nollkit/vrapport_nollkit_2020_4.pdf	2020-05-04 07:35:09
prit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport	src/uploads/2020/lp4/0/prit/vrapport_prit_2020_4.pdf	2020-05-04 10:03:04
mrcit	active	00c538b8-470c-4e14-ab31-efd323086102	budget	src/uploads/2020/lp4/0/mrcit/budget_mrcit_2020_4.pdf	2020-05-04 13:46:15
digit	active	00c538b8-470c-4e14-ab31-efd323086102	budget	src/uploads/2020/lp4/0/digit/budget_digit_2020_4.pdf	2020-05-04 19:20:11
styrit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport	src/uploads/2020/lp4/0/styrit/vrapport_styrit_2020_4.pdf	2020-05-04 20:05:53
digit	active	00c538b8-470c-4e14-ab31-efd323086102	vplan	src/uploads/2020/lp4/0/digit/vplan_digit_2020_4.pdf	2020-05-04 20:06:07
armit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport	src/uploads/2020/lp1/0/armit/vrapport_armit_2020_1.pdf	2020-09-17 13:15:54.822147
fanbarerit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse	src/uploads/2020/lp1/0/fanbarerit/eberattelse_fanbarerit_2020_1.pdf	2020-09-18 07:27:44.578615
fanbarerit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse	src/uploads/2020/lp1/0/fanbarerit/vberattelse_fanbarerit_2020_1.pdf	2020-09-18 07:27:44.584355
prit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse	src/uploads/2020/lp1/0/prit/vberattelse_prit_2020_1.pdf	2020-09-22 15:00:07.57935
prit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse	src/uploads/2020/lp1/0/prit/eberattelse_prit_2020_1.pdf	2020-09-22 15:00:07.58508
snit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse	src/uploads/2020/lp1/0/snit/eberattelse_snit_2020_1.pdf	2020-09-25 15:30:59.163696
snit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse	src/uploads/2020/lp1/0/snit/vberattelse_snit_2020_1.pdf	2020-09-25 15:30:59.262891
snit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	budget	src/uploads/2020/lp1/0/snit/budget_snit_2020_1.pdf	2020-09-28 11:24:34.523073
sexit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport	src/uploads/2020/lp1/0/sexit/vrapport_sexit_2020_1.pdf	2020-09-28 13:33:17.209963
fritid	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse	src/uploads/2020/lp1/0/fritid/eberattelse_fritid_2020_1.pdf	2020-09-29 16:58:48.020427
fritid	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse	src/uploads/2020/lp1/0/fritid/vberattelse_fritid_2020_1.pdf	2020-09-29 16:58:48.050336
fritid	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vplan	src/uploads/2020/lp1/0/fritid/vplan_fritid_2020_1.pdf	2020-09-30 08:29:40.535779
fritid	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	budget	src/uploads/2020/lp1/0/fritid/budget_fritid_2020_1.pdf	2020-09-30 09:37:36.982153
fritid	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport	src/uploads/2020/lp1/0/fritid/vrapport_fritid_2020_1.pdf	2020-09-30 10:04:47.764342
prit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport	src/uploads/2020/lp1/0/prit/vrapport_prit_2020_1.pdf	2020-09-30 10:23:25.746595
mrcit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport	src/uploads/2020/lp1/0/mrcit/vrapport_mrcit_2020_1.pdf	2020-09-30 18:51:25.462162
styrit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse	src/uploads/2020/lp1/0/styrit/vberattelse_styrit_2020_1.pdf	2020-09-30 21:29:01.451066
snit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vplan	src/uploads/2020/lp1/0/snit/vplan_snit_2020_1.pdf	2020-10-01 03:12:05.472291
snit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport	src/uploads/2020/lp1/0/snit/vrapport_snit_2020_1.pdf	2020-10-01 03:12:05.495773
styrit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse	src/uploads/2020/lp1/0/styrit/eberattelse_styrit_2020_1.pdf	2020-10-01 13:46:17.65354
digit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport	src/uploads/2020/lp1/0/digit/vrapport_digit_2020_1.pdf	2020-10-01 18:27:39.167984
styrit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vplan	src/uploads/2020/lp1/0/styrit/vplan_styrit_2020_1.pdf	2020-10-01 19:46:46.503447
styrit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport	src/uploads/2020/lp1/0/styrit/vrapport_styrit_2020_1.pdf	2020-10-01 19:46:46.514675
nollkit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport	src/uploads/2020/lp1/0/nollkit/vrapport_nollkit_2020_1.pdf	2020-10-01 20:21:12.679226
styrit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	budget	src/uploads/2020/lp1/0/styrit/budget_styrit_2020_1.pdf	2020-10-01 21:03:21.356003
fanbarerit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	budget	src/uploads/2020/lp1/0/fanbarerit/budget_fanbarerit_2020_1.pdf	2020-10-01 21:52:56.063003
fanbarerit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vplan	src/uploads/2020/lp1/0/fanbarerit/vplan_fanbarerit_2020_1.pdf	2020-10-01 21:52:56.06824
fanbarerit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport	src/uploads/2020/lp1/0/fanbarerit/vrapport_fanbarerit_2020_1.pdf	2020-10-01 21:52:56.072943
snit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport	src/uploads/2021/lp3/0/snit/vrapport_snit_2021_3.pdf	2021-02-16 21:40:45.084256
prit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport	src/uploads/2021/lp4/0/prit/vrapport_prit_2021_4.pdf	2021-04-27 08:51:48.39453
armit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport	src/uploads/2020/lp2/0/armit/vrapport_armit_2020_2.pdf	2020-11-21 14:31:28.901858
flashit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vplan	src/uploads/2021/lp4/0/flashit/vplan_flashit_2021_4.pdf	2021-05-01 09:46:30.307383
flashit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport	src/uploads/2021/lp4/0/flashit/vrapport_flashit_2021_4.pdf	2021-05-01 09:46:30.57389
armit	2020	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vberattelse	src/uploads/2021/lp4/0/armit/vberattelse_armit2020_2021_4.pdf	2021-05-02 13:06:36.669148
fritid	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport	src/uploads/2021/lp4/0/fritid/vrapport_fritid_2021_4.pdf	2021-05-03 10:34:42.278836
nollkit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport	src/uploads/2021/lp4/0/nollkit/vrapport_nollkit_2021_4.pdf	2021-05-03 18:52:50.070582
styrit	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	eberattelse	src/uploads/2020/lp2/0/styrit/eberattelse_styrit2019_2020_2.pdf	2020-11-25 08:53:05.778783
armit	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	eberattelse	src/uploads/2020/lp2/0/armit/eberattelse_armit2019_2020_2.pdf	2020-11-25 12:57:30.765491
armit	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	vberattelse	src/uploads/2020/lp2/0/armit/vberattelse_armit2019_2020_2.pdf	2020-11-25 12:57:30.910128
styrit	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	vberattelse	src/uploads/2020/lp2/0/styrit/vberattelse_styrit2019_2020_2.pdf	2020-11-27 10:21:38.908405
fritid	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	eberattelse	src/uploads/2020/lp2/0/fritid/eberattelse_fritid2019_2020_2.pdf	2020-11-29 12:05:09.004301
fritid	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	vberattelse	src/uploads/2020/lp2/0/fritid/vberattelse_fritid2019_2020_2.pdf	2020-11-29 12:05:09.067016
fanbarerit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport	src/uploads/2020/lp2/0/fanbarerit/vrapport_fanbarerit_2020_2.pdf	2020-11-29 12:23:06.826457
sexit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport	src/uploads/2021/lp4/0/sexit/vrapport_sexit_2021_4.pdf	2021-05-03 21:00:06.296014
mrcit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport	src/uploads/2020/lp2/0/mrcit/vrapport_mrcit_2020_2.pdf	2020-11-29 18:52:54.877423
nollkit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport	src/uploads/2020/lp2/0/nollkit/vrapport_nollkit_2020_2.pdf	2020-11-29 19:04:45.175381
fritid	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport	src/uploads/2020/lp2/0/fritid/vrapport_fritid_2020_2.pdf	2020-11-29 20:30:47.805057
sexit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport	src/uploads/2020/lp2/0/sexit/vrapport_sexit_2020_2.pdf	2020-11-29 21:34:14.752151
prit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport	src/uploads/2020/lp2/0/prit/vrapport_prit_2020_2.pdf	2020-11-30 10:17:08.708401
snit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport	src/uploads/2020/lp2/0/snit/vrapport_snit_2020_2.pdf	2020-11-30 18:50:36.700927
equalit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport	src/uploads/2020/lp2/0/equalit/vrapport_equalit_2020_2.pdf	2020-11-30 18:51:17.646016
prit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	eberattelse	src/uploads/2021/lp3/0/prit/eberattelse_prit2020_2021_3.pdf	2021-02-11 18:28:12.841008
nollkit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	budget	src/uploads/2021/lp3/0/nollkit/budget_nollkit_2021_3.pdf	2021-02-14 11:49:23.500515
nollkit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vplan	src/uploads/2021/lp3/0/nollkit/vplan_nollkit_2021_3.pdf	2021-02-14 11:49:23.703495
nollkit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport	src/uploads/2021/lp3/0/nollkit/vrapport_nollkit_2021_3.pdf	2021-02-14 11:49:23.723473
fritid	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport	src/uploads/2021/lp3/0/fritid/vrapport_fritid_2021_3.pdf	2021-02-14 17:52:04.920729
prit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	vberattelse	src/uploads/2021/lp3/0/prit/vberattelse_prit2020_2021_3.pdf	2021-02-15 13:43:29.906906
fanbarerit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport	src/uploads/2021/lp3/0/fanbarerit/vrapport_fanbarerit_2021_3.pdf	2021-02-15 20:21:14.749177
mrcit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	eberattelse	src/uploads/2021/lp3/0/mrcit/eberattelse_mrcit2020_2021_3.pdf	2021-02-15 20:39:03.903745
mrcit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	vberattelse	src/uploads/2021/lp3/0/mrcit/vberattelse_mrcit2020_2021_3.pdf	2021-02-15 20:39:03.959986
armit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport	src/uploads/2021/lp3/0/armit/vrapport_armit_2021_3.pdf	2021-02-16 09:02:07.948363
sexit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	eberattelse	src/uploads/2021/lp3/0/sexit/eberattelse_sexit2020_2021_3.pdf	2021-02-16 14:12:53.685723
sexit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	vberattelse	src/uploads/2021/lp3/0/sexit/vberattelse_sexit2020_2021_3.pdf	2021-02-16 14:12:54.062689
nollkit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	eberattelse	src/uploads/2021/lp3/0/nollkit/eberattelse_nollkit2020_2021_3.pdf	2021-02-16 15:00:51.976325
nollkit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	vberattelse	src/uploads/2021/lp3/0/nollkit/vberattelse_nollkit2020_2021_3.pdf	2021-02-16 15:00:52.068837
sexit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	budget	src/uploads/2021/lp3/0/sexit/budget_sexit_2021_3.pdf	2021-02-16 15:43:58.98367
sexit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vplan	src/uploads/2021/lp3/0/sexit/vplan_sexit_2021_3.pdf	2021-02-16 15:43:59.104215
sexit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport	src/uploads/2021/lp3/0/sexit/vrapport_sexit_2021_3.pdf	2021-02-16 15:43:59.12869
styrit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport	src/uploads/2021/lp3/0/styrit/vrapport_styrit_2021_3.pdf	2021-02-16 19:01:04.332333
prit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	budget	src/uploads/2021/lp3/0/prit/budget_prit_2021_3.pdf	2021-02-16 21:24:34.752905
prit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vplan	src/uploads/2021/lp3/0/prit/vplan_prit_2021_3.pdf	2021-02-16 21:24:34.903891
prit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport	src/uploads/2021/lp3/0/prit/vrapport_prit_2021_3.pdf	2021-02-16 21:24:35.085814
digit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vplan	src/uploads/2021/lp4/0/digit/vplan_digit_2021_4.pdf	2021-05-04 08:58:26.204336
digit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport	src/uploads/2021/lp4/0/digit/vrapport_digit_2021_4.pdf	2021-05-04 09:15:50.951819
digit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	budget	src/uploads/2021/lp4/0/digit/budget_digit_2021_4.pdf	2021-05-04 10:48:37.626402
flashit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	budget	src/uploads/2021/lp4/0/flashit/budget_flashit_2021_4.pdf	2021-05-04 11:26:31.241975
armit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	budget	src/uploads/2021/lp4/0/armit/budget_armit_2021_4.pdf	2021-05-04 15:40:56.892396
armit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vplan	src/uploads/2021/lp4/0/armit/vplan_armit_2021_4.pdf	2021-05-04 15:40:57.055577
styrit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport	src/uploads/2021/lp4/0/styrit/vrapport_styrit_2021_4.pdf	2021-05-04 16:26:09.593457
fanbarerit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport	src/uploads/2021/lp4/0/fanbarerit/vrapport_fanbarerit_2021_4.pdf	2021-05-04 18:16:24.333111
snit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport	src/uploads/2021/lp4/0/snit/vrapport_snit_2021_4.pdf	2021-05-04 20:22:10.086774
flashit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport	src/uploads/2021/lp1/0/flashit/vrapport_flashit_2021_1.pdf	2021-09-27 12:04:06.804562
fanbarerit	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse	src/uploads/2021/lp1/0/fanbarerit/eberattelse_fanbarerit2020_2021_1.pdf	2021-09-22 21:01:23.355059
fanbarerit	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse	src/uploads/2021/lp1/0/fanbarerit/vberattelse_fanbarerit2020_2021_1.pdf	2021-09-22 21:01:23.401503
fritid	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse	src/uploads/2021/lp1/0/fritid/vberattelse_fritid2020_2021_1.pdf	2021-09-26 15:36:54.195592
fritid	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse	src/uploads/2021/lp1/0/fritid/eberattelse_fritid2020_2021_1.pdf	2021-09-26 16:27:50.121635
sexit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport	src/uploads/2021/lp1/0/sexit/vrapport_sexit_2021_1.pdf	2021-09-27 11:25:48.24773
nollkit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport	src/uploads/2021/lp1/0/nollkit/vrapport_nollkit_2021_1.pdf	2021-09-27 16:09:54.521678
fritid	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport	src/uploads/2021/lp1/0/fritid/vrapport_fritid_2021_1.pdf	2021-09-27 17:29:12.106047
fritid	active	f9687302-9d51-4d31-9080-f60059976a0e	vplan	src/uploads/2021/lp1/0/fritid/vplan_fritid_2021_1.pdf	2021-09-27 17:29:12.154697
digit	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse	src/uploads/2021/lp1/0/digit/eberattelse_digit2020_2021_1.pdf	2021-09-27 18:39:33.69602
snit	active	f9687302-9d51-4d31-9080-f60059976a0e	vplan	src/uploads/2021/lp1/0/snit/vplan_snit_2021_1.pdf	2021-09-27 19:01:48.946517
snit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport	src/uploads/2021/lp1/0/snit/vrapport_snit_2021_1.pdf	2021-09-27 19:01:49.348009
snit	active	f9687302-9d51-4d31-9080-f60059976a0e	budget	src/uploads/2021/lp1/0/snit/budget_snit_2021_1.pdf	2021-09-27 19:01:49.457264
armit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport	src/uploads/2021/lp1/0/armit/vrapport_armit_2021_1.pdf	2021-09-27 19:02:49.593014
snit	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse	src/uploads/2021/lp1/0/snit/vberattelse_snit2020_2021_1.pdf	2021-09-27 19:21:53.554831
fanbarerit	active	f9687302-9d51-4d31-9080-f60059976a0e	vplan	src/uploads/2021/lp1/0/fanbarerit/vplan_fanbarerit_2021_1.pdf	2021-09-27 19:26:00.945845
fanbarerit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport	src/uploads/2021/lp1/0/fanbarerit/vrapport_fanbarerit_2021_1.pdf	2021-09-27 19:26:00.987845
prit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport	src/uploads/2021/lp1/0/prit/vrapport_prit_2021_1.pdf	2021-09-27 19:34:21.79055
equalit	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse	src/uploads/2021/lp1/0/equalit/vberattelse_equalit2020_2021_1.pdf	2021-09-27 19:57:14.163997
equalit	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse	src/uploads/2021/lp1/0/equalit/eberattelse_equalit2020_2021_1.pdf	2021-09-27 19:57:14.239381
styrit	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse	src/uploads/2021/lp1/0/styrit/vberattelse_styrit2020_2021_1.pdf	2021-09-27 20:32:36.680459
styrit	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse	src/uploads/2021/lp1/0/styrit/eberattelse_styrit2020_2021_1.pdf	2021-09-27 20:32:36.724074
equalit	active	f9687302-9d51-4d31-9080-f60059976a0e	vplan	src/uploads/2021/lp1/0/equalit/vplan_equalit_2021_1.pdf	2021-09-27 22:05:10.341778
equalit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport	src/uploads/2021/lp1/0/equalit/vrapport_equalit_2021_1.pdf	2021-09-27 22:05:10.389739
fanbarerit	active	f9687302-9d51-4d31-9080-f60059976a0e	budget	src/uploads/2021/lp1/0/fanbarerit/budget_fanbarerit_2021_1.pdf	2021-09-28 09:51:26.95252
digit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/digit/vrapport_digit_2021_2.pdf	2021-11-30 14:30:04.224488
nollkit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/nollkit/vrapport_nollkit_2021_2.pdf	2021-12-01 13:43:24.45324
sexit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/sexit/vrapport_sexit_2021_2.pdf	2021-12-02 15:19:47.889033
snit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/snit/vrapport_snit_2021_2.pdf	2021-12-02 21:39:12.144841
flashit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/flashit/vrapport_flashit_2021_2.pdf	2021-12-02 22:02:14.356325
armit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/armit/vrapport_armit_2021_2.pdf	2021-12-02 22:22:26.934173
prit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/prit/vrapport_prit_2021_2.pdf	2021-12-02 22:29:19.296188
equalit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/equalit/vrapport_equalit_2021_2.pdf	2021-12-03 11:27:34.679049
styrit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/styrit/vrapport_styrit_2021_2.pdf	2021-12-03 15:19:49.309185
fanbarerit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/fanbarerit/vrapport_fanbarerit_2021_2.pdf	2021-12-03 17:18:48.105099
fritid	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport	src/uploads/2021/lp2/0/fritid/vrapport_fritid_2021_2.pdf	2021-12-04 10:27:19.065358
mrcit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	budget	src/uploads/2022/lp3/0/mrcit/budget_mrcit_2022_3.pdf	2022-02-16 13:13:42.505088
mrcit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vplan	src/uploads/2022/lp3/0/mrcit/vplan_mrcit_2022_3.pdf	2022-02-16 13:13:44.104838
mrcit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/mrcit/vrapport_mrcit_2022_3.pdf	2022-02-16 13:13:44.718792
prit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vplan	src/uploads/2022/lp3/0/prit/vplan_prit_2022_3.pdf	2022-02-16 15:23:22.033229
prit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/prit/vrapport_prit_2022_3.pdf	2022-02-16 15:23:22.781618
digit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/digit/vrapport_digit_2022_3.pdf	2022-02-16 16:18:05.509598
fritid	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/fritid/vrapport_fritid_2022_3.pdf	2022-02-17 08:06:07.925515
prit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	budget	src/uploads/2022/lp3/0/prit/budget_prit_2022_3.pdf	2022-02-17 10:53:20.577327
snit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/snit/vrapport_snit_2022_3.pdf	2022-02-17 11:56:45.424202
flashit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/flashit/vrapport_flashit_2022_3.pdf	2022-02-17 12:13:32.368525
prit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vberattelse	src/uploads/2022/lp3/0/prit/vberattelse_prit2021_2022_3.pdf	2022-02-17 13:09:51.84981
sexit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	eberattelse	src/uploads/2022/lp3/0/sexit/eberattelse_sexit2021_2022_3.pdf	2022-02-17 13:27:50.864897
sexit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vberattelse	src/uploads/2022/lp3/0/sexit/vberattelse_sexit2021_2022_3.pdf	2022-02-17 13:27:50.907626
nollkit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	budget	src/uploads/2022/lp3/0/nollkit/budget_nollkit_2022_3.pdf	2022-02-17 13:59:53.571091
nollkit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vplan	src/uploads/2022/lp3/0/nollkit/vplan_nollkit_2022_3.pdf	2022-02-17 13:59:53.625934
nollkit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/nollkit/vrapport_nollkit_2022_3.pdf	2022-02-17 13:59:53.701774
sexit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	budget	src/uploads/2022/lp3/0/sexit/budget_sexit_2022_3.pdf	2022-02-17 14:18:56.85121
sexit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vplan	src/uploads/2022/lp3/0/sexit/vplan_sexit_2022_3.pdf	2022-02-17 14:18:57.641047
sexit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/sexit/vrapport_sexit_2022_3.pdf	2022-02-17 14:18:57.911894
styrit	2020	84b0c794-3670-40f4-9f9a-e69ce67b94c0	eberattelse	src/uploads/2022/lp3/0/styrit/eberattelse_styrit2020_2022_3.pdf	2022-02-17 17:25:11.061657
styrit	2020	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vberattelse	src/uploads/2022/lp3/0/styrit/vberattelse_styrit2020_2022_3.pdf	2022-02-17 17:25:11.341719
nollkit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	eberattelse	src/uploads/2022/lp3/0/nollkit/eberattelse_nollkit2021_2022_3.pdf	2022-02-17 21:09:50.822564
nollkit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vberattelse	src/uploads/2022/lp3/0/nollkit/vberattelse_nollkit2021_2022_3.pdf	2022-02-17 21:09:50.882501
armit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/armit/vrapport_armit_2022_3.pdf	2022-02-17 21:33:58.327468
equalit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/equalit/vrapport_equalit_2022_3.pdf	2022-02-17 22:38:47.927935
prit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	eberattelse	src/uploads/2022/lp3/0/prit/eberattelse_prit2021_2022_3.pdf	2022-02-18 01:09:56.363316
fanbarerit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport	src/uploads/2022/lp3/0/fanbarerit/vrapport_fanbarerit_2022_3.pdf	2022-02-18 19:55:15.154306
digit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport	src/uploads/2022/lp4/0/digit/vrapport_digit_2022_4.pdf	2022-04-26 19:37:02.854588
snit	2020	ade47d19-0ad1-48db-a200-6833b98a6058	eberattelse	src/uploads/2022/lp4/0/snit/eberattelse_snit2020_2022_4.pdf	2022-04-27 12:39:58.274799
snit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport	src/uploads/2022/lp4/0/snit/vrapport_snit_2022_4.pdf	2022-04-28 06:52:54.074333
snit	2020	ade47d19-0ad1-48db-a200-6833b98a6058	vberattelse	src/uploads/2022/lp4/0/snit/vberattelse_snit2020_2022_4.pdf	2022-04-30 19:41:28.534996
mrcit	active	ade47d19-0ad1-48db-a200-6833b98a6058	budget	src/uploads/2022/lp4/0/mrcit/budget_mrcit_2022_4.pdf	2022-05-04 16:14:30.593866
mrcit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport	src/uploads/2022/lp4/0/mrcit/vrapport_mrcit_2022_4.pdf	2022-05-04 16:14:30.73321
flashit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vplan	src/uploads/2022/lp4/0/flashit/vplan_flashit_2022_4.pdf	2022-05-05 07:43:41.814882
prit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/prit/vrapport_prit_2022_1.pdf	2022-09-29 21:05:42.453007
digit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	vberattelse	src/uploads/2022/lp4/0/digit/vberattelse_digit2021_2022_4.pdf	2022-05-05 08:30:06.277635
flashit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	eberattelse	src/uploads/2022/lp4/0/flashit/eberattelse_flashit2021_2022_4.pdf	2022-05-05 12:25:07.175202
flashit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	vberattelse	src/uploads/2022/lp4/0/flashit/vberattelse_flashit2021_2022_4.pdf	2022-05-05 12:25:07.231195
digit	active	ade47d19-0ad1-48db-a200-6833b98a6058	budget	src/uploads/2022/lp4/0/digit/budget_digit_2022_4.pdf	2022-05-05 14:46:07.050467
fritid	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport	src/uploads/2022/lp4/0/fritid/vrapport_fritid_2022_4.pdf	2022-05-05 15:50:36.235145
flashit	active	ade47d19-0ad1-48db-a200-6833b98a6058	budget	src/uploads/2022/lp4/0/flashit/budget_flashit_2022_4.pdf	2022-05-05 17:25:50.060702
fanbarerit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	vberattelse	src/uploads/2022/lp1/0/fanbarerit/vberattelse_fanbarerit2021_2022_1.pdf	2022-09-29 21:09:48.135155
digit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	eberattelse	src/uploads/2022/lp4/0/digit/eberattelse_digit2021_2022_4.pdf	2022-05-05 17:36:12.41228
nollkit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport	src/uploads/2022/lp4/0/nollkit/vrapport_nollkit_2022_4.pdf	2022-05-05 20:09:55.205959
digit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vplan	src/uploads/2022/lp4/0/digit/vplan_digit_2022_4.pdf	2022-05-05 20:40:17.732053
armit	active	ade47d19-0ad1-48db-a200-6833b98a6058	budget	src/uploads/2022/lp4/0/armit/budget_armit_2022_4.pdf	2022-05-06 17:13:50.76082
armit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vplan	src/uploads/2022/lp4/0/armit/vplan_armit_2022_4.pdf	2022-05-06 17:13:50.920873
armit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport	src/uploads/2022/lp4/0/armit/vrapport_armit_2022_4.pdf	2022-05-06 17:13:50.961867
prit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport	src/uploads/2022/lp4/0/prit/vrapport_prit_2022_4.pdf	2022-05-06 17:32:49.056712
sexit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport	src/uploads/2022/lp4/0/sexit/vrapport_sexit_2022_4.pdf	2022-05-06 18:05:14.746167
fanbarerit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport	src/uploads/2022/lp4/0/fanbarerit/vrapport_fanbarerit_2022_4.pdf	2022-05-06 21:32:08.794186
fritid	2021	dc1a605e-75ee-410a-be31-ec128297f6da	eberattelse	src/uploads/2022/lp1/0/fritid/eberattelse_fritid2021_2022_1.pdf	2022-09-13 16:26:38.684427
equalit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vplan	src/uploads/2022/lp1/0/equalit/vplan_equalit_2022_1.pdf	2022-09-26 10:48:02.269909
equalit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/equalit/vrapport_equalit_2022_1.pdf	2022-09-26 10:48:02.544472
digit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/digit/vrapport_digit_2022_1.pdf	2022-09-27 18:56:16.114187
mrcit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/mrcit/vrapport_mrcit_2022_1.pdf	2022-09-28 16:50:07.06111
nollkit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/nollkit/vrapport_nollkit_2022_1.pdf	2022-09-28 19:20:00.555194
fritid	active	dc1a605e-75ee-410a-be31-ec128297f6da	budget	src/uploads/2022/lp1/0/fritid/budget_fritid_2022_1.pdf	2022-09-28 21:36:22.184751
fritid	active	dc1a605e-75ee-410a-be31-ec128297f6da	vplan	src/uploads/2022/lp1/0/fritid/vplan_fritid_2022_1.pdf	2022-09-28 21:36:22.337314
fritid	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/fritid/vrapport_fritid_2022_1.pdf	2022-09-28 21:36:22.380111
snit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vplan	src/uploads/2022/lp1/0/snit/vplan_snit_2022_1.pdf	2022-09-29 06:40:02.331338
snit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/snit/vrapport_snit_2022_1.pdf	2022-09-29 06:40:02.401992
equalit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	eberattelse	src/uploads/2022/lp1/0/equalit/eberattelse_equalit2021_2022_1.pdf	2022-09-29 06:41:02.826721
sexit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/sexit/vrapport_sexit_2022_1.pdf	2022-09-29 11:47:37.764361
armit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/armit/vrapport_armit_2022_1.pdf	2022-09-29 12:34:40.488557
equalit	active	dc1a605e-75ee-410a-be31-ec128297f6da	budget	src/uploads/2022/lp1/0/equalit/budget_equalit_2022_1.pdf	2022-09-29 16:15:03.772618
fanbarerit	active	dc1a605e-75ee-410a-be31-ec128297f6da	budget	src/uploads/2022/lp1/0/fanbarerit/budget_fanbarerit_2022_1.pdf	2022-09-29 16:22:11.235817
fanbarerit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/fanbarerit/vrapport_fanbarerit_2022_1.pdf	2022-09-29 16:22:11.895907
fanbarerit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vplan	src/uploads/2022/lp1/0/fanbarerit/vplan_fanbarerit_2022_1.pdf	2022-09-29 16:22:11.93964
fritid	2021	dc1a605e-75ee-410a-be31-ec128297f6da	vberattelse	src/uploads/2022/lp1/0/fritid/vberattelse_fritid2021_2022_1.pdf	2022-09-29 18:44:41.128441
flashit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/flashit/vrapport_flashit_2022_1.pdf	2022-09-29 19:15:34.933871
snit	active	dc1a605e-75ee-410a-be31-ec128297f6da	budget	src/uploads/2022/lp1/0/snit/budget_snit_2022_1.pdf	2022-09-29 22:03:35.529811
equalit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	vberattelse	src/uploads/2022/lp1/0/equalit/vberattelse_equalit2021_2022_1.pdf	2022-09-29 22:40:44.702004
snit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	eberattelse	src/uploads/2022/lp1/0/snit/eberattelse_snit2021_2022_1.pdf	2022-10-01 09:43:13.648921
snit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	vberattelse	src/uploads/2022/lp1/0/snit/vberattelse_snit2021_2022_1.pdf	2022-10-01 09:43:13.725734
styrit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vplan	src/uploads/2022/lp1/0/styrit/vplan_styrit_2022_1.pdf	2022-10-01 12:22:42.009639
styrit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport	src/uploads/2022/lp1/0/styrit/vrapport_styrit_2022_1.pdf	2022-10-01 12:22:42.301899
styrit	active	dc1a605e-75ee-410a-be31-ec128297f6da	budget	src/uploads/2022/lp1/0/styrit/budget_styrit_2022_1.pdf	2022-10-01 13:07:50.408207
fanbarerit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	eberattelse	src/uploads/2022/lp1/0/fanbarerit/eberattelse_fanbarerit2021_2022_1.pdf	2022-10-01 19:30:32.519924
\.


--
-- Data for Name: groupmeetingtask; Type: TABLE DATA; Schema: public; Owner: secretary
--

COPY public.groupmeetingtask (group_group_group, group_group_year, group_meeting, task) FROM stdin;
armit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport
digit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport
fanbarerit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport
fritid	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport
mrcit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport
nollkit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport
prit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport
sexit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport
snit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport
styrit	active	475f5eaf-1d3c-469f-b712-c368d143efbe	vrapport
armit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport
digit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport
fanbarerit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport
fritid	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport
mrcit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport
nollkit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport
prit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport
sexit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport
snit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport
styrit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vrapport
nollkit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vplan
prit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vplan
sexit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vplan
nollkit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	budget
prit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	budget
sexit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	budget
mrcit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	budget
mrcit	active	cb2e9be8-bb2b-4663-8c44-0830be007b7f	vplan
armit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport
digit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport
fanbarerit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport
fritid	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport
mrcit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport
nollkit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport
prit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport
sexit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport
snit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport
styrit	active	00c538b8-470c-4e14-ab31-efd323086102	vrapport
armit	active	00c538b8-470c-4e14-ab31-efd323086102	vplan
digit	active	00c538b8-470c-4e14-ab31-efd323086102	vplan
armit	active	00c538b8-470c-4e14-ab31-efd323086102	budget
digit	active	00c538b8-470c-4e14-ab31-efd323086102	budget
mrcit	active	00c538b8-470c-4e14-ab31-efd323086102	budget
mrcit	active	00c538b8-470c-4e14-ab31-efd323086102	vplan
fanbarerit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vplan
fritid	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vplan
snit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vplan
styrit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vplan
fanbarerit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	budget
fritid	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	budget
snit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	budget
styrit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	budget
armit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
digit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
fanbarerit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
fritid	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
mrcit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
nollkit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
prit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
sexit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
snit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
styrit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
equalit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vplan
equalit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	budget
equalit	active	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vrapport
styrit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse
styrit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse
prit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse
prit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse
sexit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse
sexit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse
armit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse
armit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse
fritid	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse
fritid	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse
fanbarerit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse
fanbarerit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse
snit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	vberattelse
snit	2019	3d4ad9ec-a03a-432f-9570-a4eb9a698886	eberattelse
styrit	2019	00c538b8-470c-4e14-ab31-efd323086102	vberattelse
styrit	2019	00c538b8-470c-4e14-ab31-efd323086102	eberattelse
prit	2019	00c538b8-470c-4e14-ab31-efd323086102	vberattelse
prit	2019	00c538b8-470c-4e14-ab31-efd323086102	eberattelse
sexit	2019	00c538b8-470c-4e14-ab31-efd323086102	vberattelse
sexit	2019	00c538b8-470c-4e14-ab31-efd323086102	eberattelse
armit	2019	00c538b8-470c-4e14-ab31-efd323086102	vberattelse
armit	2019	00c538b8-470c-4e14-ab31-efd323086102	eberattelse
fritid	2019	00c538b8-470c-4e14-ab31-efd323086102	vberattelse
fritid	2019	00c538b8-470c-4e14-ab31-efd323086102	eberattelse
fanbarerit	2019	00c538b8-470c-4e14-ab31-efd323086102	vberattelse
fanbarerit	2019	00c538b8-470c-4e14-ab31-efd323086102	eberattelse
snit	2019	00c538b8-470c-4e14-ab31-efd323086102	vberattelse
snit	2019	00c538b8-470c-4e14-ab31-efd323086102	eberattelse
armit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
digit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
fanbarerit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
fritid	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
mrcit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
nollkit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
prit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
sexit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
snit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
styrit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
equalit	active	8c36696f-6bbe-4420-ba26-7839af9041a4	vrapport
styrit	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	vberattelse
styrit	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	eberattelse
armit	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	vberattelse
armit	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	eberattelse
fritid	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	vberattelse
fritid	2019	8c36696f-6bbe-4420-ba26-7839af9041a4	eberattelse
nollkit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vplan
prit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vplan
sexit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vplan
nollkit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	budget
prit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	budget
sexit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	budget
nollkit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
prit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
sexit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
prit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	vberattelse
prit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	eberattelse
sexit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	vberattelse
sexit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	eberattelse
nollkit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	vberattelse
nollkit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	eberattelse
mrcit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	vberattelse
mrcit	2020	cc892b3e-936b-4799-b0aa-b46c340a4b13	eberattelse
armit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
digit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
fanbarerit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
fritid	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
mrcit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
snit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
styrit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
equalit	active	cc892b3e-936b-4799-b0aa-b46c340a4b13	vrapport
armit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vplan
digit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vplan
flashit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vplan
armit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	budget
digit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	budget
flashit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	budget
armit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
digit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
fanbarerit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
fritid	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
mrcit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
nollkit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
prit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
sexit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
snit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
styrit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
equalit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
flashit	active	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vrapport
digit	2020	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vberattelse
digit	2020	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	eberattelse
armit	2020	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	vberattelse
armit	2020	b69fb3af-3140-4d8c-b498-cebf5a86d1b2	eberattelse
fanbarerit	active	f9687302-9d51-4d31-9080-f60059976a0e	vplan
fritid	active	f9687302-9d51-4d31-9080-f60059976a0e	vplan
snit	active	f9687302-9d51-4d31-9080-f60059976a0e	vplan
styrit	active	f9687302-9d51-4d31-9080-f60059976a0e	vplan
equalit	active	f9687302-9d51-4d31-9080-f60059976a0e	vplan
fanbarerit	active	f9687302-9d51-4d31-9080-f60059976a0e	budget
fritid	active	f9687302-9d51-4d31-9080-f60059976a0e	budget
snit	active	f9687302-9d51-4d31-9080-f60059976a0e	budget
styrit	active	f9687302-9d51-4d31-9080-f60059976a0e	budget
equalit	active	f9687302-9d51-4d31-9080-f60059976a0e	budget
armit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
digit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
fanbarerit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
fritid	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
nollkit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
prit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
sexit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
snit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
styrit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
equalit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
flashit	active	f9687302-9d51-4d31-9080-f60059976a0e	vrapport
digit	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse
digit	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse
fritid	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse
fritid	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse
fanbarerit	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse
fanbarerit	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse
styrit	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse
styrit	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse
snit	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse
snit	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse
equalit	2020	f9687302-9d51-4d31-9080-f60059976a0e	vberattelse
equalit	2020	f9687302-9d51-4d31-9080-f60059976a0e	eberattelse
armit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
digit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
fanbarerit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
fritid	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
nollkit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
prit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
sexit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
snit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
styrit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
equalit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
flashit	active	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vrapport
styrit	2020	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vberattelse
styrit	2020	c1b76f1c-3ed7-4852-ae5c-7498603793d3	eberattelse
snit	2020	c1b76f1c-3ed7-4852-ae5c-7498603793d3	vberattelse
snit	2020	c1b76f1c-3ed7-4852-ae5c-7498603793d3	eberattelse
mrcit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vplan
nollkit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vplan
prit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vplan
sexit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vplan
mrcit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	budget
nollkit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	budget
prit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	budget
sexit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	budget
armit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
digit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
fanbarerit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
fritid	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
mrcit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
nollkit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
prit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
sexit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
snit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
styrit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
equalit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
flashit	active	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vrapport
styrit	2020	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vberattelse
styrit	2020	84b0c794-3670-40f4-9f9a-e69ce67b94c0	eberattelse
snit	2020	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vberattelse
snit	2020	84b0c794-3670-40f4-9f9a-e69ce67b94c0	eberattelse
nollkit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vberattelse
nollkit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	eberattelse
prit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vberattelse
prit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	eberattelse
sexit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	vberattelse
sexit	2021	84b0c794-3670-40f4-9f9a-e69ce67b94c0	eberattelse
armit	active	ade47d19-0ad1-48db-a200-6833b98a6058	budget
digit	active	ade47d19-0ad1-48db-a200-6833b98a6058	budget
flashit	active	ade47d19-0ad1-48db-a200-6833b98a6058	budget
armit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vplan
digit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vplan
flashit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vplan
armit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
digit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
fanbarerit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
fritid	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
mrcit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
nollkit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
prit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
sexit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
snit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
styrit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
equalit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
flashit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vrapport
styrit	2020	ade47d19-0ad1-48db-a200-6833b98a6058	vberattelse
styrit	2020	ade47d19-0ad1-48db-a200-6833b98a6058	eberattelse
snit	2020	ade47d19-0ad1-48db-a200-6833b98a6058	vberattelse
snit	2020	ade47d19-0ad1-48db-a200-6833b98a6058	eberattelse
flashit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	vberattelse
flashit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	eberattelse
digit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	vberattelse
digit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	eberattelse
armit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	vberattelse
armit	2021	ade47d19-0ad1-48db-a200-6833b98a6058	eberattelse
styrit	active	ade47d19-0ad1-48db-a200-6833b98a6058	budget
styrit	active	ade47d19-0ad1-48db-a200-6833b98a6058	vplan
mrcit	active	ade47d19-0ad1-48db-a200-6833b98a6058	budget
fanbarerit	active	dc1a605e-75ee-410a-be31-ec128297f6da	budget
fritid	active	dc1a605e-75ee-410a-be31-ec128297f6da	budget
snit	active	dc1a605e-75ee-410a-be31-ec128297f6da	budget
styrit	active	dc1a605e-75ee-410a-be31-ec128297f6da	budget
equalit	active	dc1a605e-75ee-410a-be31-ec128297f6da	budget
fanbarerit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vplan
fritid	active	dc1a605e-75ee-410a-be31-ec128297f6da	vplan
snit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vplan
styrit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vplan
equalit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vplan
armit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
digit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
fanbarerit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
fritid	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
mrcit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
nollkit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
prit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
sexit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
snit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
styrit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
equalit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
flashit	active	dc1a605e-75ee-410a-be31-ec128297f6da	vrapport
armit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	vberattelse
armit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	eberattelse
styrit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	vberattelse
styrit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	eberattelse
snit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	vberattelse
snit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	eberattelse
fanbarerit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	vberattelse
fanbarerit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	eberattelse
fritid	2021	dc1a605e-75ee-410a-be31-ec128297f6da	vberattelse
fritid	2021	dc1a605e-75ee-410a-be31-ec128297f6da	eberattelse
equalit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	vberattelse
equalit	2021	dc1a605e-75ee-410a-be31-ec128297f6da	eberattelse
armit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
digit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
fanbarerit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
fritid	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
mrcit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
nollkit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
prit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
sexit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
snit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
styrit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
equalit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
flashit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
armit	2021	7905c552-62bf-4d98-9a68-67cc47b6492f	vberattelse
armit	2021	7905c552-62bf-4d98-9a68-67cc47b6492f	eberattelse
styrit	2021	7905c552-62bf-4d98-9a68-67cc47b6492f	vberattelse
styrit	2021	7905c552-62bf-4d98-9a68-67cc47b6492f	eberattelse
tradgardsmasterit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	budget
tradgardsmasterit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vplan
tradgardsmasterit	active	7905c552-62bf-4d98-9a68-67cc47b6492f	vrapport
\.


--
-- Data for Name: groupyear; Type: TABLE DATA; Schema: public; Owner: secretary
--

COPY public.groupyear ("group", year, finished) FROM stdin;
armit	active	f
digit	active	f
fanbarerit	active	f
fritid	active	f
mrcit	active	f
nollkit	active	f
prit	active	f
sexit	active	f
snit	active	f
styrit	active	f
equalit	active	f
prit	2019	t
sexit	2019	t
fanbarerit	2019	t
snit	2019	t
styrit	2019	t
armit	2019	t
fritid	2019	t
flashit	active	f
prit	2020	t
sexit	2020	t
nollkit	2020	t
mrcit	2020	t
armit	2020	t
digit	2020	t
fritid	2020	t
fanbarerit	2020	t
equalit	2020	t
nollkit	2021	t
prit	2021	t
sexit	2021	t
styrit	2020	t
snit	2020	t
flashit	2021	t
digit	2021	t
snit	2021	t
fanbarerit	2021	t
fritid	2021	t
equalit	2021	t
armit	2021	f
styrit	2021	f
tradgardsmasterit	active	f
\.


--
-- Data for Name: meeting; Type: TABLE DATA; Schema: public; Owner: secretary
--

COPY public.meeting (id, year, date, last_upload, lp, meeting_no, check_for_deadline) FROM stdin;
cb2e9be8-bb2b-4663-8c44-0830be007b7f	2020	2020-02-27 16:30:00	2020-02-20 22:59:00	3	0	f
00c538b8-470c-4e14-ab31-efd323086102	2020	2020-05-11 15:30:00	2020-05-04 21:55:00	4	0	f
3d4ad9ec-a03a-432f-9570-a4eb9a698886	2020	2020-10-08 15:15:00	2020-10-01 21:55:00	1	0	f
475f5eaf-1d3c-469f-b712-c368d143efbe	2019	2019-12-12 16:30:00	2019-12-05 22:55:00	2	0	f
8c36696f-6bbe-4420-ba26-7839af9041a4	2020	2020-12-07 17:01:00	2020-11-30 22:59:00	2	0	f
cc892b3e-936b-4799-b0aa-b46c340a4b13	2021	2021-02-25 16:30:00	2021-02-16 22:59:00	3	0	f
b69fb3af-3140-4d8c-b498-cebf5a86d1b2	2021	2021-05-11 15:30:00	2021-05-04 21:55:00	4	0	f
f9687302-9d51-4d31-9080-f60059976a0e	2021	2021-10-07 15:00:00	2021-09-28 21:59:00	1	0	f
c1b76f1c-3ed7-4852-ae5c-7498603793d3	2021	2021-12-09 16:00:00	2021-12-04 22:59:00	2	0	f
84b0c794-3670-40f4-9f9a-e69ce67b94c0	2022	2022-02-24 17:00:00	2022-02-19 22:59:00	3	0	f
ade47d19-0ad1-48db-a200-6833b98a6058	2022	2022-05-15 11:37:00	2022-05-06 21:59:00	4	0	f
dc1a605e-75ee-410a-be31-ec128297f6da	2022	2022-10-06 15:30:00	2022-10-01 21:56:00	1	0	f
7905c552-62bf-4d98-9a68-67cc47b6492f	2022	2022-12-05 16:30:00	2022-11-27 22:59:00	2	0	f
\.


--
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: secretary
--

COPY public.task (name, display_name) FROM stdin;
budget	Budget
vplan	Verksamhetsplan / Operational plan
vrapport	Verksamhetsrapport / Operational report
vberattelse	Verksamhetsberättelse / Operational story
eberattelse	Ekonomisk berättelse / Economic story
\.


--
-- Name: archivecode archivecode_archive_location_key; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.archivecode
    ADD CONSTRAINT archivecode_archive_location_key UNIQUE (archive_location);


--
-- Name: archivecode archivecode_code_key; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.archivecode
    ADD CONSTRAINT archivecode_code_key UNIQUE (code);


--
-- Name: archivecode archivecode_pkey; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.archivecode
    ADD CONSTRAINT archivecode_pkey PRIMARY KEY (meeting);


--
-- Name: config config_pkey; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.config
    ADD CONSTRAINT config_pkey PRIMARY KEY (key);


--
-- Name: configtype configtype_pkey; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.configtype
    ADD CONSTRAINT configtype_pkey PRIMARY KEY (type);


--
-- Name: group group_pkey; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (name);


--
-- Name: groupmeeting groupmeeting_code_key; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupmeeting
    ADD CONSTRAINT groupmeeting_code_key UNIQUE (code);


--
-- Name: groupmeeting groupmeeting_pkey; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupmeeting
    ADD CONSTRAINT groupmeeting_pkey PRIMARY KEY (group_group, group_year, meeting);


--
-- Name: groupmeetingfile groupmeetingfile_file_location_key; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupmeetingfile
    ADD CONSTRAINT groupmeetingfile_file_location_key UNIQUE (file_location);


--
-- Name: groupmeetingfile groupmeetingfile_pkey; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupmeetingfile
    ADD CONSTRAINT groupmeetingfile_pkey PRIMARY KEY (group_task_group_group_group, group_task_group_group_year, group_task_group_meeting, group_task_task);


--
-- Name: groupmeetingtask groupmeetingtask_pkey; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupmeetingtask
    ADD CONSTRAINT groupmeetingtask_pkey PRIMARY KEY (group_group_group, group_group_year, group_meeting, task);


--
-- Name: groupyear groupyear_pkey; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupyear
    ADD CONSTRAINT groupyear_pkey PRIMARY KEY ("group", year);


--
-- Name: meeting meeting_pkey; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.meeting
    ADD CONSTRAINT meeting_pkey PRIMARY KEY (id);


--
-- Name: task task_pkey; Type: CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (name);


--
-- Name: idx_config__config_type; Type: INDEX; Schema: public; Owner: secretary
--

CREATE INDEX idx_config__config_type ON public.config USING btree (config_type);


--
-- Name: idx_groupmeeting__meeting; Type: INDEX; Schema: public; Owner: secretary
--

CREATE INDEX idx_groupmeeting__meeting ON public.groupmeeting USING btree (meeting);


--
-- Name: idx_groupmeetingtask__task; Type: INDEX; Schema: public; Owner: secretary
--

CREATE INDEX idx_groupmeetingtask__task ON public.groupmeetingtask USING btree (task);


--
-- Name: archivecode fk_archivecode__meeting; Type: FK CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.archivecode
    ADD CONSTRAINT fk_archivecode__meeting FOREIGN KEY (meeting) REFERENCES public.meeting(id);


--
-- Name: config fk_config__config_type; Type: FK CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.config
    ADD CONSTRAINT fk_config__config_type FOREIGN KEY (config_type) REFERENCES public.configtype(type) ON DELETE CASCADE;


--
-- Name: groupmeeting fk_groupmeeting__group_group__group_year; Type: FK CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupmeeting
    ADD CONSTRAINT fk_groupmeeting__group_group__group_year FOREIGN KEY (group_group, group_year) REFERENCES public.groupyear("group", year) ON DELETE CASCADE;


--
-- Name: groupmeeting fk_groupmeeting__meeting; Type: FK CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupmeeting
    ADD CONSTRAINT fk_groupmeeting__meeting FOREIGN KEY (meeting) REFERENCES public.meeting(id) ON DELETE CASCADE;


--
-- Name: groupmeetingfile fk_groupmeetingfile__group_task_group_group_group__group_task_g; Type: FK CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupmeetingfile
    ADD CONSTRAINT fk_groupmeetingfile__group_task_group_group_group__group_task_g FOREIGN KEY (group_task_group_group_group, group_task_group_group_year, group_task_group_meeting, group_task_task) REFERENCES public.groupmeetingtask(group_group_group, group_group_year, group_meeting, task);


--
-- Name: groupmeetingtask fk_groupmeetingtask__group_group_group__group_group_year__group; Type: FK CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupmeetingtask
    ADD CONSTRAINT fk_groupmeetingtask__group_group_group__group_group_year__group FOREIGN KEY (group_group_group, group_group_year, group_meeting) REFERENCES public.groupmeeting(group_group, group_year, meeting) ON DELETE CASCADE;


--
-- Name: groupmeetingtask fk_groupmeetingtask__task; Type: FK CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupmeetingtask
    ADD CONSTRAINT fk_groupmeetingtask__task FOREIGN KEY (task) REFERENCES public.task(name) ON DELETE CASCADE;


--
-- Name: groupyear fk_groupyear__group; Type: FK CONSTRAINT; Schema: public; Owner: secretary
--

ALTER TABLE ONLY public.groupyear
    ADD CONSTRAINT fk_groupyear__group FOREIGN KEY ("group") REFERENCES public."group"(name) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

