# Recursos: Prisma + PostgreSQL

## Conhecimento

- [Docs: What is Prisma ORM? (prisma.io)](https://www.prisma.io/docs/orm)
  Visão geral oficial do Prisma ORM 8: contrato, `db` gerado, migrations, CLI. Use para: o fluxo geral e os links de quickstart.
- [Docs: Data modeling (prisma.io)](https://www.prisma.io/docs/orm/data-modeling)
  Models, chaves primárias (naturais, substitutas, compostas), escalares, relações, orientação de escolha de tipos. Use para: qualquer lição de modelagem. É a fonte principal da missão.
- [Docs: Author the contract in PSL (prisma.io)](https://www.prisma.io/docs/orm/contract-authoring/psl-syntax)
  Sintaxe exata: `// use prisma-8`, `@id`, `@default`, `@onCreate`, `@unique`, `@map`/`@@map`, `temporal.*`. Use para: conferir a sintaxe antes de pôr código numa lição.
- [Docs: Relational databases modeling (prisma.io)](https://www.prisma.io/docs/orm/data-modeling/relational-databases)
  Relações 1-1, 1-N, N-N (com modelo de junção) e chaves compostas. Use para: as lições de relações.
- [Docs: Coming from Prisma ORM 7 (prisma.io)](https://www.prisma.io/docs/orm/coming-from-prisma-orm-7)
  Tabela de equivalência v7 → v8. Use para: "traduzir" tutoriais antigos que o aluno encontrar.
- [Docs: Quickstart PostgreSQL (prisma.io)](https://prisma.io/docs/prisma-orm/quickstart/postgresql)
  Setup do zero. Use para: a primeira prática local. Com `npx create-db` dá para criar um Postgres temporário sem cadastro.
- [Docs: Set up Prisma ORM from scratch (prisma.io)](https://prisma.io/docs/prisma-orm/from-scratch)
  Setup manual com npm, `prisma.config.ts`, contrato, `contract emit`, `db init`, script com `db.orm` e primeira migration. Use para: o `exercises/playground/`.
- [Docs: Writing data (prisma.io)](https://prisma.io/docs/orm/fundamentals/writing-data)
  `create`, `select`, erros (`error.sqlState`, `23505`). Use para: lições de escrita.
- [Docs: PostgreSQL Default Values](https://www.postgresql.org/docs/current/ddl-default.html) e [Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
  O que o banco faz com colunas omitidas; NOT NULL, UNIQUE (NULLs distintos), PK, FK, CHECK. Use para: a regra "CPF ou CNPJ" (CHECK) e a lição de FK.
- [Docs: PostgreSQL Tutorial (postgresql.org)](https://www.postgresql.org/docs/current/tutorial.html)
  Tutorial oficial do PostgreSQL 18: conceitos, SQL básico, JOINs, chaves estrangeiras. Use para: fundamentos de banco e SQL.

## Sabedoria (Comunidades)

- [Prisma Discord](https://pris.ly/discord)
  Comunidade oficial, com a equipe do Prisma presente. Use para: dúvidas de modelagem e de migração para o v8.
- [GitHub Discussions do Prisma](https://pris.ly/github)
  Use para: bugs e comportamento estranho do v8 RC.

## Lacunas
- Falta um bom recurso sobre **normalização / design de schema** independente do Prisma (para "banco bem estruturado"). Procurar antes das lições de modelagem.
- Quase todo tutorial em vídeo e em português cobre v5–v7. Falta material confiável específico do v8.
