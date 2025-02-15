const connectDB = require('../config/mongodb.config');
const Product = require('../models/product.model');

const productos = [
    {
        title: "iPhone 14 Pro",
        description: "El último iPhone con la mejor cámara y rendimiento",
        code: "IPH14PRO",
        price: 999.99,
        status: true,
        stock: 50,
        category: "Smartphones",
        thumbnails: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-2-202209?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660753617559"]
    },
    {
        title: "MacBook Pro 16",
        description: "Potente laptop para profesionales",
        code: "MBP16",
        price: 2499.99,
        status: true,
        stock: 25,
        category: "Laptops",
        thumbnails: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673229"]
    },
    {
        title: "iPad Air",
        description: "La tablet perfecta para creativos",
        code: "IPADAIR",
        price: 599.99,
        status: true,
        stock: 75,
        category: "Tablets",
        thumbnails: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=940&hei=1112&fmt=png-alpha&.v=1645065732688"]
    },
    {
        title: "AirPods Pro",
        description: "Auriculares inalámbricos con cancelación de ruido",
        code: "AIRPRO",
        price: 249.99,
        status: true,
        stock: 100,
        category: "Accesorios",
        thumbnails: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361"]
    },
    {
        title: "Apple Watch Series 8",
        description: "El reloj inteligente más avanzado",
        code: "AWS8",
        price: 399.99,
        status: true,
        stock: 60,
        category: "Wearables",
        thumbnails: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-45-alum-midnight-cell-8s_VW_34FR_WF_CO+watch-face-45-midnight-8s_VW_34FR_WF_CO?wid=1400&hei=1400&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1683224241054"]
    }
];

const seedProducts = async () => {
    try {
        // Conectar a MongoDB
        await connectDB();

        // Eliminar productos existentes
        await Product.deleteMany({});
        console.log('Productos anteriores eliminados');

        // Insertar nuevos productos
        const result = await Product.insertMany(productos);
        console.log(`✅ ${result.length} productos agregados exitosamente`);

        // Cerrar la conexión
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
        process.exit(1);
    }
};

seedProducts(); 