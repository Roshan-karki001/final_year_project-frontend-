import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchEngineer = () => {
    const [engineers, setEngineers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEngineers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/engineers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEngineers(response.data.engineers);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching engineers');
                setLoading(false);
            }
        };

        fetchEngineers();
    }, []);

    const handleViewProfile = (engineerId) => {
        navigate(`/engineer-profile/${engineerId}`);
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
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Find Engineers</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {engineers.map((engineer) => (
                    <div key={engineer._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-xl font-semibold text-purple-600">
                                    {engineer.F_name[0]}
                                </span>
                            </div>
                            <div className="ml-4">
                                <h3 className="font-semibold text-lg">
                                    {engineer.F_name} {engineer.L_name}
                                </h3>
                                <p className="text-gray-600 text-sm">{engineer.G_mail}</p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            {engineer.skills && (
                                <div>
                                    <p className="text-sm text-gray-500">Skills</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {engineer.skills.split(',').map((skill, index) => (
                                            <span 
                                                key={index}
                                                className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs"
                                            >
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {engineer.experience && (
                                <div>
                                    <p className="text-sm text-gray-500">Experience</p>
                                    <p className="text-sm">{engineer.experience} years</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => handleViewProfile(engineer._id)}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchEngineer;