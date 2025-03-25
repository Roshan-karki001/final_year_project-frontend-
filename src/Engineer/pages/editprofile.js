import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    F_name: '',
    L_name: '',
    Phonenumber: '',
    location: '',
    bio: '',
    skills: [],
    experience: [],  // Initialize experience array
    portfolio: [],   // Initialize portfolio array
    socialLinks: {},
    profileImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.profileData) {
      setFormData(location.state.profileData);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/edit-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        navigate('/engineer/profile');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="F_name"
              value={formData.F_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="L_name"
              value={formData.L_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="Phonenumber"
            value={formData.Phonenumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
          <input
            type="text"
            value={formData.skills.join(', ')}
            onChange={handleSkillsChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Add Experience Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience</label>
          {formData.experience?.map((exp, index) => (
            <div key={index} className="mt-2 grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Job Title"
                value={exp.title || ''}
                onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[index] = { ...newExp[index], title: e.target.value };
                  setFormData({ ...formData, experience: newExp });
                }}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.company || ''}
                onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[index] = { ...newExp[index], company: e.target.value };
                  setFormData({ ...formData, experience: newExp });
                }}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Years"
                value={exp.years || ''}
                onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[index] = { ...newExp[index], years: e.target.value };
                  setFormData({ ...formData, experience: newExp });
                }}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                experience: [...(formData.experience || []), { title: '', company: '', years: '' }]
              });
            }}
            className="mt-2 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Add Experience
          </button>
        </div>

        {/* Add Portfolio Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Portfolio Links</label>
          {formData.portfolio?.map((link, index) => (
            <div key={index} className="mt-2 flex gap-2">
              <input
                type="url"
                placeholder="Portfolio Link"
                value={link || ''}
                onChange={(e) => {
                  const newPortfolio = [...formData.portfolio];
                  newPortfolio[index] = e.target.value;
                  setFormData({ ...formData, portfolio: newPortfolio });
                }}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  const newPortfolio = formData.portfolio.filter((_, i) => i !== index);
                  setFormData({ ...formData, portfolio: newPortfolio });
                }}
                className="px-2 text-red-600 hover:bg-red-50 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                portfolio: [...(formData.portfolio || []), '']
              });
            }}
            className="mt-2 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Add Portfolio Link
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/engineer/profile')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;