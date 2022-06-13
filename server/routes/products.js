import { Product } from '../models/product.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

//create a product
router.post('/', (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: JSON.stringify(req.body.description),
    price: req.body.price,
    category: req.body.category.id,
    quantity: req.body.quantity,
    image: req.body.image,
  });
  product
    .save()
    .then((createdProduct) => res.status(201).send(createdProduct))
    .catch((err) => res.status(500).send(err));
});

//get product list
router.get('/', async (req, res) => {
  let filter;
  if (req.query.categories) filter = { category: req.query.categories };
  const productList = await Product.find(filter).populate('category');
  if (productList) res.status(200).send(productList);
  else res.status(500).send('Error');
});

//get  number  of products
router.get('/count', async (req, res) => {
  const productList = await Product.find({ quantity: { $lte: 15 } })
    .select('name quantity')
    .sort('quantity');
  if (productList) res.status(200).send(productList);
  else res.status(500).send('Error');
});

//get a product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (product) res.status(200).send(product);
  else res.status(500).send('Error');
});

//update count
router.put('/:id/count', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send({ message: 'Product id is invalid' });
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { quantity: req.body.quantity },
    { new: true }
  ).select('id name quantity');
  if (updatedProduct) res.status(200).send({ updatedProduct, message: 'Stock updated' });
  else res.status(404).send('Product id not found');
});

//update product
router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send({ message: 'Product id is invalid' });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send('Invalid product id');
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: JSON.stringify(req.body.description),
      price: req.body.price,
      category: req.body.category.id,
      quantity: req.body.quantity,
      image: req.body.image,
    },
    { new: true }
  );
  if (updatedProduct) res.status(200).send({ updatedProduct, message: 'Product updated' });
  else res.status(404).send('Product id not found');
});

// delete product
router.delete('/:id', (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) res.status(200).send('Product deleted');
      else return res.status(404).send('Product not found');
    })
    .catch((err) => res.send(err));
});

export default router;
