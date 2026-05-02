import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Get all equipment
router.get('/', authenticateToken, async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipment' });
  }
});

// Create equipment
router.post('/', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id, name, type, location, status } = req.body;
    const uniqueId = id ? `${id}-${Math.random().toString(36).substr(2, 4)}` : `EQ-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const equipment = await prisma.equipment.create({
      data: { id: uniqueId, name, type, location, status: status || 'Operational' }
    });
    res.status(201).json(equipment);
  } catch (error) {
    console.error("BACKEND ERROR [POST /equipment]:", error);
    res.status(500).json({ message: 'Error creating equipment' });
  }
});

// Update equipment
router.put('/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const id = req.params.id as string;
    const { name, type, location, status } = req.body;
    const equipment = await prisma.equipment.update({
      where: { id },
      data: { name, type, location, status }
    });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating equipment' });
  }
});

// Delete equipment
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.equipment.delete({ where: { id } });
    res.json({ message: 'Equipment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting equipment' });
  }
});

export default router;
