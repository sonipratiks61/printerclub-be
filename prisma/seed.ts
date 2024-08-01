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
  {name:'Add Attribute'},
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
  { name:  "Delete Workflow"},
  {name:"Update_Order_Item_Status"},
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
      update: {}, 
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


  await prisma.roleAndCapabilityMapping.createMany({
    data: [{
      roleId: 1, capabilityId: 1, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 2, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 3, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 4, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 5, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 6, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 7, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 8, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 9, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 10, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 11, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 12, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 13, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 14, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 15, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 16, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 17, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 18, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 19, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 20, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 21, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 22, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 23, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 24, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 25, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 26, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    }, {
      roleId: 1, capabilityId: 27, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    }, {
      roleId: 1, capabilityId: 28, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 29, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 30, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 31, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 32, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 33, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 34, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 1, capabilityId: 35, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
     {
      roleId: 1, capabilityId: 36, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
     {
      roleId: 1, capabilityId: 37, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
    {
      roleId: 2, capabilityId: 17, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },
  {
     roleId: 2, capabilityId: 14, createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),
    },]
  })

  const userData = {
    businessName: " Admin-Company",
    name: "Admin",
    email: "admin@gmail.com",
    mobileNumber: "123456789",
    password: "Admin@123",  
    isActive: true,
    gstNumber: "1234567890",
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
    gstNumber: "1234567890",
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
    create: {name: "User-WorkFlow",
    sequence:[1,2,3,4,5],
    createdAt: new Date('2023-07-09'),
    updatedAt: new Date('2023-07-09'),
  },
  });
  await prisma.workFlow.create({
    data: {
      name: "User-WorkFlow",
      sequence:[1,2,3,4,5],
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
      parentId:1,
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
      isMeasurementRequired:true,
      isFitmentRequired:true,
      description: "This is product 1",
      categoryId:2,
      workflowId:1,
      userId: 1,
      quantity:{
        type:"text",
        min:234,
        max:323
      },
      price:"3452",
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
      isMeasurementRequired:true,
      isFitmentRequired:true,
      description: "This is product 2",
      categoryId:2,
      workflowId:1,
      userId: 1,
      quantity:{
        type:"dropDown",
       options:[23,43,54]
      },
      price:"3452",
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
      name: "ProductAttribute 1",
      productId:1,
      type:"dropDown",
       options:["23","43","54"],
    },
    update: {}
  })
  await prisma.productAttribute.upsert({
    where: {
      id: 2
    },
    create: {
      name: "ProductAttribute 2",
      productId:1,
      type:"text",
      
    },
    update: {}
  })

  await prisma.orderStatus.upsert({
    where: {
      id: 1
    },
    create: {
      status: "Order Confirmed",
      description:"order confirmed",  
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

      
    },
    update: {}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 2
    },
    create: {
      status: "Filed Uploaded",
      description:"Filed Uploaded",  
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

      
    },
    update: {}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 3
    },
    create: {
      status: "Process Started",
      description:"order confirmed",  
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

      
    },
    update: {}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 4
    },
    create: {
      status: "Job Verification",
      description:"Job Verification",
      dependOn:3,   
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

      
    },
    update: {}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 5
    },
    create: {
      status: "CTP Department",
      description:"CTP Department", 
      dependOn:3, 
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

      
    },
    update: {}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 6
    },
    create: {
      status: "Print Department",
      description:"Print Department",
      dependOn:3,  
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

      
    },
    update: {}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 7
    },
    create: {
      status: "Cutting Department",
      description:"Cutting Department",  
      dependOn:3,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

      
    },
    update: {}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 8
    },
    create: {
      status: "Blinding Department",
      description:"Blinding Department",  
      dependOn:3,
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

      
    },
    update: {}
  })
  await prisma.orderStatus.upsert({
    where: {
      id: 9
    },
    create: {
      status: "Received for Packing",
      description:"Received for Packing",  
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

      
    },
    update: {}
  })
   await prisma.orderStatus.upsert({
    where: {
      id: 10
    },
    create: {
      status: "Dispatched",
      description:"dispatched",  
      createdAt: new Date('2023-07-09'),
      updatedAt: new Date('2023-07-09'),

      
    },
    update: {}
  }) 
 
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
