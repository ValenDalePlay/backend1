const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const connectDB = require('./config/mongodb.config');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

// Conectar a MongoDB
connectDB();

// Configuración de Handlebars con helpers
const hbs = exphbs.create({
    helpers: {
        eq: (v1, v2) => v1 === v2,
        gt: (v1, v2) => v1 > v2,
        multiply: (v1, v2) => v1 * v2,
        cartTotal: (products) => {
            return products.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
        }
    },
    // Permitir acceso a todas las propiedades
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

// Configuración de Handlebars
app.engine('handlebars', hbs.engine);
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

    const ProductDAO = require('./dao/mongodb/product.dao');

    // Enviar lista inicial de productos
    try {
        const products = await ProductDAO.getProducts({});
        socket.emit('updateProducts', products.payload);
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }

    // Escuchar eventos de productos
    socket.on('productCreated', async () => {
        try {
            const products = await ProductDAO.getProducts({});
            io.emit('updateProducts', products.payload);
        } catch (error) {
            console.error('Error al actualizar productos:', error);
        }
    });

    socket.on('productDeleted', async () => {
        try {
            const products = await ProductDAO.getProducts({});
            io.emit('updateProducts', products.payload);
        } catch (error) {
            console.error('Error al actualizar productos:', error);
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