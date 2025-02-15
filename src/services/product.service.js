const Product = require('../models/product.model');

class ProductService {
    async getProducts({ sort, query = {} }) {
        try {
            const sortOption = sort ? { price: sort === 'desc' ? -1 : 1 } : undefined;

            const products = await Product.find(query).sort(sortOption);

            return {
                status: 'success',
                payload: products
            };
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) throw new Error('Producto no encontrado');
            return product;
        } catch (error) {
            throw error;
        }
    }

    async createProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            const product = await Product.findByIdAndUpdate(
                id,
                productData,
                { new: true, runValidators: true }
            );
            if (!product) throw new Error('Producto no encontrado');
            return product;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (!product) throw new Error('Producto no encontrado');
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateStock(id, quantity) {
        try {
            const product = await Product.findById(id);
            if (!product) throw new Error('Producto no encontrado');
            
            if (product.stock < quantity) {
                throw new Error('No hay suficiente stock disponible');
            }

            product.stock -= quantity;
            await product.save();
            
            return product;
        } catch (error) {
            throw error;
        }
    }

    async restoreStock(id, quantity) {
        try {
            const product = await Product.findById(id);
            if (!product) throw new Error('Producto no encontrado');
            
            product.stock += quantity;
            await product.save();
            
            return product;
        } catch (error) {
            throw error;
        }
    }

    async checkStock(id, quantity) {
        try {
            const product = await Product.findById(id);
            if (!product) throw new Error('Producto no encontrado');
            
            return {
                hasStock: product.stock >= quantity,
                availableStock: product.stock
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductService; 