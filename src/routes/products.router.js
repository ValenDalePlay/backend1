const express = require('express');
const router = express.Router();
const ProductDAO = require('../dao/mongodb/product.dao');

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, category, status } = req.query;
        const query = {};
        if (category) query.category = category;
        if (status !== undefined) query.status = status === 'true';

        const result = await ProductDAO.getProducts({
            limit,
            page,
            sort,
            query
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductDAO.getProductById(req.params.pid);
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const product = await ProductDAO.createProduct(req.body);
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    try {
        const product = await ProductDAO.updateProduct(req.params.pid, req.body);
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        await ProductDAO.deleteProduct(req.params.pid);
        res.json({ status: 'success', message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

module.exports = router; 