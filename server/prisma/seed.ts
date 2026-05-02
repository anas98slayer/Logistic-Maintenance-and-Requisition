import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Clear existing data
  await prisma.maintenanceRequest.deleteMany({});
  await prisma.requisition.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fleetpro.com',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const tech1 = await prisma.user.create({
    data: {
      email: 'john.doe@fleetpro.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'TECHNICIAN',
    },
  });

  const tech2 = await prisma.user.create({
    data: {
      email: 'jane.smith@fleetpro.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'TECHNICIAN',
    },
  });

  console.log('Users created:', { admin: admin.id, tech1: tech1.id, tech2: tech2.id });

  // 3. Create Equipment
  const equipmentData = [
    { id: 'TRK-001', name: 'Heavy Duty Freightliner', type: 'Truck', location: 'Warehouse A', status: 'Operational' },
    { id: 'TRK-002', name: 'Volvo XL Carrier', type: 'Truck', location: 'Warehouse B', status: 'Under Maintenance' },
    { id: 'FRK-010', name: 'Toyota Electric Forklift', type: 'Forklift', location: 'Section D', status: 'Operational' },
    { id: 'VAN-005', name: 'Mercedes Sprinter', type: 'Van', location: 'Bay 3', status: 'Operational' },
    { id: 'TRK-003', name: 'Scania R500', type: 'Truck', location: 'Garage 1', status: 'Reserved' },
  ];

  for (const eq of equipmentData) {
    await prisma.equipment.create({ data: eq });
  }

  console.log('Equipment created.');

  // 4. Create Inventory Items
  const inventoryData = [
    { id: 'INV-OIL-5W30', name: 'Synthetic Oil 5W30', category: 'Lubricants', quantity: 150, unit: 'Liters', minStock: 50, location: 'Shelf A1', supplier: 'PetroChem Inc.' },
    { id: 'INV-FLT-001', name: 'Oil Filter XL', category: 'Filters', quantity: 45, unit: 'Units', minStock: 20, location: 'Shelf B2', supplier: 'AutoParts Solutions' },
    { id: 'INV-TR-090', name: 'Heavy Duty Tire 22.5"', category: 'Tires', quantity: 12, unit: 'Units', minStock: 8, location: 'Yard Section 2', supplier: 'Michelin Pro' },
    { id: 'INV-BK-202', name: 'Brake Pad Set (Front)', category: 'Braking', quantity: 18, unit: 'Sets', minStock: 10, location: 'Shelf C4', supplier: 'SafetyFirst Braking' },
    { id: 'INV-CLT-500', name: 'Coolant Universal', category: 'Fluids', quantity: 80, unit: 'Liters', minStock: 30, location: 'Fluid Station', supplier: 'PetroChem Inc.' },
  ];

  for (const item of inventoryData) {
    await prisma.inventoryItem.create({ data: item });
  }

  console.log('Inventory items created.');

  // 5. Create Maintenance Requests
  const maintenanceData = [
    {
      id: 'MR-1001',
      equipmentId: 'TRK-001',
      type: 'Preventive',
      priority: 'Low',
      status: 'Completed',
      assignedToId: tech1.id,
      createdById: admin.id,
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      description: 'Routine oil change and filter replacement.',
    },
    {
      id: 'MR-1002',
      equipmentId: 'TRK-002',
      type: 'Corrective',
      priority: 'High',
      status: 'In Progress',
      assignedToId: tech2.id,
      createdById: tech2.id,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      description: 'Engine over-heating issues detected. Inspecting radiator and coolant pump.',
    },
    {
      id: 'MR-1003',
      equipmentId: 'FRK-010',
      type: 'Inspection',
      priority: 'Medium',
      status: 'Pending',
      assignedToId: tech1.id,
      createdById: admin.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      description: 'Monthly safety inspection of hydraulic systems.',
    },
    {
      id: 'MR-1004',
      equipmentId: 'VAN-005',
      type: 'Emergency',
      priority: 'High',
      status: 'Pending',
      createdById: tech1.id,
      dueDate: new Date(),
      description: 'Flat tire and possible alignment issue on Highway 45.',
    },
  ];

  for (const mr of maintenanceData) {
    await prisma.maintenanceRequest.create({ data: mr });
  }

  console.log('Maintenance requests created.');

  // 6. Create Requisitions
  const requisitionData = [
    {
      id: 'REQ-5001',
      item: 'Brake Fluid 5L',
      category: 'Fluids',
      quantity: 2,
      unit: 'Units',
      status: 'Approved',
      requestedById: tech1.id,
      estimatedCost: '$45.00',
    },
    {
      id: 'REQ-5002',
      item: 'Hydraulic Cylinder Seal Kit',
      category: 'Spare Parts',
      quantity: 1,
      unit: 'Set',
      status: 'Pending',
      requestedById: tech2.id,
      estimatedCost: '$120.00',
    },
  ];

  for (const req of requisitionData) {
    await prisma.requisition.create({ data: req });
  }

  console.log('Requisitions created.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
