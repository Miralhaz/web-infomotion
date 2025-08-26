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

create table alerta(
	id int primary key auto_increment,
    fk_servidor int,
    foreign key (fk_servidor) references servidor(id),
    tipo varchar(40),
    nivel varchar(15),
    dataHora datetime,
    descricao varchar(50)
);

insert into empresa (nome, cnpj) values
('Uber', '12345678000199'),
('99', '98765432000111');

insert into cargo (nome) values
('Gestor de Infraestrutura'),
('Suporte de Infraestrutura');

insert into usuario (fk_empresa, fk_cargo, nome, senha, email) values
(1, 2, 'Carlos Silva', 'senha123', 'carlos.silva@uber.com'),
(1, 1, 'Mariana Souza', 'senha123', 'mariana.souza@uber.com'),
(2, 2, 'João Pereira', 'senha123', 'joao.pereira@99.com'),
(2, 1, 'Ana Costa', 'senha123', 'ana.costa@99.com');

insert into servidor (fk_empresa, nome, ip) values
(1, 'Servidor Uber 01', '192.168.0.10'),
(2, 'Servidor 99 01', '192.168.0.20');

insert into alerta (fk_servidor, tipo, nivel, dataHora, descricao) values
(1, 'CPU', 'Alto', '2025-08-20 10:15:00', 'Uso de CPU acima de 90%'),
(1, 'Memória', 'Médio', '2025-08-20 11:00:00', 'Consumo de RAM em 75%'),
(1, 'Disco', 'Crítico', '2025-08-21 09:45:00', 'Espaço em disco abaixo de 5%'),
(1, 'CPU', 'Médio', '2025-08-22 08:30:00', 'Processos consumindo CPU constante'),
(1, 'Memória', 'Alto', '2025-08-22 13:20:00', 'Uso de memória acima de 85%');

insert into alerta (fk_servidor, tipo, nivel, dataHora, descricao) values
(2, 'CPU', 'Médio', '2025-08-20 08:50:00', 'CPU em uso constante de 70%'),
(2, 'Memória', 'Crítico', '2025-08-20 09:30:00', 'RAM próxima ao limite'),
(2, 'Disco', 'Alto', '2025-08-21 13:10:00', 'Disco rígido com 10% livre'),
(2, 'CPU', 'Alto', '2025-08-22 10:45:00', 'Sobrecarga de processos no servidor'),
(2, 'Memória', 'Médio', '2025-08-22 16:00:00', 'Consumo de memória acima de 70%');


select * from empresa;
select * from cargo;
select * from usuario;
select * from servidor;
select * from alerta;