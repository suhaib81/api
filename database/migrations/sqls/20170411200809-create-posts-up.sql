CREATE TABLE posts (
	post_id serial PRIMARY KEY,
	question_id integer REFERENCES questions(question_id) ON DELETE CASCADE,
	user_id integer REFERENCES users(user_id) ON DELETE CASCADE,
	content text NOT NULL,
	status text,
	created_at timestamp DEFAULT now(),
	updated_at timestamp DEFAULT now()
);