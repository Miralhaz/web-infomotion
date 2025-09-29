DROP DATABASE IF EXISTS `infomotion`;
CREATE SCHEMA IF NOT EXISTS `infomotion`;
USE `infomotion` ;

CREATE TABLE IF NOT EXISTS `infomotion`.`empresa` (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(40),
  cnpj CHAR(14),
  ativa TINYINT,
  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS infomotion.servidor (
  id INT NOT NULL AUTO_INCREMENT,
  fk_empresa INT,
  nome VARCHAR(40),
  ip VARCHAR(15),
  PRIMARY KEY (id),
  CONSTRAINT servidor_ibfk_1
    FOREIGN KEY (fk_empresa) REFERENCES infomotion.empresa (id)
);


CREATE TABLE IF NOT EXISTS infomotion.componentes (
  id INT NOT NULL AUTO_INCREMENT,
  fk_servidor INT,
  tipo VARCHAR(40),
  numero_serie INT, /* Armazenará se é o componete 01, 02, 03, etc */
  apelido varchar(20),
  dt_cadastro datetime default current_timestamp,
  PRIMARY KEY (id),
  UNIQUE (fk_servidor, numero_serie, tipo),
  CONSTRAINT componentes_ibfk_1
    FOREIGN KEY (fk_servidor) REFERENCES infomotion.servidor (id)
);


CREATE TABLE IF NOT EXISTS infomotion.parametro_alerta (
  id INT NOT NULL AUTO_INCREMENT,
  fk_servidor INT,
  componente VARCHAR(15),
  min VARCHAR(5),
  max VARCHAR(5),
  duracao_min VARCHAR(10),
  unidade_medida VARCHAR(10),
  PRIMARY KEY (id),
  CONSTRAINT parametro_alerta_ibfk_1
    FOREIGN KEY (fk_servidor) REFERENCES infomotion.servidor (id)
);

CREATE TABLE IF NOT EXISTS infomotion.usuario (
  id INT NOT NULL AUTO_INCREMENT,
  fk_empresa INT,
  cargo VARCHAR(20),
  nome VARCHAR(40),
  senha VARCHAR(25),
  email VARCHAR(30),
  ativo TINYINT NULL,
  PRIMARY KEY (id),
  CONSTRAINT usuario_ibfk_1
    FOREIGN KEY (fk_empresa) REFERENCES infomotion.empresa (id)
);


CREATE TABLE IF NOT EXISTS infomotion.alertas (
  id INT NOT NULL,
  fk_parametro INT,
  dado_registrado VARCHAR(45),
  PRIMARY KEY (id),
  CONSTRAINT fk_alertas_parametro_alerta1
    FOREIGN KEY (fk_parametro) REFERENCES infomotion.parametro_alerta (id)
);

CREATE TABLE IF NOT EXISTS infomotion.usuario_has_servidor (
  fk_usuario INT NOT NULL,
  fk_servidor INT NOT NULL,
  PRIMARY KEY (fk_usuario, fk_servidor),
  CONSTRAINT fk_usuario_has_servidor_usuario1
    FOREIGN KEY (fk_usuario) REFERENCES infomotion.usuario (id),
  CONSTRAINT fk_usuario_has_servidor_servidor1
    FOREIGN KEY (fk_servidor) REFERENCES infomotion.servidor (id)
);

insert into empresa (nome, cnpj, ativa) 
	values('Empresa teste', 12345678101214, 1),
			('Empresa teste2', 22345678101214, 1);

insert into servidor (fk_empresa, nome, ip)
	values(1,'Servidor Teste', '12.232.221-12'),
		(2,'Servidor Teste2', '22.232.221-12');

insert into servidor (fk_empresa, nome, ip)
	values(1,'Servidor Teste2', '13.232.221-12');

insert into componentes(fk_servidor, tipo, numero_serie, apelido)
	values(1, 'CPU', 01, 'CPU TESTE1'),
		(1, 'CPU', 02, 'CPU TESTE2'),
        (1, 'CPU', 03, 'CPU TESTE3'),
		(1, 'RAM', 01, 'RAM TESTE1'),
        (2, 'CPU', 01, 'CPU TESTE1sv2'),
		(2, 'CPU', 02, 'CPU TESTE2sv2'),
        (2, 'CPU', 03, 'CPU TESTE3sv2'),
		(2, 'RAM', 01, 'RAM TESTEsv2');
        

insert into usuario(fk_empresa, cargo, nome, senha, email, ativo)
	values (1, "admin", "Gabriel", '123456', 'email@.', 1),
		   (1, "gestor", "Tadeu", '123456', 'gmail@.', 1);
     
insert into usuario_has_servidor (fk_servidor, fk_usuario)
	values(1, 1),
		  (2, 2); 

select * from servidor;
select fk_servidor, tipo, numero_serie, apelido, date_format(dt_cadastro, '%d/%m/%Y %H:%i:%s') from componentes;
select * from empresa;
select * from usuario;
select * from usuario_has_servidor;
