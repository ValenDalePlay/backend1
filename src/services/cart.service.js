const Cart = require('../models/cart.model');
const ProductService = require('./product.service');

class CartService {
    constructor() {
        this.productService = new ProductService();
    }

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
            const cart = await Cart.findById(id).populate('products.product');
            if (!cart) throw new Error('Carrito no encontrado');
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            // Verificar stock
            const stockCheck = await this.productService.checkStock(productId, quantity);
            if (!stockCheck.hasStock) {
                throw new Error(`Solo hay ${stockCheck.availableStock} unidades disponibles`);
            }

            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (productIndex === -1) {
                cart.products.push({ product: productId, quantity });
            } else {
                // Verificar stock para la cantidad total
                const newQuantity = cart.products[productIndex].quantity + quantity;
                const totalStockCheck = await this.productService.checkStock(productId, newQuantity);
                if (!totalStockCheck.hasStock) {
                    throw new Error(`Solo hay ${totalStockCheck.availableStock} unidades disponibles`);
                }
                cart.products[productIndex].quantity = newQuantity;
            }

            // Actualizar stock
            await this.productService.updateStock(productId, quantity);
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

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }

            // Restaurar stock
            const quantity = cart.products[productIndex].quantity;
            await this.productService.restoreStock(productId, quantity);

            // Eliminar producto del carrito
            cart.products.splice(productIndex, 1);
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

            // Restaurar stock de productos anteriores
            for (const item of cart.products) {
                await this.productService.restoreStock(item.product, item.quantity);
            }

            // Verificar y actualizar stock de nuevos productos
            for (const item of products) {
                const stockCheck = await this.productService.checkStock(item.product, item.quantity);
                if (!stockCheck.hasStock) {
                    throw new Error(`Solo hay ${stockCheck.availableStock} unidades disponibles para el producto ${item.product}`);
                }
                await this.productService.updateStock(item.product, item.quantity);
            }

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

            const currentQuantity = cart.products[productIndex].quantity;

            // Verificar stock si estamos aumentando la cantidad
            if (quantity > currentQuantity) {
                const additionalQuantity = quantity - currentQuantity;
                const stockCheck = await this.productService.checkStock(productId, additionalQuantity);
                if (!stockCheck.hasStock) {
                    throw new Error(`Solo hay ${stockCheck.availableStock} unidades disponibles`);
                }
                await this.productService.updateStock(productId, additionalQuantity);
            } else if (quantity < currentQuantity) {
                // Restaurar stock si estamos disminuyendo la cantidad
                const reduceQuantity = currentQuantity - quantity;
                await this.productService.restoreStock(productId, reduceQuantity);
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

            // Restaurar stock de todos los productos
            for (const item of cart.products) {
                await this.productService.restoreStock(item.product, item.quantity);
            }

            cart.products = [];
            await cart.save();

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async getCartTotal(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            return cart.products.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartService; 