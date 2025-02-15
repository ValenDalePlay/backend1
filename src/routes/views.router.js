const express = require('express');
const router = express.Router();
const ProductDAO = require('../dao/mongodb/product.dao');
const CartDAO = require('../dao/mongodb/cart.dao');

// Vista de productos con paginación
router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, category } = req.query;
        const query = {};
        if (category) query.category = category;

        const result = await ProductDAO.getProducts({ limit, page, sort, query });

        // Obtener categorías únicas para el filtro
        const allProducts = await ProductDAO.getProducts({ limit: 1000 });
        const categories = [...new Set(allProducts.payload.map(p => p.category))];

        res.render('products', {
            products: result.payload,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink,
            categories,
            selectedCategory: category,
            sort
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { error: 'Error al cargar los productos' });
    }
});

// Vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const result = await ProductDAO.getProducts({});
        res.render('realTimeProducts', { 
            products: result.payload
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { error: 'Error al cargar los productos' });
    }
});

// Vista de detalle de producto
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await ProductDAO.getProductById(req.params.pid);
        res.render('product-detail', { product });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(404).render('error', { error: 'Producto no encontrado' });
    }
});

// Vista de carrito
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await CartDAO.getCartById(req.params.cid);
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(404).render('error', { error: 'Carrito no encontrado' });
    }
});

// Redirigir la raíz a /products
router.get('/', (req, res) => {
    res.redirect('/products');
});

module.exports = router; 