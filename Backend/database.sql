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
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

insert into super_admin (fullname, username, password) values 
('feylon1409', 'jamshid1409', '$2b$10$Q2YXQMGKDDl7I4NFbGNuje54bxtKCFX58p6rCM56nyiySLuTw7ZcO'); --SALOM
