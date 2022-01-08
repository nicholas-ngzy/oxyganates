import { Address } from '../models/address.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

//create a address
router.post('/', (req, res) => {
  const address = new Address({
    street: req.body.street,
    city: req.body.city,
    zipcode: req.body.zipcode,
    state: req.body.state,
    country: req.body.country,
  });
  address
    .save()
    .then((createdAddress) => {
      res.status(201).send(createdAddress);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
});

// get all addresss
router.get('/', async (req, res) => {
  const addressList = await Address.find();
  if (addressList) {
    res.status(200).send({ addressList });
  } else {
    res.status(500).send({ message: 'No addresss' });
  }
});

//get a address
router.get('/:id', async (req, res) => {
  const address = await Address.findById(req.params.id);
  if (address) {
    res.status(200).send(address);
  } else {
    res.status(500).send({ success: false });
  }
});

export default router;
