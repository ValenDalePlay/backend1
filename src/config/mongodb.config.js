const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecommerce';

const connectDB = async () => {
    try {
        const options = {
            serverSelectionTimeoutMS: 5000, // Tiempo de espera para la selección del servidor
            socketTimeoutMS: 45000, // Tiempo de espera para las operaciones
        };

        await mongoose.connect(MONGODB_URI, options);
        console.log('✅ Conectado a MongoDB exitosamente');
        
        // Manejar errores después de la conexión inicial
        mongoose.connection.on('error', err => {
            console.error('❌ Error de MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ Desconectado de MongoDB');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB; 