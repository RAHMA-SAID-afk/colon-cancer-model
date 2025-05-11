import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CaseForm() {
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    contact: '',
    created_by: 1
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    try {
      // Step 1: Send image to Flask ML service
      const imageFormData = new FormData();
      imageFormData.append('image', image);

      const predictionRes = await axios.post('http://localhost:5050/predict', imageFormData, {
        validateStatus: () => true
      });

      if (predictionRes.status !== 200 || predictionRes.data.error) {
        alert(`❌ ${predictionRes.data.error || "Image not valid"}`);
        return;
      }

      const predictedLabel = predictionRes.data.result;
      const confidence = predictionRes.data.confidence;

      // ✅ Reject low-confidence predictions (avoid fake classifications)
      if (confidence < 0.85) {
        alert("❌ This image is not applicable (prediction confidence too low).");
        return;
      }

      // Step 2: Create patient in DB
      const patientRes = await axios.post('http://localhost:5000/api/patients', form);
      const patient_id = patientRes.data.id;

      // Step 3: Upload image + prediction to backend
      const uploadFormData = new FormData();
      uploadFormData.append('image', image);
      uploadFormData.append('patient_id', patient_id);
      uploadFormData.append('uploaded_by', form.created_by);
      uploadFormData.append('result', predictedLabel);
      uploadFormData.append('confidence', confidence);

      await axios.post('http://localhost:5000/api/images', uploadFormData);

      alert(`✅ Case submitted as ${predictedLabel} (${(confidence * 100).toFixed(1)}% confidence)`);

      setForm({ full_name: '', age: '', gender: '', contact: '', created_by: 1 });
      setImage(null);
      navigate('/dashboard');

    } catch (err) {
      console.error('❌ Submission error:', err);
      alert('❌ Error submitting case. Check console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <input name="full_name" placeholder="Case Name" value={form.full_name} onChange={handleChange} required />
      <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
      <select name="gender" value={form.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
      </select>
      <input name="contact" type="text" placeholder="Contact Number" value={form.contact} onChange={handleChange} required />
      <input type="file" accept="image/*" onChange={handleImageChange} required />

      {image && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Preview:</strong><br />
          <img src={URL.createObjectURL(image)} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px' }} />
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}

export default CaseForm;
