const express = require('express');
const router = express.Router();
const CartDAO = require('../dao/mongodb/cart.dao');

// POST /api/carts
router.post('/', async (req, res) => {
    try {
        const cart = await CartDAO.createCart();
        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartDAO.getCartById(req.params.cid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await CartDAO.addProductToCart(req.params.cid, req.params.pid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// DELETE /api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await CartDAO.removeProductFromCart(req.params.cid, req.params.pid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

// PUT /api/carts/:cid
router.put('/:cid', async (req, res) => {
    try {
        const cart = await CartDAO.updateCart(req.params.cid, req.body.products);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// PUT /api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ 
                status: 'error', 
                error: 'La cantidad debe ser un número positivo' 
            });
        }

        const cart = await CartDAO.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            quantity
        );
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// DELETE /api/carts/:cid
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await CartDAO.clearCart(req.params.cid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

module.exports = router; 