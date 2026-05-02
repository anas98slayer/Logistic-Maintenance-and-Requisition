import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Get all inventory items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory' });
  }
});

// Create item
router.post('/', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id, name, category, quantity, unit, minStock, location, supplier } = req.body;
    const uniqueId = id ? `${id}-${Math.random().toString(36).substr(2, 4)}` : `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const item = await prisma.inventoryItem.create({
      data: {
        id: uniqueId,
        name,
        category,
        quantity: parseInt(quantity),
        unit,
        minStock: parseInt(minStock),
        location,
        supplier
      }
    });
    res.status(201).json(item);
  } catch (error) {
    console.error("BACKEND ERROR [POST /inventory]:", error);
    res.status(500).json({ message: 'Error creating inventory item' });
  }
});

// Update item (restock/adjust)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { quantity } = req.body;
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { quantity: parseInt(quantity), lastRestocked: new Date() }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory' });
  }
});

// Delete item
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.inventoryItem.delete({ where: { id } });
    res.json({ message: 'Inventory item deleted' });
  } catch (error) {
    console.error("BACKEND ERROR [DELETE /inventory]:", error);
    res.status(500).json({ message: 'Error deleting item' });
  }
});

export default router;
