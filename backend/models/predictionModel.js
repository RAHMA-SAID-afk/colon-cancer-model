const db = require('../config/db');

exports.getAllPredictions = (callback) => {
  db.query('SELECT * FROM predictions', callback);
};

exports.getPredictionById = (id, callback) => {
  db.query('SELECT * FROM predictions WHERE id = ?', [id], callback);
};

exports.createPrediction = (data, callback) => {
  const { image_id, predicted_by, result, confidence } = data;
  db.query(
    'INSERT INTO predictions (image_id, predicted_by, result, confidence) VALUES (?, ?, ?, ?)',
    [image_id, predicted_by, result, confidence],
    callback
  );
};

exports.updatePrediction = (id, data, callback) => {
  const { result, confidence } = data;
  db.query(
    'UPDATE predictions SET result = ?, confidence = ? WHERE id = ?',
    [result, confidence, id],
    callback
  );
};

exports.deletePrediction = (id, callback) => {
  db.query('DELETE FROM predictions WHERE id = ?', [id], callback);
};
