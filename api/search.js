
const express = require('express');
const db = require('../db');

const router = express.Router();
router.use(express.urlencoded({
  extended: false
}));
router.use(express.json());

router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q;
    const model = req.query.model;
    const price = req.query.price;
    const type = req.query.type;
    const sortBy = req.query.sortBy;
    const collation = {
      locale: 'en_US',
      strength: 1
    };


    const matchStage = {};
    if (q) {
      matchStage.$text = {
        $search: q
      };
    }
    if (model) {
      matchStage.model = {
        $eq: model
      };
    }

    // Possible custom entries here https://docs.mongodb.com/manual/reference/operator/aggregation/
    if (price) {
      matchStage.price = {
        $lte: parseInt(price)
      };
    }
    if (type) {
      matchStage.type = {
        $eq: type
      };
    }

    let sortStage = null;
    switch (sortBy) {
      case 'name_A':
        sortStage = {
          name: 1
        };
        break;
      case 'name_Z':
        sortStage = {
          name: -1
        };
        break;
      case 'price':
        sortStage = {
          price: 1
        };
        break;
      case 'relevance':
      default:
        sortStage = q ? {
          relevance: -1
        } : {
          name: 1
        };
        break;
    }


    const pipeline = [{
        $match: matchStage
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          model: 1,
          price: 1,
          type: 1,
          image: 1,
          relevance: q ? {
            $meta: 'textScore'
          } : null,
        },
      },
      {
        $sort: sortStage
      }
    ];

    const conn = await db.connect();
    const cursor = conn
      .collection('cars')
      .aggregate(pipeline, {
        collation: collation
      });

    res.type('application/json');
    res.write('[\n');
    for await (const doc of cursor) {
      res.write(JSON.stringify(doc));
      res.write(',\n');
    }
    res.end('null]');
  } catch (err) {
    next(err);
  }
});

module.exports = router;