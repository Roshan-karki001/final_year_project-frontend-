"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationToken = localStorage.getItem('verificationToken');

    if (!verificationToken) {
      setError('Verification token not found. Please sign up again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationToken,
          inputCode: verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('verificationToken');
        router.push('/about/login');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    }
  };

  const handleResendCode = async () => {
    const verificationToken = localStorage.getItem('verificationToken');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationToken })
      });

      const data = await response.json();

      if (response.ok) {
        setError('Verification code resent successfully!');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to resend verification code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => router.push('/about/login')}
        >
          ✕
        </button>

        <h1 className="text-3xl font-bold mb-6 text-center">Verify your email</h1>
        
        <p className="text-gray-600 text-center mb-8">
          To keep a trusted and safe community, we've sent an email to{' '}
          <span className="font-medium text-gray-900">{userEmail}</span>{' '}
          for verification, and you'll only do this once.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Verification code
            </label>
            <input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-3 border rounded-md text-lg"
              placeholder="Enter your code"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 text-lg font-medium"
          >
            Verify and continue
          </button>

          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Didn't receive email?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Resend email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}