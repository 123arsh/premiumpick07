import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body, param } from 'express-validator';
import {
  login,
  logout,
  getMe,
} from '../controllers/authController.js';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX, 10) || 5,
  message: { success: false, message: 'Too many login attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const productValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }),
  body('hoverTitle').trim().notEmpty().withMessage('Hover title is required').isLength({ max: 300 }),
  body('affiliateLink').trim().isURL().withMessage('Valid affiliate URL is required'),
  body('category').optional().trim().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 2000 }),
];

router.post(
  '/login',
  loginLimiter,
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

router.use(protect);

router.get('/products', getAdminProducts);

router.post(
  '/products',
  upload.single('image'),
  productValidators,
  validate,
  createProduct
);

router.put(
  '/products/:id',
  param('id').isMongoId().withMessage('Invalid product ID'),
  upload.single('image'),
  productValidators,
  validate,
  updateProduct
);

router.delete(
  '/products/:id',
  param('id').isMongoId().withMessage('Invalid product ID'),
  validate,
  deleteProduct
);

export default router;
