import { Product } from '../models/Product.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { processAndStoreImage, deleteLocalImage } from '../utils/uploadImage.js';

const buildProductQuery = (query) => {
  const filter = { isActive: true };
  const { search, category } = query;

  if (category) {
    filter.category = new RegExp(category, 'i');
  }

  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { hoverTitle: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') },
    ];
  }

  return filter;
};

export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const skip = (page - 1) * limit;
  const filter = buildProductQuery(req.query);

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    },
  });
});

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Product.distinct('category', {
    isActive: true,
    category: { $ne: '' },
  });
  res.json({ success: true, data: { categories: categories.filter(Boolean) } });
});

export const getAdminProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 50);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { name: new RegExp(req.query.search, 'i') },
      { hoverTitle: new RegExp(req.query.search, 'i') },
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { products, total, page, limit },
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  let imageUrl = req.body.imageUrl;

  if (req.file) {
    imageUrl = await processAndStoreImage(req.file);
  }

  if (!imageUrl) {
    throw new AppError('Product image is required', 400);
  }

  const product = await Product.create({
    name: req.body.name,
    hoverTitle: req.body.hoverTitle,
    imageUrl,
    affiliateLink: req.body.affiliateLink,
    category: req.body.category || '',
    description: req.body.description || '',
  });

  res.status(201).json({ success: true, data: { product } });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const updates = {
    name: req.body.name ?? product.name,
    hoverTitle: req.body.hoverTitle ?? product.hoverTitle,
    affiliateLink: req.body.affiliateLink ?? product.affiliateLink,
    category: req.body.category ?? product.category,
    description: req.body.description ?? product.description,
    isActive: req.body.isActive !== undefined ? req.body.isActive : product.isActive,
  };

  if (req.file) {
    const newUrl = await processAndStoreImage(req.file);
    await deleteLocalImage(product.imageUrl);
    updates.imageUrl = newUrl;
  } else if (req.body.imageUrl) {
    updates.imageUrl = req.body.imageUrl;
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: { product: updated } });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  await deleteLocalImage(product.imageUrl);
  await product.deleteOne();

  res.json({ success: true, message: 'Product deleted' });
});
