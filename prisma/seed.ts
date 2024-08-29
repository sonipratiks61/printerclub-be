import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
// initialize Prisma Client
const prisma = new PrismaClient();
const attributes = [
  { name: 'service' },
  { name: 'printing' },
  { name: 'dieShape' },
  { name: 'textureType' },
  { name: 'paperQuality' },
  { name: 'colour' },
  { name: 'paperQuanlity' },
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
const capabilities = [
  { name: "View Users" },
  { name: "Add User" },
  { name: "Edit User" },
  { name: "Delete User" },
  { name: "View_User_Orders" },
  { name: "Add Role" },
  { name: "Edit Role" },
  { name: "View Roles" },
  { name: "Delete Role" },
  { name: "View Orders" },
  { name: "Add Order" },
  { name: 'Add Product' },
  { name: "Edit Product" },
  { name: "View Products" },
  { name: "Delete Product" },
  { name: "Add Category" },
  { name: "View Categories" },
  { name: "Edit Category" },
  { name: "Delete Category" },
  { name: "View Invoice" },
  { name: 'Add Attribute' },
  { name: "View Attributes" },
  { name: "Edit Attribute" },
  { name: "Delete Attribute" },
  { name: "Add Status" },
  { name: "Edit Status" },
  { name: "View Status" },
  { name: "Delete Status" },
  { name: "Add Workflow" },
  { name: "Edit Workflow" },
  { name: "View Workflow" },
  { name: "Delete Workflow" },
  { name: "Update_Order_Item_Status" },
  { name: "Add Capability" },
  { name: "Edit Capability" },
  { name: "Delete Capability" },
  { name: "View Capability" },

]
async function main() {
  for (const attribute of attributes) {
    await prisma.attribute.upsert({
      where: { name: attribute.name },
      update: {},
      create: {
        ...attribute,
        createdAt: new Date(), // Use the current date for createdAt
        updatedAt: new Date(), // Use the current date for updatedAt
      },
    });
  }
  for (const capability of capabilities) {
    await prisma.capability.upsert({
      where: { name: capability.name },
      update: {
        updatedAt: new Date()
      },
      create: {
        ...capability,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }


  await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {
      name: 'Admin',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

    },
    create: {
      name: 'Admin',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.role.upsert({
    where: { name: 'Front Desk/Manager' },
    update: {},
    create: {
      name: 'Front Desk/Manager',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.role.upsert({
    where: { name: 'Accountant' },
    update: {},
    create: {
      name: 'Accountant',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.role.upsert({
    where: { name: 'Designer' },
    update: {},
    create: {
      name: 'Designer',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.role.upsert({
    where: { name: 'Workshop Manager' },
    update: {},
    create: {
      name: 'Workshop Manager',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.role.upsert({
    where: { name: 'Machine Operator' },
    update: {},
    create: {
      name: 'Machine Operator',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.role.upsert({
    where: { name: 'Out Sourcing Order' },
    update: {},
    create: {
      name: 'Out Sourcing Order',
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 1
      }
    },
    update: {
      roleId: 1,
      capabilityId: 1,
    },
    create: {
      roleId: 1,
      capabilityId: 1,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 2
      }
    },
    update: {
      roleId: 1,
      capabilityId: 2,
    },
    create: {
      roleId: 1,
      capabilityId: 2,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 3
      }
    },
    update: {
      roleId: 1,
      capabilityId: 3,
    },
    create: {
      roleId: 1,
      capabilityId: 3,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 4
      }
    },
    update: {
      roleId: 1,
      capabilityId: 4,
    },
    create: {
      roleId: 1,
      capabilityId: 4,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 5
      }
    },
    update: {
      roleId: 1,
      capabilityId: 5,
    },
    create: {
      roleId: 1,
      capabilityId: 5,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 6
      }
    },
    update: {
      roleId: 1,
      capabilityId: 6,
    },
    create: {
      roleId: 1,
      capabilityId: 6,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 7
      }
    },
    update: {
      roleId: 1,
      capabilityId: 7,
    },
    create: {
      roleId: 1,
      capabilityId: 7,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 8
      }
    },
    update: {
      roleId: 1,
      capabilityId: 8,
    },
    create: {
      roleId: 1,
      capabilityId: 8,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  }); await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 9
      }
    },
    update: {
      roleId: 1,
      capabilityId: 9,
    },
    create: {
      roleId: 1,
      capabilityId: 9,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 10
      }
    },
    update: {
      roleId: 1,
      capabilityId: 10,
    },
    create: {
      roleId: 1,
      capabilityId: 10,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 11
      }
    },
    update: {
      roleId: 1,
      capabilityId: 11,
    },
    create: {
      roleId: 1,
      capabilityId: 11,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 12
      }
    },
    update: {
      roleId: 1,
      capabilityId: 12,
    },
    create: {
      roleId: 1,
      capabilityId: 12,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 13
      }
    },
    update: {
      roleId: 1,
      capabilityId: 13,
    },
    create: {
      roleId: 1,
      capabilityId: 13,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 14
      }
    },
    update: {
      roleId: 1,
      capabilityId: 14,
    },
    create: {
      roleId: 1,
      capabilityId: 14,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 15
      }
    },
    update: {
      roleId: 1,
      capabilityId: 15,
    },
    create: {
      roleId: 1,
      capabilityId: 15,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 16
      }
    },
    update: {
      roleId: 1,
      capabilityId: 16,
    },
    create: {
      roleId: 1,
      capabilityId: 16,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 17
      }
    },
    update: {
      roleId: 1,
      capabilityId: 17,
    },
    create: {
      roleId: 1,
      capabilityId: 17,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 18
      }
    },
    update: {
      roleId: 1,
      capabilityId: 18,
    },
    create: {
      roleId: 1,
      capabilityId: 18,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 19
      }
    },
    update: {
      roleId: 1,
      capabilityId: 19,
    },
    create: {
      roleId: 1,
      capabilityId: 19,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 20
      }
    },
    update: {
      roleId: 1,
      capabilityId: 20,
    },
    create: {
      roleId: 1,
      capabilityId: 20,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 21
      }
    },
    update: {
      roleId: 1,
      capabilityId: 21,
    },
    create: {
      roleId: 1,
      capabilityId: 21,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 22
      }
    },
    update: {
      roleId: 1,
      capabilityId: 22,
    },
    create: {
      roleId: 1,
      capabilityId: 22,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 23
      }
    },
    update: {
      roleId: 1,
      capabilityId: 23,
    },
    create: {
      roleId: 1,
      capabilityId: 23,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 24
      }
    },
    update: {
      roleId: 1,
      capabilityId: 24,
    },
    create: {
      roleId: 1,
      capabilityId: 24,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 25
      }
    },
    update: {
      roleId: 1,
      capabilityId: 25,
    },
    create: {
      roleId: 1,
      capabilityId: 25,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 26
      }
    },
    update: {
      roleId: 1,
      capabilityId: 26,
    },
    create: {
      roleId: 1,
      capabilityId: 26,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 27
      }
    },
    update: {
      roleId: 1,
      capabilityId: 27,
    },
    create: {
      roleId: 1,
      capabilityId: 27,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 28
      }
    },
    update: {
      roleId: 1,
      capabilityId: 28,
    },
    create: {
      roleId: 1,
      capabilityId: 28,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 29
      }
    },
    update: {
      roleId: 1,
      capabilityId: 29,
    },
    create: {
      roleId: 1,
      capabilityId: 29,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 30
      }
    },
    update: {
      roleId: 1,
      capabilityId: 30,
    },
    create: {
      roleId: 1,
      capabilityId: 30,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 31
      }
    },
    update: {
      roleId: 1,
      capabilityId: 31,
    },
    create: {
      roleId: 1,
      capabilityId: 31,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 32
      }
    },
    update: {
      roleId: 1,
      capabilityId: 32,
    },
    create: {
      roleId: 1,
      capabilityId: 32,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 33
      }
    },
    update: {
      roleId: 1,
      capabilityId: 33,
    },
    create: {
      roleId: 1,
      capabilityId: 33,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 34
      }
    },
    update: {
      roleId: 1,
      capabilityId: 34,
    },
    create: {
      roleId: 1,
      capabilityId: 34,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 35
      }
    },
    update: {
      roleId: 1,
      capabilityId: 35,
    },
    create: {
      roleId: 1,
      capabilityId: 35,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 36
      }
    },
    update: {
      roleId: 1,
      capabilityId: 36,
    },
    create: {
      roleId: 1,
      capabilityId: 36,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 1,
        capabilityId: 37
      }
    },
    update: {
      roleId: 1,
      capabilityId: 37,
    },
    create: {
      roleId: 1,
      capabilityId: 37,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 2,
        capabilityId: 17
      }
    },
    update: {
      roleId: 2,
      capabilityId: 17,
    },
    create: {
      roleId: 2,
      capabilityId: 17,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndCapabilityMapping.upsert({
    where: {
      capabilityId_roleId: {
        roleId: 2,
        capabilityId: 14
      }
    },
    update: {
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 2,
      capabilityId: 14,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });


 
  const userData = {
    businessName: " Admin-Company",
    name: "Admin",
    email: "admin@gmail.com",
    mobileNumber: "1234567890",
    password: "Admin@123",
    isActive: true,
    gstNumber: "22AAAAA0000A1Z5", 
    acceptTerms: true,
    roleId: 1,
    createdAt: new Date('2023-07-09'),
    updatedAt: new Date('2023-07-09'),
  };

  const hashedPassword1 = await bcrypt.hash(userData.password, 8);
  userData.password = hashedPassword1;

  const data = {
    businessName: "User-Company",
    name: "User",
    email: "user@gmail.com",
    mobileNumber: "1212121212",
    password: "User@123",
    isActive: false,
    gstNumber: "23AAAAA0000A1Z6",
    acceptTerms: true,
    roleId: 2,
    createdAt: new Date('2023-07-09'),
    updatedAt: new Date('2023-07-09'),
  };

  const hashedPassword2 = await bcrypt.hash(data.password, 8);
  data.password = hashedPassword2;

  await prisma.user.upsert({
    where: { email: userData.email },
    update: {
      ...userData,
      updatedAt: new Date(),
    },
    create: userData,
  });
  await prisma.user.upsert({
    where: { email: data.email },
    update: {
      ...data,
      updatedAt: new Date(),
    },
    create: data,
  });

  await prisma.workFlow.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "User-WorkFlow",
      sequence: [2, 3, 4, 5],
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.workFlow.create({
    data: {
      name: "User-WorkFlow",
      sequence: [2, 4, 6, 8],
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    }
  })
  await prisma.address.upsert({
    where: {
      id: 1
    },
    create: {
      address: "PU-54 Backbencher Technologies",
      city: "Indore",
      pinCode: "452010",
      userId: 1,
      state: "Madhya Pradesh",
      country: "India",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    update: {
      address: "PU-54 Backbencher Technologies",
      city: "Indore",
      pinCode: "452010",
      userId: 1,
      state: "Madhya Pradesh",
      country: "India",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    }
  })

  await prisma.address.upsert({
    where: {
      id: 2
    },
    create: {
      address: "SiyaRam Colony",
      city: "Bhopal",
      pinCode: "462001",
      userId: 2,
      state: "Madhya Pradesh",
      country: "India",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    update: {
      address: "SiyaRam Colony",
      city: "Bhopal",
      pinCode: "462001",
      userId: 2,
      state: "Madhya Pradesh",
      country: "India",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    }
  })

  await prisma.category.upsert({
    where: {
      id: 1
    },
    create: {
      name: "Category1",
      type: "service",
      description: "This is Category 1",
      userId: 1, // Replace with actual user ID
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    update: {}
  })
  await prisma.category.upsert({
    where: {
      id: 2
    },
    create: {
      name: "SubCategory",
      type: "service",
      description: "This is subCategory 1",
      parentId: 1,
      userId: 1, // Replace with actual user ID
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    update: {}
  })
  await prisma.product.upsert({
    where: {
      id: 1
    },
    create: {
      name: "Product 1",
      isMeasurementRequired: true,
      isFitmentRequired: true,
      description: "This is product 1",
      categoryId: 2,
      workflowId: 1,
      userId: 1,
      gst:8,
      discount: 20,
      quantity:{
        type:"text",
        min:234,
        max:323
      },
      price: "3452",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    update: {}
  })
  await prisma.product.upsert({
    where: {
      id: 2
    },
    create: {
      name: "Product 2",
      isMeasurementRequired: true,
      isFitmentRequired: true,
      description: "This is product 2",
      categoryId: 2,
      workflowId: 1,
      userId: 1,
      gst:5,
      discount: 10,
      quantity:{
        type:"dropDown",
       options:[23,43,54]
      },
      price: "3452",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    update: {}
  })
  await prisma.productAttribute.upsert({
    where: {
      id: 1
    },
    create: {
      attributeId: 1,
      productId: 1,
      type: "dropDown",
      options: ["23", "43", "54"],
    },
    update: {}
  })
  await prisma.productAttribute.upsert({
    where: {
      id: 2
    },
    create: {
      attributeId: 2,
      productId: 1,
      type: "text",

    },
    update: {}
  })

  await prisma.orderStatus.upsert({
    where: {
      id: 1
    },
    create: {
      status: "Cancelled",
      description: " Order Cancelled",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: { status: "Cancelled", }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 2
    },
    create: {
      status: "Register Order",
      description: "Register Order",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Register Order",
    description: "Register Order",
   }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 3
    },
    create: {
      status: "Payment Update(Cannot Delete Entry)",
      description: "Payment Update(Cannot Delete Entry)",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Payment Update(Cannot Delete Entry)",
    description: "Payment Update(Cannot Delete Entry)",
   }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 4
    },
    create: {
      status: "Transfer to Designer",
      description: "Transfer to Designer",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: { status: "Transfer to Designer",
    description: "Transfer to Designer",
   }
  })
  
  await prisma.orderStatus.upsert({
    where: {
      id: 5
    },
    create: {
      status: "Material Received in Office",
      description: "Material Received in Office",
      dependOn: 4,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Material Received in Office",
    description: "Material Received in Office",
   }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 6
    },
    create: {
      status: "Material Received in Workshop",
      description: "Material Received in Workshop",
      dependOn: 4,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Material Received in Workshop",
    description: "Material Received in Workshop",
  }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 7
    },
    create: {
      status: "Ready to Dispatch",
      description: "Ready to Dispatch",
      dependOn: 4,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Ready to Dispatch",
    description: "Ready to Dispatch",
  }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 8
    },
    create: {
      status: "Mark an Order if advance amount not deposited.",
      description: "Mark an Order if advance amount not deposited.",
      dependOn: 4,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Mark an Order if advance amount not deposited.",
    description: "Mark an Order if advance amount not deposited.",
   }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 9
    },
    create: {
      status: "Check & Update Payment (Cannot Delete Entry)",
      description: "Check & Update Payment (Cannot Delete Entry)",
      dependOn: 4,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Check & Update Payment (Cannot Delete Entry)",
    description: "Check & Update Payment (Cannot Delete Entry)",
   }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 10
    },
    create: {
      status: "Manage Discounts",
      description: "Received for Packing",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {  status: "Manage Discounts",
    description: "Received for Packing",}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 11
    },
    create: {
      status: "Under Designing",
      description: "Under Designing",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Under Designing",
    description: "Under Designing",}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 12
    },
    create: {
      status: "Under Correction",
      description: "Correction",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Under Correction",
    description: "Correction",}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 13
    },
    create: {
      status: "Improper Matter",
      description: "Improper Matter",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },

    update: {status: "Improper Matter",
    description: "Improper Matter",
    }
  })

  await prisma.orderStatus.upsert({
    where: {
      id: 14
    },
    create: {
      status: "Transfer to Machine Operator",
      description: "Transfer to Machine Operator",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: { status: "Transfer to Machine Operator",
    description: "Transfer to Machine Operator",
  }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 15
    },
    create: {
      status: "Under Printing",
      description: "Under Printing",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: { status: "Under Printing",
    description: "Under Printing",
   }
  })

  await prisma.orderStatus.upsert({
    where: {
      id: 16
    },
    create: {
      status: "Completed",
      description: "Completed",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Completed",
    description: "Completed",
   }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 17
    },
    create: {
      status: "Under Cutting",
      description: "Under Cutting",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: { status: "Under Cutting",
    description: "Under Cutting",
   }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 18
    },
    create: {
      status: "Improper File",
      description: "Improper File",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Improper File",
    description: "Improper File",
  }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 19
    },
    create: {
      status: "Ready to Dispatch from Workshop",
      description: "Ready to Dispatch from Workshop",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Ready to Dispatch from Workshop",
    description: "Ready to Dispatch from Workshop",
   }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 20
    },
    create: {
      status: "Raw Material Not Available",
      description: "Raw Material Not Available",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: { status: "Raw Material Not Available",
    description: "Raw Material Not Available",
  }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 21
    },
    create: {
      status: "File Sent",
      description: "File Sent",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 22
    },
    create: {
      status: "Material Ready",
      description: "Material Ready",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Material Ready",
    description: "Material Ready",
   }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 23
    },
    create: {
      status: "Dispatched",
      description: "Dispatched",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Dispatched",
    description: "Dispatched",
   }
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 24
    },
    create: {
      status: "Material Received In Office",
      description: "Material Received In Office",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),


    },
    update: {status: "Material Received In Office",
    description: "Material Received In Office",}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 25
    },
    create: {
      status: "Any Other Requirement (Like Fabrication, Cutting or anything)",
      description: "Any Other Requirement (Like Fabrication, Cutting or anything)",
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    update: {  status: "Any Other Requirement (Like Fabrication, Cutting or anything)",
    description: "Any Other Requirement (Like Fabrication, Cutting or anything)",
   }
  })
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 2,
      }
    },
    update: {
      roleId: 1,
      orderStatusId: 2,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 2,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 3,
      }
    },
    update: {
      roleId: 1,
      orderStatusId: 3,
      updatedAt: new Date('2023-07-09'),
      
    },
    create: {
      roleId: 1,
      orderStatusId: 3,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 4,
      }
    },
    update: {
      roleId: 1,
      orderStatusId: 4,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 4,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 5,
      }
    },
    update: {
      roleId: 1,
      orderStatusId: 5,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 5,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 6,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 6,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 6,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 7,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 7,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 7,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 8,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 8,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 8,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 9,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 9,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 9,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 10,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 10,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 10,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 11,
      }
    },
    update: {
      roleId: 1,
      orderStatusId: 11,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 11,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 12,
      }
    },
    update: {
      roleId: 1,
      orderStatusId: 12,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 12,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 13,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 13,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 13,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 14,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 14,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 14,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 15,
      }
    },
    update: {
      roleId: 1,
      orderStatusId: 15,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 15,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 16,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 16,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 16,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 17,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 17,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 17,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 18,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 18,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 18,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 19,
      }
    },
    update: {
      roleId: 1,
      orderStatusId: 19,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 19,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 20,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 20,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 20,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 21,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 21,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 21,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 22,
      }
    },
    update: {
      roleId: 1,
      orderStatusId: 22,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 22,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 23,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 23,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 23,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 24,
      }
    },
    update: {
      roleId: 1,
        orderStatusId: 24,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 24,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 1,
        orderStatusId: 25,
      }
    },
    update: {
      roleId: 1,
      orderStatusId: 25,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 1,
      orderStatusId: 25,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 3,
        orderStatusId: 2,
      }
    },
    update: {
      roleId: 3,
      orderStatusId: 2,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 3,
      orderStatusId: 2,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 3,
        orderStatusId: 4,
      }
    },
    update: {
      roleId: 3,
      orderStatusId: 4,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 3,
      orderStatusId: 4,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 3,
        orderStatusId: 5,
      }
    },
    update: {
      roleId: 3,
      orderStatusId: 5,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 3,
      orderStatusId: 5,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 3,
        orderStatusId: 6,
      }
    },
    update: {
      roleId: 3,
      orderStatusId: 6,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 3,
      orderStatusId: 6,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });

  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 3,
        orderStatusId: 7,
      }
    },
    update: {
      roleId: 3,
      orderStatusId: 7,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 3,
      orderStatusId: 7,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 3,
        orderStatusId: 8,
      }
    },
    update: {
      roleId: 3,
      orderStatusId: 8,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 3,
      orderStatusId: 8,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 4,
        orderStatusId: 9,
      }
    },
    update: {
      roleId: 4,
      orderStatusId: 9,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 4,
      orderStatusId: 9,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 4,
        orderStatusId: 10
      }
    },
    update: {
      roleId: 4,
      orderStatusId: 10,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 4,
      orderStatusId: 10,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 5,
        orderStatusId: 11,
      }
    },
    update: {
      roleId: 5,
      orderStatusId: 11,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 5,
      orderStatusId: 11,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 5,
        orderStatusId: 12,
      }
    },
    update: {
      roleId: 5,
      orderStatusId: 12,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 5,
      orderStatusId: 12,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 5,
        orderStatusId: 13,
      }
    },
    update: {
      roleId: 5,
      orderStatusId: 13,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 5,
      orderStatusId: 13,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 5,
        orderStatusId: 14,
      }
    },
    update: {
      roleId: 5,
      orderStatusId: 14,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 5,
      orderStatusId: 14,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },

  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 5,
        orderStatusId: 15,
      }
    },
    update: {
      roleId: 5,
      orderStatusId: 15,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 5,
      orderStatusId: 15,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 5,
        orderStatusId: 16,
      }
    },
    update: {
      roleId: 5,
      orderStatusId: 16,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 5,
      orderStatusId: 16,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 6,
        orderStatusId: 15,
      }
    },
    update: {
      roleId: 6,
      orderStatusId: 15,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 6,
      orderStatusId: 15,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 6,
        orderStatusId: 17,
      }
    },
    update: {
      roleId: 6,
      orderStatusId: 17,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 6,
      orderStatusId: 17,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 6,
        orderStatusId: 18,
      }
    },
    update: {
      roleId: 6,
      orderStatusId: 18,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 6,
      orderStatusId: 18,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 6,
        orderStatusId: 16,
      }
    },
    update: {
      roleId: 6,
      orderStatusId: 16,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 6,
      orderStatusId: 16,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 6,
        orderStatusId: 19,
      }
    },
    update: {
      roleId: 6,
      orderStatusId: 19,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 6,
      orderStatusId: 19,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 6,
        orderStatusId: 20,
      }
    },
    update: {
      roleId: 6,
      orderStatusId: 20,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 6,
      orderStatusId: 20,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 7,
        orderStatusId: 15,
      }
    },
    update: {
      roleId: 7,
      orderStatusId: 15,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 7,
      orderStatusId: 15,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 7,
        orderStatusId: 17,
      }
    },
    update: {
      roleId: 7,
      orderStatusId: 17,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 7,
      orderStatusId: 17,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 7,
        orderStatusId: 18,
      }
    },
    update: {
      roleId: 7,
      orderStatusId: 18,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 7,
      orderStatusId: 18,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 7,
        orderStatusId: 16,
      }
    },
    update: {
      roleId: 7,
      orderStatusId: 16,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 7,
      orderStatusId: 16,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 7,
        orderStatusId: 19,
      }
    },
    update: {
      roleId: 7,
      orderStatusId: 19,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 7,
      orderStatusId: 19,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 7,
        orderStatusId: 20,
      }
    },
    update: {
      roleId: 7,
      orderStatusId: 20,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 7,
      orderStatusId: 20,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 8,
        orderStatusId: 21,
      }
    },
    update: {
      roleId: 8,
      orderStatusId: 21,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 8,
      orderStatusId: 21,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 8,
        orderStatusId: 22,
      }
    },
    update: {
      roleId: 8,
      orderStatusId: 22,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 8,
      orderStatusId: 22,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 8,
        orderStatusId: 23,
      }
    },
    update: {
      roleId: 8,
      orderStatusId: 23,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 8,
      orderStatusId: 23,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 8,
        orderStatusId: 24,
      }
    },
    update: {
      roleId: 8,
      orderStatusId: 24,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 8,
      orderStatusId: 24,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 8,
        orderStatusId: 25,
      }
    },
    update: {
      roleId: 8,
      orderStatusId: 25,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 8,
      orderStatusId: 25,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  });
  await prisma.roleAndOrderStatusMapping.upsert({
    where: {
      orderStatusId_roleId: {
        roleId: 8,
        orderStatusId: 7,
      }
    },
    update: {
      roleId: 8,
      orderStatusId: 7,
      updatedAt: new Date('2023-07-09'),
    },
    create: {
      roleId: 8,
      orderStatusId: 7,
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
    await prisma.$disconnect();
  });
