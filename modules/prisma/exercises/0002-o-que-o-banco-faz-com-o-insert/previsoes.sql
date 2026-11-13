-- Exercício da Lição 2: preveja o resultado de cada INSERT ANTES de conferir no simulador.
-- Tabela (do seu model Company):
--   id    integer PRIMARY KEY (autoincrement)
--   name  text NOT NULL
--   ceo   text NOT NULL
--   state text NOT NULL
--   cnpj  text UNIQUE        (String? @unique)
--   cpf   text UNIQUE        (String? @unique)
-- Os inserts rodam nesta ordem, na tabela começando vazia.
-- Escreva em cada "Previsão": "gravado, id = ?, o banco preencheu: ..." ou "erro ?????, porque ...".

-- 1
INSERT INTO "Company" ("name", "ceo", "state") VALUES ('Acme', 'Ana', 'SP');
-- Previsão: Gravado, {id:1;name:Acme;ceo:Ana;state:SP;cnpj:NULL;cpf:NULL}

-- 2
INSERT INTO "Company" ("name", "ceo", "state", "cnpj") VALUES ('Beta', 'Bruno', 'RJ', '12345678000199');
-- Previsão: Gravado, {id:2;name:Beta;ceo:Bruno;state:RJ;cnpj:12345678000199;cpf:NULL}

-- 3
INSERT INTO "Company" ("name", "ceo", "cnpj") VALUES ('Gama', 'Gil', '98765432000111');
-- Previsão: Erro 23502 (sem state)

-- 4
INSERT INTO "Company" ("name", "ceo", "state", "cnpj") VALUES ('Gama', 'Gil', 'MG', '12345678000199');
-- Previsão: Gravado, {id:4;name:Gama;ceo:Gil;state:MG;cnpj:12345678000199;cpf:NULL}

-- 5
INSERT INTO "Company" ("name", "ceo", "state", "cpf") VALUES ('Delta', 'Duda', 'BA', '11122233344');
-- Previsão: Gravado, {id:5;name:Delta;ceo:Duda;state:BA;cnpj:NULL;cpf:11122233344}

-- Pergunta extra: depois dos 5, olhe a linha da 'Acme'. Que regra do seu app ela quebra,
-- e por que o banco deixou passar?
-- Resposta: A empresa fica sem cpf e cnpj. O banco deixa passar pois a declaração das colunas permite que os dois sejam nulos ao mesmo tempo.


-- Prática local (opcional): O script apaga todos os eventos no começo e cria o Tech Day de novo. Rodando npx tsx index.ts mais uma vez, qual id vai aparecer?
-- Resposta: o id 2, pois o primeiro foi 1.

-- Experimento 1, esquecer a data: comente a linha date: ... com //, olhe se o editor sublinha algo em vermelho e rode.
-- Resposta: sqlState: '23502'

-- Experimento 2, repetir a empresa: volte a linha da data e, logo depois do primeiro create, adicione um segundo create com outro name e o mesmo company: "Acme".
-- Resposta: sqlState: '23505'
