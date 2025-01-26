CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
Create table users(
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
fullname varchar(50),
username varchar not null unique,
status boolean default true,
created_at timestamp default current_timestamp,
password varchar(500) not null unique
);

Create table admin(
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
fullname varchar(50),
username varchar not null unique,
created_at timestamp default current_timestamp,
password varchar(500) not null unique,
status boolean default true
);

Create table super_admin(
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
fullname varchar(50),
username varchar not null unique,
password varchar(500) not null unique,
created_at timestamp default current_timestamp
);

CREATE TABLE jwt_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

insert into super_admin (fullname, username, password) values 
('feylon1409', 'jamshid1409', '$2b$10$Q2YXQMGKDDl7I4NFbGNuje54bxtKCFX58p6rCM56nyiySLuTw7ZcO'); --SALOM

------------------------------------------------------------------------------------------------
Create table BookCategory(
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
name varchar(500) unique not null
);
------------------------------------------------------------------------------------------------

CREATE TABLE book (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(500) UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    price NUMERIC(6,2),
    amount INTEGER,
    category UUID,
    FOREIGN KEY (category) REFERENCES bookcategory(id),
	file_url varchar(500),
	picture varchar(500),
	check(price >= 0),
	check(amount >= 0)
);
-----------------------------------------------------------------------------------------------------
CREATE TYPE order_status AS ENUM ('pending', 'rejected', 'accepted');

CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    users_id UUID NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(id),
    active BOOLEAN DEFAULT false,
    accept BOOLEAN DEFAULT false,
    amount INTEGER CHECK (amount > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status order_status DEFAULT 'pending'
);
CREATE TABLE order_books (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL,
    book_id UUID NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
);


