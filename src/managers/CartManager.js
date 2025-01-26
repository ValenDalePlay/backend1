const fs = require('fs');
const path = require('path');

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.carts = [];
        this.initialize();
    }

    initialize() {
        try {
            if (!fs.existsSync(this.path)) {
                fs.writeFileSync(this.path, '[]', 'utf-8');
            } else {
                const fileContent = fs.readFileSync(this.path, 'utf-8');
                this.carts = JSON.parse(fileContent);
            }
        } catch (error) {
            console.error('Error al inicializar CartManager:', error);
            this.carts = [];
        }
    }

    async createCart() {
        try {
            const newCart = {
                id: this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) + 1 : 1,
                products: []
            };

            this.carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = this.carts.find(c => c.id === id);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cartIndex = this.carts.findIndex(c => c.id === cartId);
            if (cartIndex === -1) {
                throw new Error('Carrito no encontrado');
            }

            const cart = this.carts[cartIndex];
            const existingProductIndex = cart.products.findIndex(p => p.product === productId);

            if (existingProductIndex !== -1) {
                // Si el producto ya existe, incrementar quantity
                cart.products[existingProductIndex].quantity++;
            } else {
                // Si el producto no existe, agregarlo con quantity 1
                cart.products.push({
                    product: productId,
                    quantity: 1
                });
            }

            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return cart;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartManager; 