import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
      // Update these navigation paths
      if (res.data.user.role === 'client') {
          navigate('/client/dashboard');  // Changed from /client/dashboard
      } else if (res.data.user.role === 'engineer') {
          navigate('/engineer/dashboard');  // Changed from /engineer/dashboard
      }else if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');  // Changed from /engineer/dashboard
    }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Engineer Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-purple-50 relative overflow-hidden p-6">
        <div className="absolute inset-12 bg-gradient-to-b from-purple-100/50 to-purple-50/50 z-10 rounded-3xl"></div>
        <img 
          src="https://images-eu.ssl-images-amazon.com/images/S/pv-target-images/6370b491329e3efb5bc6d86f304997d4b190db133e373bb2cd4f4079d0f12e7b._RI_V_TTW_.jpg" 
          alt="Engineer" 
          className="absolute inset-12 w-[calc(100%-6rem)] h-[calc(100%-6rem)] object-cover rounded-3xl"
        />
        <div className="absolute bottom-20 left-20 z-20">
          <h2 className="text-3xl font-bold text-purple-800">Welcome Back to EngiBridge</h2>
          <p className="text-purple-600 mt-2">Connect with professional engineers for your construction needs</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-8 px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Please enter your details to sign in</p>
          </div>

          {error && <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-3 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="G_mail"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
  
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
  
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="client">Client</option>
                <option value="engineer">Engineer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
  
            <div className="flex items-center justify-end text-sm">
              <Link 
                to="/forgot-password" 
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Forgot Password?
              </Link>
            </div>
  
            <button
              type="submit"
              className={`w-full py-3 px-4 text-white font-medium rounded-lg transition duration-200 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
  
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
