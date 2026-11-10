# Notas do professor

## Preferências do aluno
- Texto das lições em **português**; código, nomes de campos e comandos em **inglês**.
- Prefere estudar **no navegador** (lições interativas) e depois **praticar localmente**. Cada lição deve terminar com um passo opcional "pratique no seu computador".
- Estuda um pouco por dia, sem horário fixo: lições de 10 a 15 minutos.
- Quer "tudo o que for fundamental": vale ensinar conceitos de banco relacional (SQL, normalização) junto com Prisma, não só a API.
- É frontend com TS forte: usar analogias com tipos/interfaces do TypeScript. Node.js é fraco: explicar npm/scripts/ESM quando aparecerem.

## Notas de trabalho
- **Versão:** Prisma ORM 8 (RC, é o que `npm install prisma` instala hoje, nov/2026). Ensinar a sintaxe do v8: `contract.prisma` com `// use prisma-8` na primeira linha, `@onCreate(uuid())` em vez de `@default(uuid())`, `temporal.UpdatedAt` em vez de `@updatedAt`, `npx prisma contract emit` em vez de `prisma generate`, client `db.orm`, many-to-many só com modelo de junção explícito. A maioria dos tutoriais da internet é v5–v7: avisar o aluno.
- Glossário em `reference/glossario.html`: respeitar os termos dele em todas as lições (ex.: "campo de ligação" = link field).
- Assets: `assets/style.css` (tema), `assets/quiz.js` (quiz de múltipla escolha com feedback imediato; declarativo via `data-*`).
