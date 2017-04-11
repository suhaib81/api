CREATE TABLE users_questions (
	question_id integer REFERENCES questions(question_id),
	user_id integer REFERENCES users(user_id),
	role text NOT NULL,
	last_viewed_at timestamp DEFAULT now(),
	created_at timestamp DEFAULT now(),
	updated_at timestamp DEFAULT now(),
	PRIMARY KEY(question_id, user_id)
);