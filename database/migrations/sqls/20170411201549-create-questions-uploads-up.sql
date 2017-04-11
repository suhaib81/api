CREATE TABLE questions_uploads (
	question_id integer REFERENCES questions(question_id),
	upload_id integer REFERENCES uploads(upload_id),
	created_at timestamp DEFAULT now(),
	updated_at timestamp DEFAULT now(),
	PRIMARY KEY (question_id, upload_id)
);