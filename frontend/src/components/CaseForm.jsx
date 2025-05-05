import React, { useState } from 'react';
import { createCase } from '../api';
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
  const navigate = useNavigate(); // redirect

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createCase(form);
      const patient_id = res.data.id;

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('patient_id', patient_id);
        formData.append('uploaded_by', form.created_by);
        await axios.post('http://localhost:5000/api/images', formData);
      }

      alert('✅ Case submitted!');
      setForm({ full_name: '', age: '', gender: '', contact: '', created_by: 1 });
      setImage(null);

      // Optional: redirect
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('❌ Error submitting case');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <input
        name="full_name"
        placeholder="Case Name"
        value={form.full_name}
        onChange={handleChange}
        required
      />
      <input
        name="age"
        type="number"
        placeholder="Age"
        value={form.age}
        onChange={handleChange}
        required
      />
      <select name="gender" value={form.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
      </select>

      <input
        name="contact"
        type="text"
        placeholder="Contact Number"
        value={form.contact}
        onChange={handleChange}
        required
      />

      <input type="file" accept="image/*" onChange={handleImageChange} required />

      {image && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Preview:</strong><br />
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            style={{ maxWidth: '200px', borderRadius: '6px' }}
          />
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}

export default CaseForm;
