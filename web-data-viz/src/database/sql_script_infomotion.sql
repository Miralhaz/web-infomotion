DROP DATABASE IF EXISTS `infomotion`;
CREATE DATABASE IF NOT EXISTS `infomotion`;
USE `infomotion` ;

CREATE TABLE IF NOT EXISTS infomotion.empresa (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(40),
  cnpj CHAR(18),
  ativa TINYINT,
  dt_cadastro datetime default current_timestamp,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS infomotion.regiao (
  id INT NOT NULL AUTO_INCREMENT,
  fk_empresa int,
  nome VARCHAR(50),
  cidade VARCHAR(60),
  estado VARCHAR(60),
  pais VARCHAR(50),
  codigo_postal VARCHAR(20),
  zona VARCHAR(50),
  PRIMARY KEY (id),
  CONSTRAINT regiao_ibfk_1
  FOREIGN KEY (fk_empresa) REFERENCES infomotion.empresa (id)
);

CREATE TABLE IF NOT EXISTS infomotion.servidor (
  id INT NOT NULL AUTO_INCREMENT,
  fk_empresa INT,
  fk_regiao INT,
  apelido VARCHAR(40),
  ip VARCHAR(15),
  dt_cadastro datetime default current_timestamp,
  ativo tinyint,
  PRIMARY KEY (id),
  CONSTRAINT servidor_ibfk_1
  FOREIGN KEY (fk_empresa) REFERENCES infomotion.empresa (id),
  CONSTRAINT servidor_ibfk_2
  FOREIGN KEY (fk_regiao) REFERENCES infomotion.regiao (id)
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
  cargo ENUM('Gestor', 'Suporte'),
  nome VARCHAR(40),
  senha VARCHAR(25),
  email VARCHAR(30),
  ativo TINYINT NULL,
  imagem_url VARCHAR(255),
  dt_cadastro datetime default current_timestamp,
  PRIMARY KEY (id),
  CONSTRAINT usuario_ibfk_1
  FOREIGN KEY (fk_empresa) REFERENCES infomotion.empresa (id)
);

CREATE TABLE IF NOT EXISTS infomotion.alertas (
  id INT NOT NULL auto_increment,
  fk_parametro INT,
  dt_registro datetime default current_timestamp,
  dt_alerta datetime,
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

create table if not exists infomotion.especificacao_componente (
id int auto_increment primary key,
nome_especificacao varchar(100),
valor varchar(100),
fk_componente int not null,
dt_cadastro datetime default current_timestamp,
foreign key (fk_componente) references componentes(id)
);

INSERT INTO empresa (nome, cnpj, ativa)
VALUES 
('TechMotion', '12.345.678/0001-90', 1),
('InfoData Ltda', '98.765.432/0001-10', 1),
('ServerX Solutions', '45.987.123/0001-55', 0);

INSERT INTO usuario (fk_empresa, cargo, nome, senha, email, ativo, imagem_url)
VALUES
(1, 'Gestor', 'Veronica', '123456', 'veronica@email.com', 1, '/assets/pacote-pessoas/veronica.png'),
(1, 'Suporte', "Gabriel", '123456', 'email@.', 1, '/assets/pacote-pessoas/gabriel.png'),
(1, 'Gestor', 'Pedro Santos', 'infodata321', 'pedro@infodata.com', 1, '/assets/pacote-pessoas/adolescente-calma-com-os-bracos-cruzados.jpg'),
(1, 'Suporte', 'Ana Costa', 'backup987', 'ana@serverx.com', 0, '/assets/pacote-pessoas/vista-frontal-da-elegante-mulher-de-negocios-segurando-prancheta-com-espaco-de-copia.jpg'),
(1,'Suporte', 'Renata Silva', '123456', 'renata@email.com', 1, '/assets/pacote-pessoas/retrato-de-mulher-corporativa-segurando-prancheta-no-trabalho-em-pe-com-roupa-formal-sobre-fundo-branco.jpg');
 
INSERT INTO regiao (fk_empresa, nome, cidade, estado, pais, codigo_postal, zona)
VALUES
(1, 'Região Sudeste', 'São Paulo', 'SP', 'Brasil', '01000-000', 'UTC-3'),
(1, 'Região Leste dos EUA', 'Ashburn', 'VA', 'Estados Unidos', '20147', 'UTC-5'),
(1, 'Região Europa Central', 'Frankfurt', 'HE', 'Alemanha', '60311', 'UTC+1'),
(1, 'Região Ásia Leste', 'Tóquio', 'TK', 'Japão', '100-0001', 'UTC+9'),
(1, 'Região Oceania', 'Sydney', 'NSW', 'Austrália', '2000', 'UTC+10'),
(1, 'Região América Norte', 'Toronto', 'ON', 'Canadá', 'M5H 2N2', 'UTC-5'),
(1, 'Região Europa Oeste', 'Londres', 'LDN', 'Reino Unido', 'SW1A 1AA', 'UTC+0'),
(1, 'Região Europa Sudoeste', 'Lisboa', 'LX', 'Portugal', '1000-001', 'UTC+0'),
(1, 'Região Oriente Médio', 'Dubai', 'DU', 'Emirados Árabes Unidos', '00000', 'UTC+4'),
(1, 'Região América Central', 'Cidade do México', 'CDMX', 'México', '01000', 'UTC-6');
