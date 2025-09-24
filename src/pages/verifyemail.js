import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmailPage = () => {
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const G_mail = location.state?.email;

  const handleVerify = async () => {
    if (!G_mail) return alert("Email not found. Please try registering again.");
    if (!inputCode) return alert("Please enter the verification code.");

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-email",
        { inputCode, G_mail },
        {
          headers: {
            Authorization: `Bearer some-temporary-token`, // Replace if needed
          },
        }
      );
      alert(res.data.message);
      navigate("login"); // redirect to dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Verify Your Email</h1>
        <p className="text-gray-600 mb-6">Enter the verification code sent to <strong>{G_mail}</strong></p>
        <input
          type="text"
          placeholder="Verification Code"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
