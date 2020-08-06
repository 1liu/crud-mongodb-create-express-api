const express = require('express');
const monk = require('monk');
const Joi = require('@hapi/joi');
const { set } = require('../app');

const db = monk(process.env.MONGO_URI);
const faq = db.get('faq');

const schema = Joi.object({
  question: Joi.string().trim().required(),
  answer: Joi.string().trim().required(),
  video_url: Joi.string().uri()
});

const router = express.Router();

// Read all
router.get('/', async (req, res, next) => {
  try {
    const items = await faq.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Read one
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await faq.findOne({
      _id: id,
    });

    if (!item) return next();
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// Create one
router.post('/', async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body);
    const inserted = await faq.insert(value);
    res.json(inserted);
  } catch (error) {
    next(error);
  }
});

// Update one
router.put('/:id', async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body);
    const { id } = req.params;
    const item = await faq.findOne({
      _id: id,
    });
    if (!item) next();

    const updated = await faq.update({
      _id: id,
    }, {
      $set: value,
    });
    res.json(value);
  } catch (error) {
    next(error);
  }
});

// Delete one
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await faq.findOne({
      _id: id,
    });
    if (!item) next();

    const deleted = await faq.remove({
      _id: id,
    });
    res.status(200).send({ message: 'deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
