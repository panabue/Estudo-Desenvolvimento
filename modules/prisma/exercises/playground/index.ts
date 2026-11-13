import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "./prisma/contract.d.ts";
import contractJson from "./prisma/contract.json" with { type: "json" };

const db = postgres({
  contract: contractFromJson<Contract>(contractJson),
  url: process.env["DATABASE_URL"]!,
});

async function main() {
  // Começa com a tabela vazia para você poder rodar várias vezes.
  await db.orm.public.Event.where({}).deleteAll();

  const event = await db.orm.public.Event.create({
    name: "Tech Day",
    date: new Date("2026-12-05T19:00:00-03:00"),
    theme: "Web",
    minutes: 90,
    company: "Acme",
  });
  console.log("Criado:", event);

  const event2 = await db.orm.public.Event.create({
    name: "Dev day",
    date: new Date("2026-12-05T19:00:00-03:00"),
    theme: "Web",
    minutes: 90,
    company: "Acme",
  });
  console.log("Criado:", event2);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
