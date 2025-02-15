const Product = require('../../models/product.model');

class ProductDAO {
    async getProducts({ limit = 10, page = 1, sort, query = {} }) {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort === 'desc' ? -1 : 1 } : undefined
            };

            // Construir el objeto de consulta basado en los filtros
            const queryObject = {};
            if (query.category) queryObject.category = query.category;
            if (query.status !== undefined) queryObject.status = query.status;

            const result = await Product.paginate(queryObject, options);

            // Construir los enlaces de navegación
            const baseUrl = '/api/products';
            const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}` : null;
            const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}` : null;

            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink,
                nextLink
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
}

module.exports = new ProductDAO(); 