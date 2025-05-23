const Image = require('../models/imageModel');
const Prediction = require('../models/predictionModel');
const path = require('path');

exports.getImages = (req, res) => {
  Image.getAllImages((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getImageById = (req, res) => {
  Image.getImageById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Image not found' });
    res.json(result[0]);
  });
};

exports.createImage = (req, res) => {
  Image.createImage(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};

exports.updateImage = (req, res) => {
  Image.updateImage(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Image updated successfully' });
  });
};

exports.deleteImage = (req, res) => {
  Image.deleteImage(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Image deleted successfully' });
  });
};

exports.uploadImage = (req, res) => {
  const { patient_id, uploaded_by, result, confidence } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!imagePath) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  if (!result || !confidence) {
    return res.status(400).json({ message: 'Missing prediction result or confidence' });
  }

  Image.saveImageWithUpload(patient_id, uploaded_by, imagePath, (err, resultInsert) => {
    if (err) return res.status(500).json({ error: err });

    const image_id = resultInsert.insertId;

    const prediction = {
      image_id,
      predicted_by: uploaded_by,
      result,
      confidence,
    };

    Prediction.createPrediction(prediction, (err) => {
      if (err) return res.status(500).json({ error: err });

      res.status(201).json({
        message: '✅ Image uploaded and prediction saved',
        prediction: { label: result, confidence },
      });
    });
  });
};
