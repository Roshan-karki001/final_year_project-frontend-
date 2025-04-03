import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Mail, Calendar, DollarSign, Home, Clock } from 'lucide-react';

const ProjectView = () => {
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    const handleViewProfile = (userId) => {
        navigate(`/engineer/view-profile/${userId}`);
    };

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success) {
                    setProject(response.data.project);
                } else {
                    setError('Failed to fetch project details');
                }
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching project details');
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

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
        <div className="max-w-4xl mx-auto p-6">
            {/* Project Title and Status */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold
                        ${project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Project Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Home className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Building Type</p>
                                <p className="font-medium">{project.buildingType}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Land Area</p>
                                <p className="font-medium">{project.landArea} sq ft</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Budget</p>
                                <p className="font-medium">${project.budget}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Timeline</p>
                                <p className="font-medium">{project.timeline}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Created On</p>
                                <p className="font-medium">
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Client Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Client Information</h2>
                    <div className="space-y-4">
                        <div className="mb-4">
                            <h3 className="font-medium text-gray-800">{project.userId.F_name} {project.userId.L_name}</h3>
                            <button
                                onClick={() => handleViewProfile(project.userId._id)}
                                className="mt-2 text-purple-600 hover:text-purple-800"
                            >
                                View Profile
                            </button>
                        </div>
                        <div className="flex items-center">
                            <Mail className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{project.userId.G_mail}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
                
                <button className="flex-1 border border-purple-600 text-purple-600 py-2 px-4 rounded-md hover:bg-purple-50 transition-colors">
                    Contact Client
                </button>
                <button className="flex-1 border border-purple-600 text-purple-600 py-2 px-4 rounded-md hover:bg-purple-50 transition-colors">
                    Apply for project
                </button>
            </div>
        </div>
    );
};

export default ProjectView;