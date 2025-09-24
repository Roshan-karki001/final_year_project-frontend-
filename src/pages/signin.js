import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  // First update the initial state to remove engineer-specific fields
  const [formData, setFormData] = useState({ 
    role: "", 
    F_name: "", 
    L_name: "", 
    G_mail: "", 
    Phonenumber: "",
    location: "", 
    password: "" 
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    submitData.append("profileImage", profileImage);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", submitData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Navigate to verification page with email
      navigate("/verify-email", { 
          state: { 
              email: formData.G_mail 
          }
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Engineer Image */}
      <div className="hidden lg:flex lg:w-2/3 bg-purple-50 relative overflow-hidden p-12">
        <div className="absolute inset-12 bg-gradient-to-b from-purple-100/50 to-purple-50/50 z-10 rounded-3xl"></div>
        <img 
          src="https://images-eu.ssl-images-amazon.com/images/S/pv-target-images/6370b491329e3efb5bc6d86f304997d4b190db133e373bb2cd4f4079d0f12e7b._RI_V_TTW_.jpg" 
          alt="Engineer" 
          className="absolute inset-12 w-[calc(100%-6rem)] h-[calc(100%-6rem)] object-cover rounded-3xl"
        />
        <div className="absolute bottom-20 left-20 z-20">
          <h2 className="text-3xl font-bold text-purple-800">Welcome to EngiBridge</h2>
          <p className="text-purple-600 mt-2">Connect with professional engineers for your construction needs</p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-purple-700 mb-8 lg:hidden">EngiBridge</h1>
          {step === 1 && <RoleSelection setRole={(role) => setFormData({ ...formData, role })} nextStep={() => setStep(2)} />}
          {step === 2 && <UserDetails formData={formData} handleChange={handleChange} nextStep={() => setStep(3)} handleBack={handleBack} />}
          {step === 3 && <ProfileUpload handleImageChange={handleImageChange} handleSubmit={handleSubmit} preview={preview} handleBack={handleBack} />}
        </div>
      </div>
    </div>
  );
};

// Update the components to remove duplicate layout elements
const RoleSelection = ({ setRole, nextStep }) => (
  <div>
    <h2 className="text-xl font-semibold mb-6">Complete profile</h2>
    <p className="text-gray-600 mb-6">Complete your profile to create a positive impression and build trust with your guests.</p>
    <div className="space-y-4">
      <button 
        className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        onClick={() => { setRole("client"); nextStep(); }}
      >
        Client
      </button>
      <button 
        className="w-full py-3 px-4 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
        onClick={() => { setRole("engineer"); nextStep(); }}
      >
        Engineer
      </button>
    </div>
  </div>
);

// In the UserDetails component, remove the engineer-specific section and keep only the common fields
const UserDetails = ({ formData, handleChange, nextStep, handleBack }) => (
  <div>
    <div className="flex items-center mb-6">
      <button onClick={handleBack} className="flex items-center px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h2 className="text-xl font-semibold ml-4">Complete profile</h2>
    </div>
    <div className="space-y-4">
      {/* Common fields for both roles */}
      <input
        type="text"
        name="F_name"
        placeholder="First Name"
        value={formData.F_name}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <input
        type="text"
        name="L_name"
        placeholder="Last Name"
        value={formData.L_name}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <input
        type="email"
        name="G_mail"
        placeholder="Email"
        value={formData.G_mail}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <input
        type="text"
        name="Phonenumber"
        placeholder="Phone Number"
        value={formData.Phonenumber}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location (e.g., City, State)"
        value={formData.location}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      
      <button
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={nextStep}
      >
        Continue
      </button>
    </div>
  </div>
);

const ProfileUpload = ({ handleImageChange, handleSubmit, preview, handleBack }) => (
  <div>
    <div className="flex items-center mb-6">
      <button 
        onClick={handleBack}
        className="flex items-center px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h2 className="text-xl font-semibold ml-4">Upload profile photo</h2>
    </div>
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          required
        />
        <span className="text-blue-600 hover:text-blue-700">Upload photo</span>
      </label>
      <button
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={handleSubmit}
      >
        Complete Registration
      </button>
    </div>
  </div>
);

export default RegisterPage;