# TechStore - Ecommerce Backend

Este proyecto es un backend para una tienda en línea de productos tecnológicos, desarrollado con Node.js, Express y MongoDB.

## 🚀 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB instalado y corriendo localmente
- npm (viene con Node.js)

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/ValenDatePlay/backend1.git
cd backend1
```

2. Instala las dependencias:
```bash
npm install
```

## 🛠️ Configuración

1. Asegúrate de que MongoDB esté corriendo localmente en el puerto 27017
2. La base de datos se creará automáticamente con el nombre 'ecommerce'

## 🌱 Poblar la Base de Datos

Para cargar los productos de ejemplo en la base de datos, ejecuta:
```bash
npm run seed
```

Este comando poblará la base de datos con:
- Smartphones
- Laptops
- Tablets
- Accesorios
- Productos de Networking
- Wearables

## 🚀 Ejecutar el Proyecto

### Modo Desarrollo
Para ejecutar el proyecto en modo desarrollo con recarga automática:
```bash
npm run dev
```

### Modo Producción
Para ejecutar el proyecto en modo producción:
```bash
npm start
```

## 🌐 Acceder a la Aplicación

Una vez que el servidor esté corriendo, puedes acceder a:

- Tienda: http://localhost:8080/products
- Carrito: http://localhost:8080/cart
- Ofertas: http://localhost:8080/ofertas
- Panel de Admin: http://localhost:8080/realtimeproducts

### Credenciales de Administrador
- Usuario: admin
- Contraseña: admin

## 📝 Endpoints API

### Productos
- GET /api/products - Obtener todos los productos
- GET /api/products/:pid - Obtener un producto específico
- POST /api/products - Crear un nuevo producto
- PUT /api/products/:pid - Actualizar un producto
- DELETE /api/products/:pid - Eliminar un producto

### Carrito
- POST /api/carts - Crear un nuevo carrito
- GET /api/carts/:cid - Obtener un carrito
- POST /api/carts/:cid/product/:pid - Agregar producto al carrito
- DELETE /api/carts/:cid/products/:pid - Eliminar producto del carrito
- PUT /api/carts/:cid/products/:pid - Actualizar cantidad de un producto
- DELETE /api/carts/:cid - Vaciar carrito

## 🛠️ Tecnologías Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO
- Handlebars
- Bootstrap 5

## 📁 Estructura del Proyecto

```
backend1/
├── src/
│   ├── app.js           # Punto de entrada de la aplicación
│   ├── config/          # Configuraciones
│   ├── controllers/     # Controladores
│   ├── dao/            # Data Access Objects
│   ├── models/         # Modelos de Mongoose
│   ├── public/         # Archivos estáticos
│   ├── routes/         # Rutas
│   ├── scripts/        # Scripts (ej: seed)
│   ├── services/       # Servicios
│   └── views/          # Plantillas Handlebars
└── package.json
```

## ⚠️ Notas Importantes

1. Asegúrate de que MongoDB esté corriendo antes de iniciar la aplicación
2. El script de seed eliminará todos los productos existentes antes de crear los nuevos
3. Los precios y el stock se manejan con dos decimales
4. Las imágenes de los productos son URLs externas

## 🤝 Contribuir

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request 