import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  const users = Array.from({ length: 20 }, () => ({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
  }));

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log('20 utilisateurs créés avec succès');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
