const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.initialize();
    }

    initialize() {
        try {
            if (!fs.existsSync(this.path)) {
                fs.writeFileSync(this.path, '[]', 'utf-8');
            } else {
                const fileContent = fs.readFileSync(this.path, 'utf-8');
                this.products = JSON.parse(fileContent);
            }
        } catch (error) {
            console.error('Error al inicializar ProductManager:', error);
            this.products = [];
        }
    }

    async addProduct({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
        try {
            if (!title || !description || !code || !price || !stock || !category) {
                throw new Error('Todos los campos son obligatorios');
            }

            if (this.products.some(product => product.code === code)) {
                throw new Error('El código del producto ya existe');
            }

            const newProduct = {
                id: this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1,
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            };

            this.products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    async getProducts() {
        try {
            const fileContent = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = this.products.find(p => p.id === id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updateData) {
        try {
            const productIndex = this.products.findIndex(p => p.id === id);
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }

            // Evitar actualización del ID
            const { id: _, ...updateFields } = updateData;

            // Actualizar el producto
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updateFields
            };

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            return this.products[productIndex];
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const productIndex = this.products.findIndex(p => p.id === id);
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }

            this.products.splice(productIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductManager; 