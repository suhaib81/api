ALTER TABLE users
	ADD COLUMN upload_id integer REFERENCES uploads(upload_id);