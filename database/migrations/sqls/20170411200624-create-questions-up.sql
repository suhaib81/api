CREATE TABLE questions (
	question_id serial PRIMARY KEY,
	title text NOT NULL,
	content text NOT NULL,
	status text NOT NULL,
	created_at timestamp DEFAULT now(),
	updated_at timestamp DEFAULT now()
);