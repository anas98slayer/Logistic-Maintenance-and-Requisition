"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    // Clear existing data
    await prisma_1.default.maintenanceRequest.deleteMany();
    await prisma_1.default.requisition.deleteMany();
    await prisma_1.default.equipment.deleteMany();
    await prisma_1.default.inventoryItem.deleteMany();
    await prisma_1.default.user.deleteMany();
    // Create Users
    const adminPassword = await bcryptjs_1.default.hash('admin123', 10);
    const techPassword = await bcryptjs_1.default.hash('tech123', 10);
    const admin = await prisma_1.default.user.create({
        data: {
            email: 'admin@logistic.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    const technician = await prisma_1.default.user.create({
        data: {
            email: 'tech@logistic.com',
            name: 'John Tech',
            password: techPassword,
            role: 'TECHNICIAN',
        },
    });
    // Create Equipment
    const e1 = await prisma_1.default.equipment.create({
        data: {
            id: 'EQ-001',
            name: 'Hyster Forklift',
            type: 'Material Handling',
            location: 'Warehouse A',
            status: 'Operational',
        },
    });
    const e2 = await prisma_1.default.equipment.create({
        data: {
            id: 'EQ-002',
            name: 'Thermo King Reefer',
            type: 'Cooling Unit',
            location: 'Bay 4',
            status: 'Under Maintenance',
        },
    });
    // Create Inventory
    await prisma_1.default.inventoryItem.create({
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
    await prisma_1.default.inventoryItem.create({
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
    await prisma_1.default.maintenanceRequest.create({
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
    await prisma_1.default.requisition.create({
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
    await prisma_1.default.$disconnect();
});
