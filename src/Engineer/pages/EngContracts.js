import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EngContracts = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchContracts();
  }, [token, navigate]);

  const fetchContracts = async () => {
    try {
      // Get engineer ID from token
      const engineerId = JSON.parse(atob(token.split('.')[1])).id;
      const response = await axios.get(`http://localhost:5000/api/contracts/engineer/${engineerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContracts(response.data.contracts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleContractAction = async (contractId, action) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/contracts/${contractId}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Update the contracts list after action
        setContracts(contracts.map(contract => 
          contract._id === contractId 
            ? { ...contract, status: action === 'accept' ? 'active' : 'rejected' }
            : contract
        ));
      }
    } catch (error) {
      console.error(`Error ${action}ing contract:`, error);
      alert(`Failed to ${action} contract. Please try again.`);
    }
  };

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
      <h2 className="text-2xl font-semibold mb-6">my Contracts</h2>

      <div className="grid gap-6">
        {contracts.map((contract) => (
          <div key={contract._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{contract.projectId.title}</h3>
                <p className="text-gray-600">
                  Client: {contract.userId.F_name} {contract.userId.L_name}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(contract.status)}`}>
                {contract.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Start Date</p>
                <p>{new Date(contract.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">End Date</p>
                <p>{new Date(contract.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Contract Details</h4>
              <p className="text-gray-600 mb-2">{contract.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-medium text-purple-600">
                  Budget: ${contract.budget.toLocaleString()}
                </span>
                <button
                  onClick={() => window.open(contract.documentUrl, '_blank')}
                  className="px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50"
                >
                  View Document
                </button>
              </div>
            </div>

            {contract.status === 'pending' && (
              <div className="flex justify-end space-x-4 mt-4 pt-4 border-t">
                <button
                  onClick={() => handleContractAction(contract._id, 'reject')}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleContractAction(contract._id, 'accept')}
                  className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  Accept
                </button>
              </div>
            )}
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

export default EngContracts;