import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const equipmentCount = await prisma.equipment.count();
    const maintenanceCount = await prisma.maintenanceRequest.count();
    const activeMaintenanceCount = await prisma.maintenanceRequest.count({
      where: { status: { in: ['Pending', 'In Progress'] } }
    });
    const lowStockItemsCount = await prisma.inventoryItem.count({
      where: {
        quantity: {
          lte: prisma.inventoryItem.fields.minStock as any // This is a bit tricky with Prisma SQLite, usually we handle this in code if field comparison is limited
        }
      }
    });

    // For SQLite, let's just fetch all and filter in code for low stock if complex queries fail
    const inventory = await prisma.inventoryItem.findMany();
    const lowStockCount = inventory.filter(item => item.quantity <= item.minStock).length;

    const requisitionsCount = await prisma.requisition.count();

    const operationalCount = await prisma.equipment.count({
      where: { status: 'Operational' }
    });
    const inMaintenanceCount = await prisma.equipment.count({
      where: { status: 'Under Maintenance' }
    });
    const outOfServiceCount = await prisma.equipment.count({
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

export default router;
