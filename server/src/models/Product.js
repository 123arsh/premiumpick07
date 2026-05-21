import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
    },
    hoverTitle: {
      type: String,
      required: [true, 'Hover title is required'],
      trim: true,
      maxlength: 300,
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image is required'],
    },
    affiliateLink: {
      type: String,
      required: [true, 'Affiliate link is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', hoverTitle: 'text', description: 'text' });
productSchema.index({ category: 1, createdAt: -1 });

export const Product = mongoose.model('Product', productSchema);
