# Pensa em unicidade como regra de negócio, mas guarda texto onde deveria haver uma relação

Para dizer "cada empresa realiza só 1 evento", pôs `company String @unique` em `Event`. Isso mostra um bom instinto (transformar a regra numa restrição do banco), mas duplica `Company.name` e quebra com empresas de mesmo nome. É o gancho ideal para chave estrangeira e relação 1-1 (`companyId Int @unique`): abrir a lição de relações com esse caso, que é dele.

**Evidência:** `exercises/0001-do-model-a-tabela/meu-projeto.prisma` (2026-11-13).
