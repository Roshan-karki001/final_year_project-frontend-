import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Contracts = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchContracts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contracts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContracts(response.data.contracts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setLoading(false);
    }
  };

  // Fix 1: Add fetchContracts to dependency array
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]); // Added fetchContracts as dependency

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">My Contracts</h2>

      <div className="grid gap-6">
        {contracts.map((contract) => (
          <div key={contract._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{contract.title}</h3>
                <p className="text-gray-600">
                  Client: {contract.userId.F_name} {contract.userId.L_name}
                </p>
                {/* Add engineer information */}
                <p className="text-gray-600">
                  Engineer: {contract.engineerId?.F_name} {contract.engineerId?.L_name}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(contract.status)}`}>
                {contract.status}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Land Area</p>
                <p>{contract.landArea} sq ft</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Building Type</p>
                <p className="capitalize">{contract.buildingType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Timeline</p>
                <p>{contract.timeline}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-purple-600">
                  Budget: ${contract.budget.toLocaleString()}
                </span>
                {/* Fix 2: Proper JSX comment format */}
                <button
                  onClick={() => navigate(`/client/contracts/view/${contract._id}`)}
                  className="px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50"
                >
                  View Contract
                </button>
              </div>
            </div>
          </div>
        ))}

        {contracts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No contracts found
          </div>
        )}
      </div>
    </div>
  );
};

export default Contracts;