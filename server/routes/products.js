import { Product } from '../models/product.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();
import multer from 'multer';

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
const uploadOptions = multer({ storage: storage });

//create a product
// router.post('/', uploadOptions.single('image'), (req, res) => {
//   // const file = req.file;
//   // if (!file) return res.status(400).send('No image in request');
//   // const fileName = req.body.filename;
//   // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
//   const product = new Product({
//     name: req.body.name,
//     description: req.body.description,
//     price: req.body.price,
//     quantity: req.body.quantity,
//     category: req.body.category,
//     // image: `${basePath}${fileName}`,
//   });
//   product
//     .save()
//     .then((res) => {
//       res.status(201).send({ message: 'Product added' });
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });
// });

//create a product
router.post('/', (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category,
    image: req.body.image,
  });
  product
    .save()
    .then((createdProduct) => {
      return res.status(201).json(createdProduct);
    })
    .catch((err) => {
      return res.status(500).json({ error: err, success: false });
    });
});

// get all products
router.get('/', async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') };
  }
  const productList = await Product.find(filter).populate('category');
  if (productList) {
    return res.send({ productList });
  } else {
    return res.status(500).json({ success: false });
  }
});

//get a product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(500).json({ success: false });
  }
});

//update product
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send({ message: 'Product id is invalid' });
  }
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send('Invalid product id');

  const file = req.file;
  let imagepath;

  if (file) {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = product.image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: imagepath,
  });
  if (updatedProduct) {
    res.status(200).json({ success: true, message: 'Product updated' });
  } else {
    res.status(404).json({ success: false, message: 'Product id not found' });
  }
});

// delete product
router.delete('/:id', (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({ success: true, message: 'Product deleted' });
      } else {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
    })
    .catch((err) => {
      return res.json({ success: false, error: err });
    });
});

export default router;
