import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  // Clear existing data
  await prisma.maintenanceRequest.deleteMany();
  await prisma.requisition.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const techPassword = await bcrypt.hash('tech123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@fleetpro.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const technician = await prisma.user.create({
    data: {
      email: 'tech@fleetpro.com',
      name: 'John Tech',
      password: techPassword,
      role: 'TECHNICIAN',
    },
  });

  // Create Equipment
  const e1 = await prisma.equipment.create({
    data: {
      id: 'EQ-001',
      name: 'Hyster Forklift',
      type: 'Material Handling',
      location: 'Warehouse A',
      status: 'Operational',
    },
  });

  const e2 = await prisma.equipment.create({
    data: {
      id: 'EQ-002',
      name: 'Thermo King Reefer',
      type: 'Cooling Unit',
      location: 'Bay 4',
      status: 'Under Maintenance',
    },
  });

  // Create Inventory
  await prisma.inventoryItem.create({
    data: {
      id: 'INV-001',
      name: 'Hydraulic Oil',
      category: 'Fluids',
      quantity: 50,
      unit: 'Liters',
      minStock: 20,
      location: 'Section C',
      supplier: 'OilCorp',
    },
  });

  await prisma.inventoryItem.create({
    data: {
      id: 'INV-002',
      name: 'Brake Pads',
      category: 'Parts',
      quantity: 5,
      unit: 'Set',
      minStock: 10,
      location: 'Section A',
      supplier: 'PartZ',
    },
  });

  // Create Maintenance Request
  await prisma.maintenanceRequest.create({
    data: {
      id: 'MR-1001',
      equipmentId: e2.id,
      type: 'Corrective',
      priority: 'High',
      status: 'In Progress',
      assignedToId: technician.id,
      description: 'Coolant leak detected in main unit',
      dueDate: new Date(Date.now() + 86400000),
    },
  });

  // Create Requisition
  await prisma.requisition.create({
    data: {
      id: 'REQ-2001',
      item: 'Reefer Coolant',
      category: 'Fluids',
      quantity: 10,
      unit: 'Liters',
      estimatedCost: '$250.00',
      requestedById: technician.id,
      status: 'Pending',
    },
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
