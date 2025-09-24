import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ContractView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchContractDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/contracts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        console.log('Contract data:', response.data.contract);
        setContract(response.data.contract);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching contract details');
      console.error('Error:', error);
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

  const handleSignatureUpload = async (type) => {
    try {
      const fileInput = document.querySelector(`input[name="${type}Signature"]`);
      const file = fileInput.files[0];
      if (!file) {
        alert('Please select a file first');
        return;
      }

      const formData = new FormData();
      formData.append('signature', file);
      formData.append('type', type);

      const response = await axios.post(
        `http://localhost:5000/api/contracts/${id}/sign`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        alert('Signature uploaded successfully');
        fetchContractDetails();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload signature');
      console.error('Upload error:', error);
    }
  };

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
      {/* Contract Header */}
      <div className="text-center mb-8 border-b-2 pb-4">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">EngiBridge</h1>
        <h2 className="text-2xl font-semibold">Construction Project Contract</h2>
        <p className="text-gray-600">Date: {new Date(contract.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Parties Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 border-b">Agreement Between:</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-2">Client (First Party)</h4>
              <p>{contract.userId.F_name} {contract.userId.L_name}</p>
              <p className="text-gray-600 text-sm">{contract.userId.G_mail}</p>
              <p className="text-gray-600 text-sm">{contract.userId.Phonenumber}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Engineer (Second Party)</h4>
              <p>{contract.engineerId?.F_name} {contract.engineerId?.L_name}</p>
              <p className="text-gray-600 text-sm">{contract.engineerId?.G_mail}</p>
              <p className="text-gray-600 text-sm">{contract.engineerId?.Phonenumber}</p>
            </div>
          </div>
        </div>

        {/* Project Specifications */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 border-b">Project Specifications</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Project Title:</strong> {contract.title}</p>
            <p><strong>Building Type:</strong> {contract.buildingType}</p>
            <p><strong>Land Area:</strong> {contract.landArea} sq ft</p>
            <p><strong>Timeline:</strong> {contract.timeline}</p>
            <p><strong>Budget:</strong> ${contract.budget.toLocaleString()}</p>
            <p><strong>Status:</strong> {contract.status}</p>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 border-b">Terms and Conditions</h3>
          <div className="space-y-2 text-sm">
            <p>1. The engineer agrees to complete the project within the specified timeline.</p>
            <p>2. All work must meet professional standards and local building codes.</p>
            <p>3. Regular progress updates will be provided to the client.</p>
            <p>4. Payment terms will be as specified in the project details.</p>
            <p>5. Any modifications to the original plan must be approved by both parties.</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-6 border-b">Digital Signatures</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="font-medium mb-2">Client's Signature</h4>
              {contract.clientSignature ? (
                <img 
                  src={`http://localhost:5000/${contract.clientSignature}`} 
                  alt="Client Signature" 
                  className="max-w-[200px] border p-2" 
                />
              ) : (
                contract.status === 'pending' && (
                  <div className="border p-4 rounded">
                    <input
                      type="file"
                      name="clientSignature"
                      accept="image/*"
                      onChange={() => handleSignatureUpload('client')}
                      className="w-full text-sm"
                    />
                  </div>
                )
              )}
              <p className="mt-2 text-sm">Date: {contract.clientSignature ? new Date(contract.updatedAt).toLocaleDateString() : 'Pending'}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Engineer's Signature</h4>
              {contract.engineerSignature ? (
                <img 
                  src={`http://localhost:5000/${contract.engineerSignature}`} 
                  alt="Engineer Signature" 
                  className="max-w-[200px] border p-2" 
                />
              ) : (
                contract.status === 'pending' && (
                  <div className="border p-4 rounded">
                    <input
                      type="file"
                      name="engineerSignature"
                      accept="image/*"
                      onChange={() => handleSignatureUpload('engineer')}
                      className="w-full text-sm"
                    />
                  </div>
                )
              )}
              <p className="mt-2 text-sm">Date: {contract.engineerSignature ? new Date(contract.updatedAt).toLocaleDateString() : 'Pending'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractView;