# Confunde `@default` com "o valor que costuma ser"

Usou `date DateTime @default(now())` para a data de um evento. Ou seja, usa `@default` como sugestão de valor, e não como "o que o banco grava se o insert esquecer a coluna". Quando a lição 2 mostrar inserts reais, mostrar o evento que nasce com a data errada sem nenhum erro, e reforçar a regra: campo que precisa vir do usuário fica obrigatório e sem default.

**Evidência:** `exercises/0001-do-model-a-tabela/meu-projeto.prisma`. Foi corrigido na revisão, mas ainda não houve prova de que ele aprendeu.
