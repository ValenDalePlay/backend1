const Cart = require('../../models/cart.model');

class CartDAO {
    async createCart() {
        try {
            const cart = new Cart({ products: [] });
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id);
            if (!cart) throw new Error('Carrito no encontrado');
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (productIndex === -1) {
                cart.products.push({ product: productId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.products = cart.products.filter(
                item => item.product.toString() !== productId
            );

            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.products = products;
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CartDAO(); 