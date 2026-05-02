"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/stats', auth_1.authenticateToken, async (req, res) => {
    try {
        const equipmentCount = await prisma_1.default.equipment.count();
        const maintenanceCount = await prisma_1.default.maintenanceRequest.count();
        const activeMaintenanceCount = await prisma_1.default.maintenanceRequest.count({
            where: { status: { in: ['Pending', 'In Progress'] } }
        });
        const lowStockItemsCount = await prisma_1.default.inventoryItem.count({
            where: {
                quantity: {
                    lte: prisma_1.default.inventoryItem.fields.minStock // This is a bit tricky with Prisma SQLite, usually we handle this in code if field comparison is limited
                }
            }
        });
        // For SQLite, let's just fetch all and filter in code for low stock if complex queries fail
        const inventory = await prisma_1.default.inventoryItem.findMany();
        const lowStockCount = inventory.filter(item => item.quantity <= item.minStock).length;
        const requisitionsCount = await prisma_1.default.requisition.count();
        const operationalCount = await prisma_1.default.equipment.count({
            where: { status: 'Operational' }
        });
        const inMaintenanceCount = await prisma_1.default.equipment.count({
            where: { status: 'Under Maintenance' }
        });
        const outOfServiceCount = await prisma_1.default.equipment.count({
            where: { status: 'Out of Service' }
        });
        res.json({
            equipment: equipmentCount,
            operational: operationalCount,
            inMaintenance: inMaintenanceCount,
            outOfService: outOfServiceCount,
            maintenance: maintenanceCount,
            activeMaintenance: activeMaintenanceCount,
            lowStock: lowStockCount,
            requisitions: requisitionsCount
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});
exports.default = router;
