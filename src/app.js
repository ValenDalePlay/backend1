const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const ProductManager = require('./managers/ProductManager.js');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

const productManager = new ProductManager(path.join(__dirname, './data/products.json'));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// WebSocket
io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    // Enviar lista inicial de productos
    const products = await productManager.getProducts();
    socket.emit('updateProducts', products);

    // Escuchar nuevo producto
    socket.on('addProduct', async (product) => {
        try {
            await productManager.addProduct(product);
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    // Escuchar eliminación de producto
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 