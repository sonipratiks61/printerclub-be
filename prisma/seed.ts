import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  await prisma.role.upsert({
    where: { name: 'User' },
    update: {}, // No need to update anything if it already exists
    create: {
      name: 'User',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {}, // No need to update anything if it already exists
    create: {
      name: 'User',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.capability.upsert({
    where: { name: 'getProfile' },
    update: {}, // No need to update anything if it already exists
    create: {
      name: 'getProfile',
      roleId: 1,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.capability.upsert({
    where: { name: 'forgetPassword' },
    update: {},
    create: {
      name: 'forgetPassword',
      roleId: 1,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.capability.upsert({
    where: { name: 'getProfile' },
    update: {}, // No need to update anything if it already exists
    create: {
      name: 'getProfile',
      roleId: 1,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.capability.upsert({
    where: { name: 'createAttachment' },
    update: {},
    create: {
      name: 'createAttachment',
      roleId: 1,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.capability.upsert({
    where: { name: 'createAttachment' },
    update: {},
    create: {
      name: 'deletedAttachment',
      roleId: 1,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  console.log('insert Successfully');
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
