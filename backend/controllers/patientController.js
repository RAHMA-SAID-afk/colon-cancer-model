const Patient = require('../models/patientModel');

exports.getPatients = (req, res) => {
  Patient.getAllPatients((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPatientById = (req, res) => {
  Patient.getPatientById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Patient not found' });
    res.json(result[0]);
  });
};

exports.createPatient = (req, res) => {
  Patient.createPatient(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};

exports.updatePatient = (req, res) => {
  Patient.updatePatient(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Patient updated successfully' });
  });
};

exports.deletePatient = (req, res) => {
  Patient.deletePatient(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Patient deleted successfully' });
  });
};
