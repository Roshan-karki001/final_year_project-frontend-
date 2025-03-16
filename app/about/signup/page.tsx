"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChangeEvent, FormEvent } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    F_name: '',
    L_name: '',
    G_mail: '',
    Phonenumber: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');

  // Fix the handleChange function
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Fix the handleSubmit function
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
  
        const data = await response.json();
  
        if (response.ok) {
          localStorage.setItem('verificationToken', data.verificationToken);
          router.push('/about/verify');
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Registration failed. Please try again.');
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section - Form */}
        <div className="p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Sign Up</h1>
          <p className="text-gray-600 mb-6">Join us today and connect with amazing professionals.</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input type="text" name="F_name" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" name="L_name" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="G_mail" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" name="Phonenumber" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select name="role" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                <option value="">Select Role</option>
                <option value="client">Client</option>
                <option value="engineer">Engineer</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account? <Link href="/about/login" className="text-blue-500 hover:text-blue-600">Login</Link>
          </p>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:block relative">
          <img src="/signup-image.jpg" alt="Signup" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
            <h2 className="text-lg font-bold">Find the startup partner you’ve been searching for</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
