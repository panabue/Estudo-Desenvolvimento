# Estudo-Desenvolvimento

Repositório de estudos de programação organizado em **módulos**: cada assunto fica numa pasta própria e é estudado de forma interativa com a skill [`/teach`](https://www.aihero.dev/skills-teach) no Claude Code.

## Como funciona

A skill `/teach` transforma uma pasta num espaço de aprendizado sobre **um único tema**, que acompanha várias sessões. Em vez de depender só do conhecimento do modelo, ela:

1. Pergunta **por que** você quer aprender o tema e registra a resposta em `MISSION.md`.
2. Pesquisa fontes confiáveis e as registra em `RESOURCES.md`.
3. Gera **lições curtas em HTML**, uma por sessão, cada uma com um objetivo concreto e as fontes citadas.
4. Registra o que você já demonstrou saber em `learning-records/`, e usa isso para escolher a próxima lição.

Como o progresso fica salvo em arquivos (e não no histórico do chat), dá para fechar a sessão e continuar outro dia exatamente de onde parou.

Como a skill funciona melhor com um tema por pasta, **cada módulo deste repositório é um espaço de estudo independente**.

## Estrutura

```
Estudo-Desenvolvimento/
├── README.md
└── modules/
    ├── prisma/              ← primeiro módulo
    │   ├── MISSION.md          objetivo de aprendizado
    │   ├── RESOURCES.md        fontes confiáveis (docs, artigos, comunidades)
    │   ├── NOTES.md            preferências de ensino
    │   ├── lessons/            lições numeradas (.html)
    │   ├── reference/          cheat-sheets e glossários (.html)
    │   ├── learning-records/   registro do que já foi aprendido
    │   ├── exercises/          suas práticas, uma pasta por lição + playground/
    │   └── assets/             estilos e componentes reutilizáveis
    └── <proximo-modulo>/
```

Os arquivos dentro de cada módulo são criados pela própria skill conforme as sessões acontecem. A exceção é `exercises/`: lá ficam as suas respostas, salvas em arquivos para manter o histórico de práticas e para o professor revisar na sessão seguinte.

## Módulos

| Módulo                   | Status          | Descrição                                                                  |
| ------------------------ | --------------- | -------------------------------------------------------------------------- |
| [Prisma](modules/prisma) | 🟡 Em andamento | ORM para Node.js/TypeScript: schema, migrations, Prisma Client e consultas |

Legenda: ⚪ Planejado · 🟡 Em andamento · 🟢 Concluído

## Como estudar

### Pré-requisitos

- [Claude Code](https://claude.com/claude-code) instalado
- Skill `teach` instalada (disponível no repositório [mattpocock/skills](https://github.com/mattpocock/skills))

### Começar um módulo novo

```bash
mkdir modules/<tema>
cd modules/<tema>
claude
```

No Claude Code, rode:

```
/teach
```

Na primeira sessão, a skill vai perguntar qual é o seu objetivo. **Conte o que você já sabe e onde tem dificuldade.** Como a skill não aplica um teste de nível, essa informação evita que as primeiras lições pulem conceitos básicos.

### Continuar um módulo

Abra uma sessão nova dentro da pasta do módulo e peça a próxima lição:

```
/teach next lesson for <tema>
```

### Ao final de cada sessão

```bash
git add .
git commit -m "<tema>: lição NN - <assunto>"
git push
```

## Boas práticas

- **Uma lição por sessão.** Termine a lição, faça os exercícios e só então avance.
- **Confira nas fontes.** As lições citam a documentação oficial. Leia a fonte principal recomendada e desconfie de afirmações que não aparecem lá.
- **Pratique no código.** Sempre que possível, reproduza os exemplos num projeto de teste.
- **Atualize a tabela de módulos** neste README ao começar ou terminar um tema.

## Referências

- [Skill `/teach`, AI Hero](https://www.aihero.dev/skills-teach)
- [mattpocock/skills](https://github.com/mattpocock/skills)
- [Documentação do Prisma](https://www.prisma.io/docs)
