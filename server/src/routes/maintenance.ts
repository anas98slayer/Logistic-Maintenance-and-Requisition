import { Router } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Get all maintenance requests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      include: { 
        equipment: true, 
        assignedTo: { select: { name: true, email: true } },
        createdBy: { select: { name: true, email: true } }
      }
    });
    res.json(requests);
  } catch (error) {
    console.error("BACKEND ERROR [GET /maintenance]:", error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Get all technicians (ADMIN ONLY)
router.get('/technicians', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const techs = await prisma.user.findMany({
      where: { role: 'TECHNICIAN' },
      select: { id: true, name: true, email: true }
    });
    res.json(techs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching technicians' });
  }
});

// Create request (TECHNICIAN ONLY)
router.post('/', authenticateToken, authorizeRole(['TECHNICIAN']), async (req: AuthRequest, res) => {
  try {
    const { id, equipmentId, type, priority, description, dueDate } = req.body;
    const uniqueId = id ? `${id}-${Math.random().toString(36).substr(2, 4)}` : `MR-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const request = await prisma.maintenanceRequest.create({
      data: {
        id: uniqueId,
        equipmentId,
        type,
        priority,
        description,
        dueDate: new Date(dueDate),
        createdById: req.user?.id,
        status: 'Pending'
      }
    });
    res.status(201).json(request);
  } catch (error) {
    console.error("BACKEND ERROR [POST /maintenance]:", error);
    res.status(500).json({ message: 'Error creating request' });
  }
});

// Update status or assignment
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const id = req.params.id as string;
  const { status, assignedToId } = req.body;

  try {
    const existing = await prisma.maintenanceRequest.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Request not found' });
    
    let canUpdate = false;
    if (userRole === 'ADMIN') {
      canUpdate = true;
    } else if (userRole === 'TECHNICIAN') {
      if (existing.assignedToId === userId && ['In Progress', 'Completed', 'Cancelled'].includes(status)) {
        canUpdate = true;
      } else if (existing.createdById === userId && status === 'Cancelled') {
        canUpdate = true;
      }
    }

    if (!canUpdate) return res.status(403).json({ message: 'Permission denied for this update' });

    const data: any = {};
    if (status) data.status = status;
    if (userRole === 'ADMIN' && assignedToId !== undefined) data.assignedToId = assignedToId ? parseInt(assignedToId) : null;

    const request = await prisma.maintenanceRequest.update({
      where: { id },
      data
    });
    res.json(request);
  } catch (error) {
    console.error("BACKEND ERROR [PUT /maintenance]:", error);
    res.status(500).json({ message: 'Error updating request' });
  }
});

// Delete request (ADMIN ONLY)
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.maintenanceRequest.delete({ where: { id } });
    res.json({ message: 'Request deleted' });
  } catch (error) {
    console.error("BACKEND ERROR [DELETE /maintenance]:", error);
    res.status(500).json({ message: 'Error deleting request' });
  }
});

export default router;
