import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all requisitions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const requisitions = await prisma.requisition.findMany({
      include: { requestedBy: { select: { name: true, email: true } } }
    });
    res.json(requisitions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requisitions' });
  }
});

// Create requisition
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id, item, category, quantity, unit, estimatedCost } = req.body;
    const uniqueId = id ? `${id}-${Math.random().toString(36).substr(2, 4)}` : `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const requisition = await prisma.requisition.create({
      data: {
        id: uniqueId,
        item,
        category,
        quantity: parseInt(quantity),
        unit,
        estimatedCost,
        requestedById: req.user!.id,
        status: 'Pending'
      }
    });
    res.status(201).json(requisition);
  } catch (error) {
    console.error("BACKEND ERROR [POST /requisitions]:", error);
    res.status(500).json({ message: 'Error creating requisition' });
  }
});

// Update status
router.put('/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const requisition = await prisma.requisition.update({
      where: { id },
      data: { status }
    });
    res.json(requisition);
  } catch (error) {
    console.error("BACKEND ERROR [PUT /requisitions]:", error);
    res.status(500).json({ message: 'Error updating requisition' });
  }
});

// Delete requisition
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.requisition.delete({ where: { id } });
    res.json({ message: 'Requisition deleted' });
  } catch (error) {
    console.error("BACKEND ERROR [DELETE /requisitions]:", error);
    res.status(500).json({ message: 'Error deleting requisition' });
  }
});

export default router;
