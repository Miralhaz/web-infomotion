-- SERVIDORES (6 novos, ids 5..10)
INSERT INTO infomotion.servidor (id, fk_empresa, fk_regiao, apelido, ip, ativo)
VALUES
(5, 1, 1, 'srv-tech-03', '192.168.0.12', 1),
(6, 1, 2, 'srv-tech-04', '192.168.0.13', 1),
(7, 2, 3, 'srv-infodata-02', '10.0.0.6', 1),
(8, 2, 1, 'srv-infodata-03', '10.0.0.7', 1),
(9, 1, 2, 'srv-tech-05', '192.168.0.14', 1),
(10, 1, 3, 'srv-tech-06', '192.168.0.15', 1)
;

-- COMPONENTES (1 CPU, 1 RAM, 1 DISCO por novo servidor)
INSERT INTO infomotion.componentes (id, fk_servidor, tipo, numero_serie, apelido, ativo)
VALUES
(1001, 5, 'CPU', 1, 'Xeon Silver 4210', 1),
(1002, 5, 'RAM', 2, 'DDR4 64GB', 1),
(1003, 5, 'DISCO', 3, 'SSD NVMe 1TB', 1),
(1004, 6, 'CPU', 1, 'Intel Xeon E5', 1),
(1005, 6, 'RAM', 2, 'DDR4 32GB', 1),
(1006, 6, 'DISCO', 3, 'HDD Seagate 2TB', 1),
(1007, 7, 'CPU', 1, 'Ryzen 9 5900X', 1),
(1008, 7, 'RAM', 2, 'DDR5 64GB', 1),
(1009, 7, 'DISCO', 3, 'NVMe Kingston 1TB', 1),
(1010, 8, 'CPU', 1, 'Intel i7 12700K', 1),
(1011, 8, 'RAM', 2, 'DDR4 16GB', 1),
(1012, 8, 'DISCO', 3, 'SSD Crucial 512GB', 1),
(1013, 9, 'CPU', 1, 'Xeon Gold 6230', 1),
(1014, 9, 'RAM', 2, 'DDR5 128GB', 1),
(1015, 9, 'DISCO', 3, 'NVMe WD 2TB', 1),
(1016, 10, 'CPU', 1, 'AMD EPYC 7402P', 1),
(1017, 10, 'RAM', 2, 'ECC 64GB', 1),
(1018, 10, 'DISCO', 3, 'HDD Toshiba 4TB', 1),
(1019, 1, 'CPU', 19, 'Xeon Silver 4110', 1),
(1020, 1, 'RAM', 20, 'Memória DDR4 32GB', 1),
(1021, 1, 'DISCO', 21, 'SSD Samsung 1TB', 1),
(1022, 2, 'CPU', 19, '19- 11900X', 1),
(1023, 2, 'RAM', 20, 'Memória DDR4 32GB', 1),
(1024, 2, 'DISCO', 21, 'HDD 1TB', 1);

-- ESPECIFICACOES (apenas nomes solicitados)
INSERT INTO infomotion.especificacao_componente (nome_especificacao, valor, fk_componente)
VALUES
('Swap total (GB)', '8', 1002),
('Ram total (GB)', '64', 1002),
('Quantidade de núcleos fisicos', '16', 1001),
('Quantidade de núcleos lógicos', '12', 1001),
('Quantidade de partições', '1', 1003),
('Swap total (GB)', '6', 1005),
('Ram total (GB)', '16', 1005),
('Quantidade de núcleos fisicos', '8', 1004),
('Quantidade de núcleos lógicos', '24', 1004),
('Quantidade de partições', '4', 1006),
('Swap total (GB)', '16', 1008),
('Ram total (GB)', '16', 1008),
('Quantidade de núcleos fisicos', '8', 1007),
('Quantidade de núcleos lógicos', '12', 1007),
('Quantidade de partições', '4', 1009),
('Swap total (GB)', '12', 1011),
('Ram total (GB)', '16', 1011),
('Quantidade de núcleos fisicos', '6', 1010),
('Quantidade de núcleos lógicos', '32', 1010),
('Quantidade de partições', '2', 1012),
('Swap total (GB)', '4', 1014),
('Ram total (GB)', '32', 1014),
('Quantidade de núcleos fisicos', '10', 1013),
('Quantidade de núcleos lógicos', '12', 1013),
('Quantidade de partições', '2', 1015),
('Swap total (GB)', '8', 1017),
('Ram total (GB)', '64', 1017),
('Quantidade de núcleos fisicos', '6', 1016),
('Quantidade de núcleos lógicos', '12', 1016),
('Quantidade de partições', '4', 1018)
;

-- PARAMETRO_ALERTA (3 por servidor, %)
INSERT INTO infomotion.parametro_alerta (id, fk_servidor, fk_componente, max, duracao_min, unidade_medida)
VALUES
(2001, 5, 1001, '92', 7, '%'),
(2002, 5, 1002, '86', 8, '%'),
(2003, 5, 1003, '75', 12, '%'),
(2004, 6, 1004, '92', 6, '%'),
(2005, 6, 1005, '84', 8, '%'),
(2006, 6, 1006, '78', 14, '%'),
(2007, 7, 1007, '93', 7, '%'),
(2008, 7, 1008, '84', 9, '%'),
(2009, 7, 1009, '74', 10, '%'),
(2010, 8, 1010, '92', 6, '%'),
(2011, 8, 1011, '86', 11, '%'),
(2012, 8, 1012, '78', 14, '%'),
(2013, 9, 1013, '93', 5, '%'),
(2014, 9, 1014, '85', 9, '%'),
(2015, 9, 1015, '75', 10, '%'),
(2016, 10, 1016, '95', 6, '%'),
(2017, 10, 1017, '82', 9, '%'),
(2018, 10, 1018, '75', 15, '%')
;

INSERT INTO infomotion.parametro_alerta (id, fk_servidor, fk_componente, max, duracao_min, unidade_medida)
VALUES
-- Servidor 5
(2019, 5, 1001, 90, 15, 'C'), -- CPU Temperatura (90°C é um limite comum)
(2020, 5, 1003, 48, 15, 'C'), -- DISCO Temperatura (48°C é um limite para SSD/HDD)

-- Servidor 6
(2021, 6, 1004, 90, 15, 'C'), -- CPU Temperatura
(2022, 6, 1006, 52, 15, 'C'), -- DISCO Temperatura

-- Servidor 7
(2023, 7, 1007, 92, 15, 'C'), -- CPU Temperatura
(2024, 7, 1009, 49, 15, 'C'), -- DISCO Temperatura

-- Servidor 8
(2025, 8, 1010, 90, 15, 'C'), -- CPU Temperatura
(2026, 8, 1012, 50, 15, 'C'), -- DISCO Temperatura

-- Servidor 9
(2027, 9, 1013, 92, 15, 'C'), -- CPU Temperatura
(2028, 9, 1015, 47, 15, 'C'), -- DISCO Temperatura

-- Servidor 10
(2029, 10, 1016, 94, 15, 'C'), -- CPU Temperatura
(2030, 10, 1018, 51, 15, 'C') -- DISCO Temperatura
;

-- USUARIO_HAS_SERVIDOR (associar usuários existentes 1 e 2 aos novos servidores)
INSERT INTO infomotion.usuario_has_servidor (fk_usuario, fk_servidor)
VALUES
(1, 5),
(2, 5),
(1, 6),
(2, 6),
(1, 7),
(2, 7),
(1, 8),
(2, 8),
(1, 9),
(2, 9),
(1, 10),
(2, 10)
;
