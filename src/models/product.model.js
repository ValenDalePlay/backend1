const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: [String],
        default: []
    },
    onSale: {
        type: Boolean,
        default: false
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        get: function() {
            if (this.onSale && this.discountPercentage > 0) {
                return Math.round(this.price * (1 - this.discountPercentage));
            }
            return this.price;
        }
    }
}, {
    timestamps: true,
    toJSON: { getters: true }
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 