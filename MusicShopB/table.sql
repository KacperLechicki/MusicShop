create table usert (
    id serial primary key,
    name varchar(255),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(255),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

insert into usert(name, contactNumber, email, password, status, role) values ('admin', '123456789', 'admin@gmail.com', 'password', 'true', 'admin');

create table category (
    id serial not null,
    name varchar(255) not null,
    primary key (id)
);
