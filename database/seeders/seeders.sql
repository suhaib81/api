BEGIN;

-- Users
INSERT INTO users
	(first_name, last_name, email, password, active, type)
	VALUES ('Test', 'User', 'testuser@openembassy.nl', '$2a$12$1iqYe9uJSPIr8sr4YqmNYOUy/QxXtV9Q6VsheRn84IDxixGhzTU7C', true, 'user'),
	('Test', 'Volunteer', 'testvolunteer@openembassy.nl', '$2a$12$1iqYe9uJSPIr8sr4YqmNYOUy/QxXtV9Q6VsheRn84IDxixGhzTU7C', true, 'volunteer'),
	('Test', 'Admin', 'testadmin@openembassy.nl', '$2a$12$1iqYe9uJSPIr8sr4YqmNYOUy/QxXtV9Q6VsheRn84IDxixGhzTU7C', true, 'admin'),
	('Test', 'Translator', 'testtranslator@openembassy.nl', '$2a$12$1iqYe9uJSPIr8sr4YqmNYOUy/QxXtV9Q6VsheRn84IDxixGhzTU7C', true, 'volunteer');

-- Questions
INSERT INTO questions
	(title, content, status)
	VALUES ('Test question 1', 'I have a question it is about', 'open'),
	('Test question 2', 'I have a question it is about', 'picked-up'),
	('Test question 3', 'I have a question it is about', 'answered');

-- Questions-users
WITH
 q AS (SELECT question_id FROM questions WHERE title='Test question 1' LIMIT 1),
 u AS (SELECT user_id FROM users WHERE email='testuser@openembassy.nl' LIMIT 1)
INSERT INTO users_questions (question_id, user_id, role)
	SELECT q.question_id, u.user_id, 'creator' FROM q, u;

WITH
 q AS (SELECT question_id FROM questions WHERE title='Test question 2' LIMIT 1),
 u AS (SELECT user_id FROM users WHERE email='testuser@openembassy.nl' LIMIT 1)
INSERT INTO users_questions (question_id, user_id, role)
	SELECT q.question_id, u.user_id, 'creator' FROM q, u;

WITH
 q AS (SELECT question_id FROM questions WHERE title='Test question 2' LIMIT 1),
 u AS (SELECT user_id FROM users WHERE email='testuser@openembassy.nl' LIMIT 1)
INSERT INTO users_questions (question_id, user_id, role)
	SELECT q.question_id, u.user_id, 'volunteer' FROM q, u;

WITH
 q AS (SELECT question_id FROM questions WHERE title='Test question 3' LIMIT 1),
 u AS (SELECT user_id FROM users WHERE email='testuser@openembassy.nl' LIMIT 1)
INSERT INTO users_questions (question_id, user_id, role)
	SELECT q.question_id, u.user_id, 'creator' FROM q, u;

WITH
 q AS (SELECT question_id FROM questions WHERE title='Test question 3' LIMIT 1),
 u AS (SELECT user_id FROM users WHERE email='testuser@openembassy.nl' LIMIT 1)
INSERT INTO users_questions (question_id, user_id, role)
	SELECT q.question_id, u.user_id, 'volunteer' FROM q, u;

-- Posts
WITH
 q AS (SELECT question_id FROM questions WHERE title='Test question 2' LIMIT 1),
 u AS (SELECT user_id FROM users WHERE email='testuser@openembassy.nl' LIMIT 1)
INSERT INTO posts (question_id, user_id, content)
	SELECT q.question_id, u.user_id, 'Hello there, I am here to help!' FROM q, u;

COMMIT;
