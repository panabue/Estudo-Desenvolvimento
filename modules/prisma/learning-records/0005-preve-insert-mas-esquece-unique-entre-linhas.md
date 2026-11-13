# Prevê INSERTs com segurança, mas checou unicidade só dentro da linha

Acertou 4 de 5 previsões: NULL quando a coluna é omitida, erro 23502 quando falta um campo NOT NULL, e o id queimado pelo insert que falhou (deu `id:4` ao insert 4, ou seja, entendeu que o id 3 se perdeu). Na pergunta extra, explicou sem ajuda a lacuna "sem CPF e sem CNPJ": os dois campos aceitam NULL ao mesmo tempo.

**Erro:** previu que o insert 4 seria gravado, mas o CNPJ `12345678000199` já pertencia à Beta (insert 2), então o resultado é erro 23505. Ou seja, olhou cada insert isolado e não comparou com as linhas que já estavam na tabela. Reforçar que a unicidade é uma regra **entre linhas**: ao prever, compare sempre com o estado atual da tabela. A chave estrangeira (lição 3) também é uma regra entre linhas, então vale reaproveitar esse ponto lá.

O terreno está pronto para ensinar a restrição CHECK (CPF **ou** CNPJ): o aluno enxergou o problema por conta própria.

**Evidência:** `exercises/0002-o-que-o-banco-faz-com-o-insert/previsoes.sql` (2026-11-13).
