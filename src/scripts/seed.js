const connectDB = require('../config/mongodb.config');
const Product = require('../models/product.model');

const productos = [
    // Smartphones
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
        title: "Samsung Galaxy S23 Ultra",
        description: "Potencia y versatilidad con S Pen incluido",
        code: "SAMS23U",
        price: 1199.99,
        status: true,
        stock: 40,
        category: "Smartphones",
        thumbnails: ["https://images.samsung.com/is/image/samsung/p6pim/ar/2302/gallery/ar-galaxy-s23-ultra-s918-sm-s918bzgcaro-534911080"]
    },
    {
        title: "Google Pixel 7 Pro",
        description: "La mejor experiencia de cámara en Android",
        code: "GPIX7P",
        price: 899.99,
        status: true,
        stock: 30,
        category: "Smartphones",
        thumbnails: ["https://lh3.googleusercontent.com/Z4cbZz1GYr8IC0F4tkgRLBmG_eVBmk5GqGxg6-Q9JhKF3ORwXyWuB-bF7pPqWzB7VqE_QrPWE1rp3ULI9EAJz-0PQGQyXOiY=w1600-rw"]
    },

    // Laptops
    {
        title: "MacBook Pro 16",
        description: "Potente laptop para profesionales con chip M2 Pro",
        code: "MBP16",
        price: 2499.99,
        status: true,
        stock: 25,
        category: "Laptops",
        thumbnails: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673229"]
    },
    {
        title: "Dell XPS 15",
        description: "Rendimiento premium en un diseño elegante",
        code: "DXPS15",
        price: 1999.99,
        status: true,
        stock: 20,
        category: "Laptops",
        thumbnails: ["https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9520/media-gallery/black/laptop-xps-15-9520-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full"]
    },
    {
        title: "Lenovo ThinkPad X1 Carbon",
        description: "La laptop empresarial definitiva",
        code: "TPADX1",
        price: 1799.99,
        status: true,
        stock: 15,
        category: "Laptops",
        thumbnails: ["https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-carbon-gen-10-14-hero.png?context=bWFzdGVyfHJvb3R8MjM1NTEwfGltYWdlL3BuZ3xoMjEvaGRkLzEzMjU0OTc2NTY3MzI2LnBuZ3wzZjU1YzNmYmU2ZTRhODk0ZDFhNjRiYWY5NzM1NGNhZjc5NzhjNDQ5ZTBmNmRhZjU3ZTI4YWU0ZjRlNGY5NTU2"]
    },

    // Tablets
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
        title: "Samsung Galaxy Tab S9+",
        description: "Potencia Android en formato tablet",
        code: "TABS9P",
        price: 899.99,
        status: true,
        stock: 35,
        category: "Tablets",
        thumbnails: ["https://images.samsung.com/is/image/samsung/p6pim/ar/sm-x810nzaaaro/gallery/ar-galaxy-tab-s9-plus-wifi-x810-sm-x810nzaaaro-537758066"]
    },

    // Accesorios
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
        title: "Logitech MX Master 3S",
        description: "Mouse premium para productividad",
        code: "MXM3S",
        price: 99.99,
        status: true,
        stock: 60,
        category: "Accesorios",
        thumbnails: ["https://resource.logitech.com/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png"]
    },
    {
        title: "Samsung 49\" Odyssey G9",
        description: "Monitor gaming curvo ultrawide",
        code: "ODYG9",
        price: 1299.99,
        status: true,
        stock: 15,
        category: "Accesorios",
        thumbnails: ["https://images.samsung.com/is/image/samsung/p6pim/ar/lc49g95tsslxzb/gallery/ar-odyssey-g9-lc49g95tsslxzb-536457365"]
    },

    // Networking
    {
        title: "ASUS ROG Rapture GT-AX11000",
        description: "Router gaming WiFi 6 de alto rendimiento",
        code: "GTAX11K",
        price: 449.99,
        status: true,
        stock: 25,
        category: "Networking",
        thumbnails: ["https://dlcdnwebimgs.asus.com/gain/E95F8673-4C46-4075-8882-4D56430BBAA1"]
    },
    {
        title: "Ubiquiti UniFi Dream Router",
        description: "Router empresarial todo en uno",
        code: "UDREAM",
        price: 199.99,
        status: true,
        stock: 40,
        category: "Networking",
        thumbnails: ["https://store.ui.com/cdn/shop/products/dream-router-1.jpg"]
    },
    {
        title: "TP-Link Deco X90",
        description: "Sistema WiFi 6 mesh para todo el hogar",
        code: "DECOX90",
        price: 349.99,
        status: true,
        stock: 30,
        category: "Networking",
        thumbnails: ["https://www.tp-link.com/us/home-networking/deco/deco-x90/img/1.png"]
    },

    // Wearables
    {
        title: "Apple Watch Series 8",
        description: "El reloj inteligente más avanzado",
        code: "AWS8",
        price: 399.99,
        status: true,
        stock: 60,
        category: "Wearables",
        thumbnails: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-45-alum-midnight-cell-8s_VW_34FR_WF_CO+watch-face-45-midnight-8s_VW_34FR_WF_CO?wid=1400&hei=1400&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1683224241054"]
    },
    {
        title: "Samsung Galaxy Watch 6 Pro",
        description: "Elegante reloj inteligente con Wear OS",
        code: "GW6PRO",
        price: 449.99,
        status: true,
        stock: 45,
        category: "Wearables",
        thumbnails: ["https://images.samsung.com/is/image/samsung/p6pim/ar/2307/gallery/ar-galaxy-watch6-classic-r945-sm-r945fzsaaro-537686387"]
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