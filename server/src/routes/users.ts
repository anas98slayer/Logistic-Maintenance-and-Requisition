import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Get all users (Admin only)
router.get('/', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            assignedTasks: true
          }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user role (Admin only)
router.put('/:id/role', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;
    
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: { id: true, email: true, name: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const id = req.params.id as string;
    
    // Prevent self-deletion
    if (parseInt(id) === (req as any).user.id) {
       return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;
