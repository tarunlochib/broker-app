import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: "admin", name: "Admin" },
    create: { email: "admin@example.com", role: "admin", name: "Admin" },
  });

  await prisma.user.upsert({
    where: { email: "broker@example.com" },
    update: { role: "broker", name: "Broker" },
    create: { email: "broker@example.com", role: "broker", name: "Broker" },
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});


