"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all users (Admin only)
router.get('/', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});
// Update user role (Admin only)
router.put('/:id/role', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const id = req.params.id;
        const { role } = req.body;
        const user = await prisma_1.default.user.update({
            where: { id: parseInt(id) },
            data: { role },
            select: { id: true, email: true, name: true, role: true }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
});
// Delete user (Admin only)
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const id = req.params.id;
        // Prevent self-deletion
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }
        await prisma_1.default.user.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});
exports.default = router;
