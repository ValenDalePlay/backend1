const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }]
}, {
    timestamps: true
});

// Middleware para popular productos automáticamente
cartSchema.pre('find', function() {
    this.populate('products.product');
});

cartSchema.pre('findOne', function() {
    this.populate('products.product');
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 