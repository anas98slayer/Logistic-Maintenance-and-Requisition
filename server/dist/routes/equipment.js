"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all equipment
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const equipment = await prisma_1.default.equipment.findMany();
        res.json(equipment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching equipment' });
    }
});
// Create equipment
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const { id, name, type, location, status } = req.body;
        const uniqueId = id ? `${id}-${Math.random().toString(36).substr(2, 4)}` : `EQ-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const equipment = await prisma_1.default.equipment.create({
            data: { id: uniqueId, name, type, location, status: status || 'Operational' }
        });
        res.status(201).json(equipment);
    }
    catch (error) {
        console.error("BACKEND ERROR [POST /equipment]:", error);
        res.status(500).json({ message: 'Error creating equipment' });
    }
});
// Update equipment
router.put('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const id = req.params.id;
        const { name, type, location, status } = req.body;
        const equipment = await prisma_1.default.equipment.update({
            where: { id },
            data: { name, type, location, status }
        });
        res.json(equipment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating equipment' });
    }
});
// Delete equipment
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.default.equipment.delete({ where: { id } });
        res.json({ message: 'Equipment deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting equipment' });
    }
});
exports.default = router;
