import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EngineerCard from '../../components/EngineerCard';

const SearchEngineer = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState('engineer');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterValues, setFilterValues] = useState({
    name: '',
    location: '',
    minExperience: '',
    maxExperience: '',
    minProjects: '',
    maxProjects: '',
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        const url = userType === 'engineer'
          ? 'http://localhost:5000/api/auth/engineers'
          : 'http://localhost:5000/api/auth/clients';

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = userType === 'engineer' ? response.data.engineers : response.data.clients;
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || `Error fetching ${userType}s`);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, userType]);

  const handleViewProfile = (userId) => {
    navigate(`/view-profile/${userId}`);
  };

  const applyFilters = () => {
    const { name, location, minExperience, maxExperience, minProjects, maxProjects } = filterValues;

    let result = [...users];

    if (name) {
      result = result.filter(user =>
        `${user.F_name} ${user.L_name}`.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (location) {
      result = result.filter(user =>
        user.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minExperience || maxExperience) {
      result = result.filter(user => {
        const exp = Number(user.experience || 0);
        return (
          (!minExperience || exp >= Number(minExperience)) &&
          (!maxExperience || exp <= Number(maxExperience))
        );
      });
    }

    if (userType === 'engineer' && (minProjects || maxProjects)) {
      result = result.filter(user => {
        const projects = Number(user.projects || 0); // Ensure `projects` exists in your data
        return (
          (!minProjects || projects >= Number(minProjects)) &&
          (!maxProjects || projects <= Number(maxProjects))
        );
      });
    }

    setFilteredUsers(result);
    setShowFilterModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setUserType('engineer')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            userType === 'engineer' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Engineers
        </button>
        <button
          onClick={() => setUserType('client')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            userType === 'client' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Clients
        </button>
      </div>

      {/* Filter Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowFilterModal(true)}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Filter
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        Find {userType === 'engineer' ? 'Engineers' : 'Clients'}
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <EngineerCard
            key={user._id}
            engineer={user}
            onViewProfile={handleViewProfile}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No {userType === 'engineer' ? 'engineers' : 'clients'} found.
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl space-y-6">
            <h2 className="text-xl font-semibold">Filter {userType === 'engineer' ? 'Engineers' : 'Clients'}</h2>

            <input
              type="text"
              placeholder="Name"
              value={filterValues.name}
              onChange={(e) => setFilterValues({ ...filterValues, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="text"
              placeholder="Location"
              value={filterValues.location}
              onChange={(e) => setFilterValues({ ...filterValues, location: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />

            {userType === 'engineer' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min Experience"
                    value={filterValues.minExperience}
                    onChange={(e) => setFilterValues({ ...filterValues, minExperience: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max Experience"
                    value={filterValues.maxExperience}
                    onChange={(e) => setFilterValues({ ...filterValues, maxExperience: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input
                    type="number"
                    placeholder="Min Projects"
                    value={filterValues.minProjects}
                    onChange={(e) => setFilterValues({ ...filterValues, minProjects: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max Projects"
                    value={filterValues.maxProjects}
                    onChange={(e) => setFilterValues({ ...filterValues, maxProjects: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-600 hover:text-red-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchEngineer;
