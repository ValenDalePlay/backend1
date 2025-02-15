const express = require('express');
const router = express.Router();
const ProductDAO = require('../dao/mongodb/product.dao');
const CartDAO = require('../dao/mongodb/cart.dao');

// Vista de inicio
router.get('/', async (req, res) => {
    try {
        // Obtener productos destacados (por ejemplo, los más recientes)
        const result = await ProductDAO.getProducts({ limit: 8, sort: { createdAt: -1 } });
        
        res.render('home', {
            featuredProducts: result.payload
        });
    } catch (error) {
        console.error('Error al obtener productos destacados:', error);
        res.status(500).render('error', { error: 'Error al cargar la página de inicio' });
    }
});

// Vista de productos con paginación
router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 12, sort, category } = req.query;
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
        
        // Calcular estadísticas
        const products = result.payload;
        const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
        const lowStock = products.filter(product => product.stock < 10).length;

        res.render('realTimeProducts', { 
            products,
            totalValue,
            lowStock
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
router.get('/cart', async (req, res) => {
    try {
        const cartId = req.query.cartId;
        if (!cartId) {
            return res.render('cart', { cart: { products: [] } });
        }
        const cart = await CartDAO.getCartById(cartId);
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(404).render('error', { error: 'Carrito no encontrado' });
    }
});

// Vista de ofertas
router.get('/ofertas', async (req, res) => {
    try {
        // Obtener solo 4 productos de las categorías más vendidas
        const result = await ProductDAO.getProducts({ 
            limit: 4,
            query: {
                $or: [
                    { category: 'Smartphones' },
                    { category: 'Laptops' }
                ]
            }
        });

        // Marcar los productos como en oferta y calcular el precio de oferta
        const productsWithDiscount = await Promise.all(result.payload.map(async (product, index) => {
            const discountPercentage = (index === 0 || index === 2) ? 0.4 : 0.2;
            
            // Actualizar el producto en la base de datos con el nuevo descuento
            const updatedProduct = await ProductDAO.updateProduct(product._id, {
                onSale: true,
                discountPercentage: discountPercentage
            });

            return {
                ...updatedProduct._doc,
                originalPrice: updatedProduct.price,
                price: updatedProduct.finalPrice,
                discount: `${discountPercentage * 100}% OFF`
            };
        }));
        
        res.render('offers', {
            products: productsWithDiscount,
            page: 1,
            totalPages: 1,
            hasPrevPage: false,
            hasNextPage: false,
            isOffers: true
        });
    } catch (error) {
        console.error('Error al obtener ofertas:', error);
        res.status(500).render('error', { error: 'Error al cargar las ofertas' });
    }
});

module.exports = router; 