const db = require('../config/db');

// ✅ Get all images
exports.getAllImages = (callback) => {
  db.query('SELECT * FROM images', callback);
};

// ✅ Get image by ID
exports.getImageById = (id, callback) => {
  db.query('SELECT * FROM images WHERE id = ?', [id], callback);
};

// ✅ Create image from API data
exports.createImage = (data, callback) => {
  const { patient_id, uploaded_by, image_path } = data;
  db.query(
    'INSERT INTO images (patient_id, uploaded_by, image_path) VALUES (?, ?, ?)',
    [patient_id, uploaded_by, image_path],
    callback
  );
};

// ✅ Create image from uploaded file (used in upload route)
exports.saveImageWithUpload = (patient_id, uploaded_by, image_path, callback) => {
  db.query(
    'INSERT INTO images (patient_id, uploaded_by, image_path) VALUES (?, ?, ?)',
    [patient_id, uploaded_by, image_path],
    callback
  );
};

// ✅ Update image path
exports.updateImage = (id, data, callback) => {
  const { image_path } = data;
  db.query(
    'UPDATE images SET image_path = ? WHERE id = ?',
    [image_path, id],
    callback
  );
};

// ✅ Delete image
exports.deleteImage = (id, callback) => {
  db.query('DELETE FROM images WHERE id = ?', [id], callback);
};
