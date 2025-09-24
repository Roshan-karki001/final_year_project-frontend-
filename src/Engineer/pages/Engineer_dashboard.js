import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const EngineerDashboard = () => {
    const [appliedProjects, setAppliedProjects] = useState([]);
    const [availableProjects, setAvailableProjects] = useState([]);
    const [contracts, setContracts] = useState([]);
    const token = localStorage.getItem('token');

    // Move these function declarations before the useEffect
    const fetchAppliedProjects = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/projects/applied-projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppliedProjects(response.data.projects);
        } catch (error) {
            console.error('Error fetching applied projects:', error);
            setAppliedProjects([]);
        }
    }, [token]);

    const fetchAvailableProjects = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/projects/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAvailableProjects(response.data.projects.slice(0, 2));
        } catch (error) {
            console.error('Error fetching available projects:', error);
            setAvailableProjects([]);
        }
    }, [token]);

    const fetchContracts = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/contracts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Only show latest 2 contracts
            setContracts(response.data.contracts.slice(0, 2));
        } catch (error) {
            console.error('Error fetching contracts:', error);
            setContracts([]);
        }
    }, [token]);

    // Now use the functions in useEffect
    useEffect(() => {
        fetchAppliedProjects();
        fetchAvailableProjects();
        fetchContracts();
    }, [fetchAppliedProjects, fetchAvailableProjects, fetchContracts]);

    useEffect(() => {
        fetchAppliedProjects();
        fetchAvailableProjects();
    }, [fetchAppliedProjects, fetchAvailableProjects]);

    return (
        <div className="p-8 space-y-8">
            {/* Applied Projects Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Your Applications</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {appliedProjects.map((project) => (
                        <div key={project._id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                                    {project.userId?.profileImage?.url ? (
                                        <img 
                                            src={project.userId.profileImage.url} 
                                            alt="Client" 
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User size={20} className="text-purple-700" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">{project.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        Client: {project.userId?.F_name} {project.userId?.L_name}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                {project.buildingType} building - {project.landArea} sq ft
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                                    Budget: ${project.budget}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    project.applicationStatus === 'accepted' ? 'bg-green-100 text-green-700' :
                                    project.applicationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    Status: {project.applicationStatus || 'Pending'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {appliedProjects.length === 0 && (
                        <p className="text-gray-500 text-center">No applications yet</p>
                    )}
                </div>
            </section>

            {/* Available Projects Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Available Projects</h2>
                    <Link 
                        to="/engineer/projects" 
                        className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                        View All
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableProjects.map((project) => (
                        <div key={project._id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                                    {project.userId?.profileImage?.url ? (
                                        <img 
                                            src={project.userId.profileImage.url} 
                                            alt="Client" 
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User size={20} className="text-purple-700" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">{project.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        Posted by: {project.userId?.F_name} {project.userId?.L_name}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                {project.buildingType} building - {project.landArea} sq ft
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                                    Budget: ${project.budget}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    Timeline: {project.timeline}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Update Contracts Section with simplified UI */}
            <section className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Recent Contracts</h2>
                    <Link 
                        to="/engineer/contracts" 
                        className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                        View All Contracts
                    </Link>
                </div>
                <div className="space-y-4">
                    {contracts.map((contract) => (
                        <div key={contract._id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-medium text-lg">{contract.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        Client: {contract.userId?.F_name} {contract.userId?.L_name}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    contract.status === 'active' ? 'bg-green-100 text-green-700' :
                                    contract.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {contract.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-purple-600 font-medium">
                                    ${contract.budget?.toLocaleString()}
                                </span>
                                // Then modify the Link component to:
                                <Link 
                                    to={`/engineer/contracts/view/${contract._id}`}
                                    className="text-sm text-purple-600 hover:text-purple-800"
                                >
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    ))}
                    {contracts.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No contracts available</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EngineerDashboard;