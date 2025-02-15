const ProductService = require('../services/product.service');

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async getProducts(req, res) {
        try {
            const { limit, page, sort, category, status } = req.query;
            const query = {};
            if (category) query.category = category;
            if (status !== undefined) query.status = status === 'true';

            const result = await this.productService.getProducts({
                limit,
                page,
                sort,
                query
            });

            res.json(result);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await this.productService.getProductById(req.params.pid);
            res.json({ status: 'success', payload: product });
        } catch (error) {
            res.status(404).json({ status: 'error', error: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json({ status: 'success', payload: product });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await this.productService.updateProduct(req.params.pid, req.body);
            res.json({ status: 'success', payload: product });
        } catch (error) {
            res.status(404).json({ status: 'error', error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            await this.productService.deleteProduct(req.params.pid);
            res.json({ status: 'success', message: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(404).json({ status: 'error', error: error.message });
        }
    }
}

module.exports = new ProductController(); 