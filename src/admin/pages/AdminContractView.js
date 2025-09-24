import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminContractView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchContractDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/contracts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setContract(response.data.contract);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching contract details');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchContractDetails();
  }, [token, navigate, fetchContractDetails]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error}
        <button
          onClick={() => navigate(-1)}
          className="block mx-auto mt-4 text-purple-600 hover:text-purple-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-8">
        Contract not found
        <button
          onClick={() => navigate(-1)}
          className="block mx-auto mt-4 text-purple-600 hover:text-purple-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">EngiBridge</h1>
        <h2 className="text-2xl font-semibold">Contract Agreement</h2>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="border-r pr-8">
            <h3 className="text-xl font-semibold mb-4">Client Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {contract.userId.F_name} {contract.userId.L_name}</p>
              <p><span className="font-medium">Email:</span> {contract.userId.G_mail}</p>
              <p><span className="font-medium">Phone:</span> {contract.userId.Phonenumber}</p>
            </div>
          </div>
          <div className="pl-8">
            <h3 className="text-xl font-semibold mb-4">Engineer Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {contract.engineerId?.F_name || 'Not Assigned'} {contract.engineerId?.L_name || ''}</p>
              <p><span className="font-medium">Email:</span> {contract.engineerId?.G_mail || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {contract.engineerId?.Phonenumber || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Project Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p><span className="font-medium">Project Title:</span> {contract.title}</p>
              <p><span className="font-medium">Building Type:</span> {contract.buildingType}</p>
              <p><span className="font-medium">Land Area:</span> {contract.landArea} sq ft</p>
            </div>
            <div>
              <p><span className="font-medium">Timeline:</span> {contract.timeline}</p>
              <p><span className="font-medium">Budget:</span> ${contract.budget.toLocaleString()}</p>
              <p><span className="font-medium">Status:</span> {contract.status}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Digital Signatures</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-2">Client Signature</h4>
              {contract.clientSignature && (
                <img 
                  src={`http://localhost:5000/${contract.clientSignature}`} 
                  alt="Client Signature" 
                  className="max-w-[200px] border p-2" 
                />
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Engineer Signature</h4>
              {contract.engineerSignature && (
                <img 
                  src={`http://localhost:5000/${contract.engineerSignature}`} 
                  alt="Engineer Signature" 
                  className="max-w-[200px] border p-2" 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContractView;