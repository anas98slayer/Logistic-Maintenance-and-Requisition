"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all inventory items
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const items = await prisma_1.default.inventoryItem.findMany();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching inventory' });
    }
});
// Create item
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const { id, name, category, quantity, unit, minStock, location, supplier } = req.body;
        const uniqueId = id ? `${id}-${Math.random().toString(36).substr(2, 4)}` : `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const item = await prisma_1.default.inventoryItem.create({
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
    }
    catch (error) {
        console.error("BACKEND ERROR [POST /inventory]:", error);
        res.status(500).json({ message: 'Error creating inventory item' });
    }
});
// Update item (restock/adjust)
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const { quantity } = req.body;
        const item = await prisma_1.default.inventoryItem.update({
            where: { id },
            data: { quantity: parseInt(quantity), lastRestocked: new Date() }
        });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating inventory' });
    }
});
// Delete item
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.default.inventoryItem.delete({ where: { id } });
        res.json({ message: 'Inventory item deleted' });
    }
    catch (error) {
        console.error("BACKEND ERROR [DELETE /inventory]:", error);
        res.status(500).json({ message: 'Error deleting item' });
    }
});
exports.default = router;
