import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ F_name: '', L_name: '', G_mail: '', Phonenumber: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');  // Redirect after successful registration
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="F_name" placeholder="First Name" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="text" name="L_name" placeholder="Last Name" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="email" name="G_mail" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="text" name="Phonenumber" placeholder="Phone Number" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
          <select name="role" onChange={handleChange} className="w-full p-2 border rounded">
            <option value="client">Client</option>
            <option value="engineer">Engineer</option>
          </select>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
