import { Category } from '../models/category.js';
import { Router } from 'express';
import mongoose from 'mongoose';
// import Product from '../../client/src/components/Product.js';
const router = Router();

//create a category
router.post('/', (req, res) => {
  const category = new Category({
    name: req.body.name,
  });
  category
    .save()
    .then((createdCategory) => {
      res.status(201).json(createdCategory);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

// get all categories
router.get('/', async (req, res) => {
  const categoryList = await Category.find();
  if (categoryList) {
    res.json(categoryList);
  } else {
    res.status(500).json({ success: false });
  }
});

//get a category
router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.status(200).json(category);
  } else {
    res.status(500).json({ success: false });
  }
});

// find product by category
router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id).populate('product');
  if (category) {
    res.status(200).send(category);
  } else {
    res.status(500).send({ message: 'Category not found' });
  }
});

//update category
router.put('/:id', async (req, res) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });
    if (category) {
      res.status(200).json({ success: true, message: 'Category updated' });
    } else {
      res.status(404).json({ success: false, message: 'Category id not found' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Category id is invalid' });
  }
});

// delete category
router.delete('/:id', (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then((category) => {
      if (category) {
        res.status(200).json({ success: true, message: 'Category deleted' });
      } else {
        res.status(404).json({ success: false, message: 'Category not found' });
      }
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

export default router;
