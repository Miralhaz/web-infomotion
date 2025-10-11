DROP DATABASE IF EXISTS `infomotion`;
CREATE SCHEMA IF NOT EXISTS `infomotion`;
USE `infomotion` ;

CREATE TABLE IF NOT EXISTS `infomotion`.`empresa` (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(40),
  cnpj CHAR(18),
  ativa TINYINT,
  dt_cadastro datetime default current_timestamp,
  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS infomotion.servidor (
  id INT NOT NULL AUTO_INCREMENT,
  fk_empresa INT,
  apelido VARCHAR(20),
  ip VARCHAR(15),
  dt_cadastro datetime default current_timestamp,
  ativo tinyint,
  PRIMARY KEY (id),
  CONSTRAINT servidor_ibfk_1
  FOREIGN KEY (fk_empresa) REFERENCES infomotion.empresa (id)
);

CREATE TABLE IF NOT EXISTS infomotion.registro_servidor (
	id INT PRIMARY KEY AUTO_INCREMENT,
	fk_servidor INT,
    uso_cpu DECIMAL(10, 2),
    uso_ram DECIMAL(10, 2),
    uso_disco DECIMAL(10, 2),
    qtd_processos INT,
    temp_cpu DECIMAL(10, 2),
    temp_disco DECIMAL(10, 2),
    CONSTRAINT registro_servidor_ibfk_1
    FOREIGN KEY (fk_empresa) REFERENCES infomotion.servidor (id)
);

CREATE TABLE IF NOT EXISTS infomotion.componentes (
  id INT NOT NULL AUTO_INCREMENT,
  fk_servidor INT,
  tipo VARCHAR(40),
  numero_serie INT, /* Armazenará se é o componete 01, 02, 03, etc */
  apelido varchar(20),
  dt_cadastro datetime default current_timestamp,
  ativo tinyint,
  PRIMARY KEY (id),
  UNIQUE (fk_servidor, numero_serie, tipo),
  CONSTRAINT componentes_ibfk_1
  FOREIGN KEY (fk_servidor) REFERENCES infomotion.servidor (id)
);


CREATE TABLE IF NOT EXISTS infomotion.parametro_alerta (
  id INT NOT NULL AUTO_INCREMENT,
  fk_servidor INT,
  fk_componente INT,
  max VARCHAR(5),
  duracao_min VARCHAR(10),
  unidade_medida VARCHAR(10),
  PRIMARY KEY (id),
  CONSTRAINT parametro_alerta_ibfk_1
  FOREIGN KEY (fk_servidor) REFERENCES infomotion.servidor (id),
  constraint parametro_alerta_ibfk_2 foreign key (fk_componente) references infomotion.componentes(id)
);

CREATE TABLE IF NOT EXISTS infomotion.usuario (
  id INT NOT NULL AUTO_INCREMENT,
  fk_empresa INT,
  cargo VARCHAR(20),
  nome VARCHAR(40),
  senha VARCHAR(25),
  email VARCHAR(30),
  ativo TINYINT NULL,
  dt_cadastro datetime default current_timestamp,
  PRIMARY KEY (id),
  CONSTRAINT usuario_ibfk_1
  FOREIGN KEY (fk_empresa) REFERENCES infomotion.empresa (id)
);


CREATE TABLE IF NOT EXISTS infomotion.alertas (
  id INT NOT NULL,
  fk_parametro INT,
  dt_registro datetime default current_timestamp,
  duracao varchar(45),
  max decimal(10,2),
  min decimal(10,2),
  PRIMARY KEY (id),
  CONSTRAINT fk_alertas_parametro_alerta1
  FOREIGN KEY (fk_parametro) REFERENCES infomotion.parametro_alerta (id)
);

CREATE TABLE IF NOT EXISTS infomotion.usuario_has_servidor (
  fk_usuario INT NOT NULL,
  fk_servidor INT NOT NULL,
  dt_cadastro datetime default current_timestamp,
  PRIMARY KEY (fk_usuario, fk_servidor),
  CONSTRAINT fk_usuario_has_servidor_usuario1
  FOREIGN KEY (fk_usuario) REFERENCES infomotion.usuario (id),
  CONSTRAINT fk_usuario_has_servidor_servidor1
  FOREIGN KEY (fk_servidor) REFERENCES infomotion.servidor (id)
);

INSERT INTO empresa (nome, cnpj, ativa)
VALUES 
('TechMotion', '12.345.678/0001-90', 1),
('InfoData Ltda', '98.765.432/0001-10', 1),
('ServerX Solutions', '45.987.123/0001-55', 0);

INSERT INTO servidor (fk_empresa, apelido, ip, ativo)
VALUES
(1, 'srv-tech-01', '192.168.0.10', 1),
(1, 'srv-tech-02', '192.168.0.11', 1),
(2, 'srv-infodata', '10.0.0.5', 1),
(3, 'srv-x-backup', '172.16.0.9', 0);

INSERT INTO infomotion.componentes (fk_servidor, tipo, numero_serie, apelido, ativo)
VALUES
(1, 'CPU', 19, 'Xeon Silver 4110', 1),
(1, 'RAM', 20, 'Memória DDR4 32GB', 1),
(1, 'DISCO', 21, 'SSD Samsung 1TB', 1),
(1, 'CPU', 22, 'Ryzen Threadripper', 1),
(1, 'RAM', 23, 'Memória DDR5 64GB', 1),
(1, 'DISCO', 24, 'NVMe WD 2TB', 1),
(1, 'CPU', 25, 'Intel i9 11900K', 1),
(1, 'RAM', 26, 'Memória ECC 128GB', 1),
(1, 'DISCO', 27, 'HDD Seagate 4TB', 1),
(1, 'DISCO', 28, 'SSD Kingston 512GB', 1);

INSERT INTO registro_servidor (fk_servidor, uso_cpu, uso_ram, uso_disco)
VALUES
(1, 28.71, 62.34, 91.23),
(2, 33.42, 81.23, 71.6);

-- PARÂMETROS DE ALERTA
INSERT INTO infomotion.parametro_alerta (fk_servidor, fk_componente, max, duracao_min, unidade_medida)
VALUES
(1, 1, '90', '5', '%'),  
(1, 2, '85', '10', '%'),  
(1, 3, '80', '15', '%'),
(1, 4, '92', '6', '%'),  
(1, 5, '87', '8', '%'),  
(1, 6, '88', '12', '%'),  
(1, 7, '93', '7', '%'),  
(1, 8, '89', '9', '%'),   
(1, 9, '75', '20', '%'), 
(1, 10, '83', '14', '%');  


INSERT INTO usuario (fk_empresa, cargo, nome, senha, email, ativo)
VALUES
(1, "admin", "Gabriel", '123456', 'email@.', 1),
(2, 'Gerente', 'Pedro Santos', 'infodata321', 'pedro@infodata.com', 1),
(3, 'Suporte', 'Ana Costa', 'backup987', 'ana@serverx.com', 0);

INSERT INTO alertas (id, fk_parametro, duracao, max, min)
VALUES
(1, 1, '8min', 95.2, 70.1);


INSERT INTO usuario_has_servidor (fk_usuario, fk_servidor)
VALUES
(1, 1),
(2, 1);


/* select * from servidor;
select fk_servidor, tipo, numero_serie, apelido, date_format(dt_cadastro, '%d/%m/%Y %H:%i:%s') from componentes;
select * from empresa;
select * from usuario;
select * from componentes;

 select
 c.tipo,
 c.apelido,
 s.id,
 p.max,
 p.unidade_medida as un
 from componentes as c
 inner join servidor as s on c.fk_servidor = s.id
 inner join parametro_alerta as p on p.fk_servidor = s.id;
 
 */
 
 