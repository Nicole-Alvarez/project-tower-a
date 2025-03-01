import { faker } from "@faker-js/faker";
import { PrismaClient, MobType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.mob.deleteMany();

  // Create users
  const users = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
      });
    })
  );

  // Create mobs
  const mobs = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return prisma.mob.create({
        data: {
          mob_id: faker.string.uuid(),
          name: faker.word.noun(),
          type: faker.helpers.arrayElement(Object.values(MobType)),
          health: faker.number.int({ min: 50, max: 500 }),
          skill: faker.word.adjective(),
        },
      });
    })
  );

  console.log("Database seeded successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
