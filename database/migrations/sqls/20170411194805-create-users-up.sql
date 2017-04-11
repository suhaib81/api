CREATE TABLE users (
	user_id serial PRIMARY KEY,
	first_name text NOT NULL,
	last_name text NOT NULL,
	password text NOT NULL,
	email text UNIQUE NOT NULL,
	secret_hash text,
	secret_hash_issued_at timestamp DEFAULT now(),
	active BOOLEAN,
	type text NOT NULL,
	language text,
	dob DATE,
	phone text,
	city text,
	address text,
	created_at timestamp DEFAULT now(),
	updated_at timestamp DEFAULT now()
);

