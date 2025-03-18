import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ G_mail: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Store token and user data in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Redirect based on role
      if (res.data.user.role === 'client') {
        navigate('/client/pages/client_dashboard');
      } else if (res.data.user.role === 'engineer') {
        navigate('/engineer/pages/engineer_dashboard');
      }
    } catch (err) {
      console.error(err); 
      setError(err.response?.data?.details || err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="G_mail"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <select
            name="role"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="client">Client</option>
            <option value="engineer">Engineer</option>
          </select>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
