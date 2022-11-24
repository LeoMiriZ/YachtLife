-- Esse script vale para o MySQL 8.x. Se seu MySQL for 5.x, precisa executar essa linha comentada:
-- CREATE DATABASE IF NOT EXISTS embarcacoes;
CREATE DATABASE IF NOT EXISTS embarcacoes DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE embarcacoes;

CREATE TABLE modalidade (
  idmodalidade int NOT NULL,
  nome varchar(50) NOT NULL,
  PRIMARY KEY (idmodalidade)
);

INSERT INTO modalidade (idmodalidade, nome) VALUES (1, 'Aluguel'), (2, 'Venda'), (3, 'Aluguel/Venda');

CREATE TABLE embarcacao (
  idembarcacao int NOT NULL AUTO_INCREMENT,
  nome varchar(50) NOT NULL,
  tamanho int not null,
  peso int not null,
  tripulantes int not null,
  cabines int not null,
  ano int not null,
  preco int not null,
  idmodalidade int not null,
  PRIMARY KEY (idembarcacao),
  UNIQUE KEY nome_UN (nome)
);
