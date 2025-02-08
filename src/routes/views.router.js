const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const path = require('path');

const productManager = new ProductManager(path.join(__dirname, '../data/products.json'));

// Ruta para la vista de productos
router.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('products', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { error: 'Error al cargar los productos' });
    }
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { error: 'Error al cargar los productos' });
    }
});

module.exports = router; 