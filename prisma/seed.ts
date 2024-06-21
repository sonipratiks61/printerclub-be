import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();
const attributes = [
  { name: 'service' },
  { name: 'printing' },
  { name: 'dieShape' },
  { name: 'textureType' },
  { name: 'paperQuality' },
  { name: 'colour' },
  { name: 'paperQuanlity' }, // Assuming it's not a typo, otherwise 'paperQuality' might be intended.
  { name: 'pocket' },
  { name: 'binding' },
  { name: 'envelopeCode' },
  { name: 'flapOpening' },
  { name: 'windowCutting' },
  { name: 'paperType' },
  { name: 'size' },
  { name: 'lamination' },
  { name: 'halfCut' },
  { name: 'firstPaperQuality' },
  { name: 'secondCopyPaperColor' },
  { name: 'thirdCopyPaperColor' },
  { name: 'stickersCountPerSheet' },
  { name: 'OpenType' },
];

async function main() {
  for (const attribute of attributes) {
    await prisma.attribute.upsert({
      where: { name: attribute.name },
      update: {}, // No need to update anything if it already exists
      create: {
        ...attribute,
        createdAt: new Date(), // Use the current date for createdAt
        updatedAt: new Date(), // Use the current date for updatedAt
      },
    });
  }
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
      name: 'Admin',
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
