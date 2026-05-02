"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all maintenance requests
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const requests = await prisma_1.default.maintenanceRequest.findMany({
            include: {
                equipment: true,
                assignedTo: { select: { name: true, email: true } },
                createdBy: { select: { name: true, email: true } }
            }
        });
        res.json(requests);
    }
    catch (error) {
        console.error("BACKEND ERROR [GET /maintenance]:", error);
        res.status(500).json({ message: 'Error fetching requests' });
    }
});
// Get all technicians (ADMIN ONLY)
router.get('/technicians', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const techs = await prisma_1.default.user.findMany({
            where: { role: 'TECHNICIAN' },
            select: { id: true, name: true, email: true }
        });
        res.json(techs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching technicians' });
    }
});
// Create request (TECHNICIAN ONLY)
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['TECHNICIAN']), async (req, res) => {
    try {
        const { id, equipmentId, type, priority, description, dueDate } = req.body;
        const uniqueId = id ? `${id}-${Math.random().toString(36).substr(2, 4)}` : `MR-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const request = await prisma_1.default.maintenanceRequest.create({
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
    }
    catch (error) {
        console.error("BACKEND ERROR [POST /maintenance]:", error);
        res.status(500).json({ message: 'Error creating request' });
    }
});
// Update status or assignment
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const id = req.params.id;
    const { status, assignedToId } = req.body;
    try {
        const existing = await prisma_1.default.maintenanceRequest.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ message: 'Request not found' });
        let canUpdate = false;
        if (userRole === 'ADMIN') {
            canUpdate = true;
        }
        else if (userRole === 'TECHNICIAN') {
            if (existing.assignedToId === userId && ['In Progress', 'Completed', 'Cancelled'].includes(status)) {
                canUpdate = true;
            }
            else if (existing.createdById === userId && status === 'Cancelled') {
                canUpdate = true;
            }
        }
        if (!canUpdate)
            return res.status(403).json({ message: 'Permission denied for this update' });
        const data = {};
        if (status)
            data.status = status;
        if (userRole === 'ADMIN' && assignedToId !== undefined)
            data.assignedToId = assignedToId ? parseInt(assignedToId) : null;
        const request = await prisma_1.default.maintenanceRequest.update({
            where: { id },
            data
        });
        res.json(request);
    }
    catch (error) {
        console.error("BACKEND ERROR [PUT /maintenance]:", error);
        res.status(500).json({ message: 'Error updating request' });
    }
});
// Delete request (ADMIN ONLY)
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.default.maintenanceRequest.delete({ where: { id } });
        res.json({ message: 'Request deleted' });
    }
    catch (error) {
        console.error("BACKEND ERROR [DELETE /maintenance]:", error);
        res.status(500).json({ message: 'Error deleting request' });
    }
});
exports.default = router;
