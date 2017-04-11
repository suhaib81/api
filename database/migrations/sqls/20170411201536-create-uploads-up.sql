CREATE TABLE uploads (
	upload_id serial PRIMARY KEY,
	upload_hash text UNIQUE NOT NULL,
	type text,
	name text,
	in_use boolean DEFAULT false,
	created_at timestamp DEFAULT now(),
	updated_at timestamp DEFAULT now()
);