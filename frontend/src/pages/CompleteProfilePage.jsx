import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function CompleteProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    diet_preference: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.patch('/api/user/profile/', formData);
      setUser(res.data);
      navigate('/recipes');
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="first_name" onChange={handleChange} value={formData.first_name} className="w-full border rounded p-2" placeholder="First Name" required />
        <input name="last_name" onChange={handleChange} value={formData.last_name} className="w-full border rounded p-2" placeholder="Last Name" required />
        <input name="diet_preference" onChange={handleChange} value={formData.diet_preference} className="w-full border rounded p-2" placeholder="Diet Preference (e.g., Vegan)" required />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Save Profile</button>
      </form>
    </div>
  );
}

export default CompleteProfilePage;
