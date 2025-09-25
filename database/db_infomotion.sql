create database infomotion;
use infomotion;

create table empresa(
	id int primary key auto_increment,
    nome varchar(40),
    cnpj char(14) not null
);

create table cargo(
	id int primary key auto_increment,
    nome varchar(25)
);

create table usuario(
	id int primary key auto_increment,
    fk_empresa int,
    foreign key (fk_empresa) references empresa(id),
    fk_cargo int,
    foreign key (fk_cargo) references cargo(id),
    nome varchar(40) not null,
    senha varchar(25) not null,
    email varchar(30)
);

create table servidor(
	id int primary key auto_increment,
	fk_empresa int,
    foreign key (fk_empresa) references empresa(id),
    nome varchar(40),
    ip varchar(15)
);

create table componentes(
	id int primary key auto_increment,
    fk_servidor int,
    foreign key (fk_servidor) references servidor(id),
    processador varchar(40),
    ram varchar(20),
    disco varchar(20)
);

create table parametro_alerta(
	id int primary key auto_increment,
    fk_servidor int,
    foreign key (fk_servidor) references servidor(id),
    limite_processador varchar(15),
    limite_ram varchar(15),
    limite_disco varchar(15)
);

insert into empresa (nome, cnpj) values
('Uber', '12345678000199'),
('99', '98765432000111');

insert into cargo (nome) values
('Gestor de Infraestrutura'),
('Suporte de Infraestrutura');

insert into usuario (fk_empresa, fk_cargo, nome, senha, email) values
(1, 1, 'Mariana Souza', 'senha123', 'mariana.souza@uber.com'),
(1, 2, 'Carlos Silva', 'senha123', 'carlos.silva@uber.com'),
(2, 1, 'Ana Costa', 'senha123', 'ana.costa@99.com'),
(2, 2, 'João Pereira', 'senha123', 'joao.pereira@99.com');

insert into servidor (fk_empresa, nome, ip) values
(1, 'Servidor Uber 01', '192.168.0.10'),
(1, 'Servidor Uber 02', '192.168.0.11'),
(2, 'Servidor 99 01', '192.168.0.20'),
(2, 'Servidor 99 02', '192.168.0.21');

insert into componentes (fk_servidor, processador, ram, disco) values
(1, 'Intel Xeon E5-2670', '64GB', '2TB SSD'),
(2, 'Intel Xeon E5-2690', '128GB', '4TB SSD'),
(3, 'AMD EPYC 7501', '64GB', '2TB HDD'),
(4, 'AMD EPYC 7702', '128GB', '4TB SSD');

insert into parametro_alerta (fk_servidor, limite_processador, limite_ram, limite_disco) values
(1, '85%', '80%', '15%'),
(2, '90%', '85%', '10%'),
(3, '80%', '75%', '20%'),
(4, '88%', '82%', '12%');

select u.id, u.nome, c.nome as cargo from usuario u
        inner join empresa e on u.fk_empresa = e.id
        inner join cargo c on u.fk_cargo = c.id
        where e.id = 1;

select * from empresa;
select * from cargo;
select * from usuario;
select * from servidor;
select * from componentes;
select * from parametro_alerta;