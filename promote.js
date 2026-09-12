const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'lf49127@gmail.com' },
    update: { role: 'ADMIN' },
    create: { email: 'lf49127@gmail.com', name: 'Luiz Admin', role: 'ADMIN' }
  });
  console.log('User made ADMIN:', user.email);
}
main().finally(() => prisma.$disconnect());
