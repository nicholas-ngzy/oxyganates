import { Product } from '../models/product.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

//create a product
router.post('/', (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category,
  });
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

// get all products
router.get('/', async (req, res) => {
  const productList = await Product.find();
  if (productList) {
    return res.send({ productList });
  } else {
    res.status(500).json({ success: false });
  }
});

// get products from a category
router.get('/:categoryId', async (req, res) => {
  const productList = await Product.findById(req.params.categoryId);
  if (productList) {
    res.json(productList);
  } else {
    res.status(500).json({ success: false });
  }
});

//get a product
router.get('/:categoryId/product/:productId', async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (product) {
    res.status(200).json(user);
  } else {
    res.status(500).json({ success: false });
  }
});

//update product
router.put('/:id', async (req, res) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });
    if (product) {
      res.status(200).json({ success: true, message: 'Product updated' });
    } else {
      res.status(404).json({ success: false, message: 'Product id not found' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Product id is invalid' });
  }
});

// delete product
router.delete('/:id', (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        res.status(200).json({ success: true, message: 'Product deleted' });
      } else {
        res.status(404).json({ success: false, message: 'Product not found' });
      }
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

export default router;
