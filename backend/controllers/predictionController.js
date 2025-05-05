const Prediction = require('../models/predictionModel');

exports.getPredictions = (req, res) => {
  Prediction.getAllPredictions((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPredictionById = (req, res) => {
  Prediction.getPredictionById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Prediction not found' });
    res.json(result[0]);
  });
};

exports.createPrediction = (req, res) => {
  Prediction.createPrediction(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};

exports.updatePrediction = (req, res) => {
  Prediction.updatePrediction(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Prediction updated successfully' });
  });
};

exports.deletePrediction = (req, res) => {
  Prediction.deletePrediction(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Prediction deleted successfully' });
  });
};
