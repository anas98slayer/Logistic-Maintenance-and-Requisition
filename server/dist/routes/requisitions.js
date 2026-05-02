"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all requisitions
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const requisitions = await prisma_1.default.requisition.findMany({
            include: { requestedBy: { select: { name: true, email: true } } }
        });
        res.json(requisitions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching requisitions' });
    }
});
// Create requisition
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id, item, category, quantity, unit, estimatedCost } = req.body;
        const uniqueId = id ? `${id}-${Math.random().toString(36).substr(2, 4)}` : `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const requisition = await prisma_1.default.requisition.create({
            data: {
                id: uniqueId,
                item,
                category,
                quantity: parseInt(quantity),
                unit,
                estimatedCost,
                requestedById: req.user.id,
                status: 'Pending'
            }
        });
        res.status(201).json(requisition);
    }
    catch (error) {
        console.error("BACKEND ERROR [POST /requisitions]:", error);
        res.status(500).json({ message: 'Error creating requisition' });
    }
});
// Update status
router.put('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const requisition = await prisma_1.default.requisition.update({
            where: { id },
            data: { status }
        });
        res.json(requisition);
    }
    catch (error) {
        console.error("BACKEND ERROR [PUT /requisitions]:", error);
        res.status(500).json({ message: 'Error updating requisition' });
    }
});
// Delete requisition
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.default.requisition.delete({ where: { id } });
        res.json({ message: 'Requisition deleted' });
    }
    catch (error) {
        console.error("BACKEND ERROR [DELETE /requisitions]:", error);
        res.status(500).json({ message: 'Error deleting requisition' });
    }
});
exports.default = router;
