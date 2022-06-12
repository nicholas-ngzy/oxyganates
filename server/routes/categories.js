import { Category } from '../models/category.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

//create category
router.post('/', (req, res) => {
  const category = new Category({ name: req.body.name });
  category
    .save()
    .then((createdCategory) => res.status(201).send(createdCategory))
    .catch((err) => res.status(500).send(err));
});

// get all categories
router.get('/', async (req, res) => {
  const categoryList = await Category.find().sort('name');
  if (categoryList) res.status(200).send(categoryList);
  else res.status(500).send('Error');
});

//get a category
router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) res.status(200).send(category);
  else res.status(500).send('Error');
});

//update category
router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send({ message: 'Category id is invalid' });
  const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  if (category) res.status(200).send(category);
  else res.status(404).send('Category id not found');
});

// delete category
router.delete('/:id', (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then((category) => {
      if (category) res.status(200).send(category);
      else res.status(404).send('Category not found');
    })
    .catch((err) => res.send(err));
});

export default router;
