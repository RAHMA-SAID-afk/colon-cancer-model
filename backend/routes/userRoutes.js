const express = require('express');
const router = express.Router();
const controller = require('../controllers/predictionController');

router.get('/', controller.getPredictions);
router.get('/:id', controller.getPredictionById);
router.post('/', controller.createPrediction);
router.put('/:id', controller.updatePrediction);
router.delete('/:id', controller.deletePrediction);

module.exports = router;
