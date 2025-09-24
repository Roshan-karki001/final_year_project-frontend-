import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const ClientDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [exploreProjects, setExploreProjects] = useState([]);
    const token = localStorage.getItem('token');

    // Fixed fetchexplorer function
    const fetchexplorer = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/projects/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExploreProjects(response.data.projects.slice(0, 2)); // Only show 2 projects
        } catch (error) {
            console.error('Error fetching explorer data:', error);
            setExploreProjects([]);
        }
    }, [token]);

    // Simplified contracts data
    const contracts = [
        {
            title: 'Project AI designer contract',
            author: 'DaiBui',
            image: '/contract-placeholder.jpg',
        },
        {
            title: 'Backend Dev Contract',
            author: 'Taylor Lee',
            image: '/contract-placeholder.jpg',
        },
    ];

    // Inside fetchProjects function
    const fetchProjects = useCallback(async () => {
        try {
            console.log('Attempting to fetch user projects...');
            const response = await axios.get('http://localhost:5000/api/projects', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('API Response:', response);
            
            const projectsWithApplicants = await Promise.all(response.data.projects.map(async (project) => {
                let applicantsDetails = [];
                
                if (project.applications && project.applications.length > 0) {
                    applicantsDetails = await Promise.all(project.applications.map(async (application) => {
                        // Skip applications without engineer ID
                        if (!application.engineer) {
                            return null;
                        }

                        try {
                            // Directly use the engineer ID if available
                            const engineerId = application.engineer._id || application.engineer;
                            
                            if (!engineerId) return null;

                            const res = await axios.get(`http://localhost:5000/api/auth/user/${engineerId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            
                            const userData = res.data.user;
                            return {
                                _id: application._id,
                                engineerId: engineerId,
                                engineer: userData, // Store full engineer data
                                F_name: userData.F_name,
                                L_name: userData.L_name,
                                G_mail: userData.G_mail,
                                role: userData.role,
                                status: application.status,
                                appliedAt: application.appliedAt
                            };
                        } catch (error) {
                            console.warn(`Failed to fetch applicant details:`, error.message);
                            return null;
                        }
                    }));

                    // Filter out null values
                    applicantsDetails = applicantsDetails.filter(detail => detail !== null);
                }

                return { ...project, applications: applicantsDetails };
            }));

            setProjects(projectsWithApplicants);
        } catch (error) {
            console.error('Detailed API Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            setProjects([]);
        }
    }, [token]);

    useEffect(() => {
        fetchProjects();
        fetchexplorer();
    }, [fetchProjects, fetchexplorer]);

    const handleAcceptApplication = async (projectId, applicantId) => {
        try {
            console.log('Accepting application:', { projectId, applicantId });

            if (!projectId || !applicantId) {
                alert('Both projectId and applicantId are required');
                return;
            }

            // Updated URL format to match the backend endpoint
            const acceptResponse = await axios.post(
                `http://localhost:5000/api/projects/${projectId}/accept/${applicantId}`,
                {}, // Empty body since we're passing params in URL
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (acceptResponse.data.success) {
                // Then create the contract with more detailed terms
                const contractResponse = await axios.post(
                    'http://localhost:5000/api/contracts',
                    {
                        projectId: projectId ,
                        engineerId: applicantId,
                        termsConditions: `
                            1. The engineer agrees to complete the project within the specified timeline.
                            2. All work must meet professional standards and local building codes.
                            3. Regular progress updates will be provided to the client.
                            4. Payment terms will be as specified in the project details.
                            5. Any modifications to the original plan must be approved by both parties.
                        `
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (contractResponse.data.success) {
                    alert('Application accepted and contract created successfully!');
                } else {
                    alert('Application accepted but contract creation failed.');
                }

                fetchProjects(); // Refresh the projects list
            }
        } catch (error) {
            console.error('Error details:', error.response?.data);
            alert(error.response?.data?.message || 'Error processing application');
        }
    };
    const handlenotification = async (applicantId) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/notification/notifications',
                {
                    userId: applicantId, // Changed from applicantId to userId to match backend
                    message: "Your project application has been accepted and the contract has been created. Please review and sign for the contract",
                    type: "project and contract"
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert('Notification sent successfully!'); // Changed alert message
                fetchProjects();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error sending notification');
        }
    };

    const handleRejectApplication = async (projectId, applicantId) => {
        try {
            console.log('Rejecting application:', { projectId, applicantId });

            if (!projectId || !applicantId) {
                alert('Both projectId and applicantId are required');
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/api/projects/reject-application',
                { projectId, applicantId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert('Application rejected successfully!');
                fetchProjects();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error rejecting application');
        }
    };
    const handlerejectnotification = async (applicantId) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/notification/notifications',
                {
                    userId: applicantId, // Changed from applicantId to userId to match backend
                    message: "Your project application is rejected.",
                    type: "project and contract"
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert('Notification sent successfully!'); // Changed alert message
                fetchProjects();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error sending notification');
        }
    };


    return (
        <div className="p-8 space-y-8">
            {/* Project Applications Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Project Applications</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {projects
                        .filter(project => project.status === "pending")
                        .map((project) => (
                            <div key={project._id} className="bg-white p-6 rounded-lg shadow">
                                <h3 className="font-medium mb-2">{project.title}</h3>
                                <p className="text-gray-600 mb-4">Status: {project.status}</p>

                                {project.applications && project.applications.length > 0 ? (
                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2">Applications:</h4>
                                        <div className="space-y-2">
                                            {project.applications.map((application) => (
                                                <div 
                                                    key={`${project._id}-${application._id}`} 
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {application.engineer.F_name} {application.engineer.L_name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {application.engineer.G_mail}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Role: {application.engineer.role || 'Engineer'}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                console.log('Application data:', application); // Debug log
                                                                if (!application.engineer || !application.engineer.id) {
                                                                    console.error('Engineer ID missing in application:', application);
                                                                    return;
                                                                }
                                                                handleAcceptApplication(project._id, application.engineer.id);
                                                                handlenotification(application.engineer.id);
                                                            }}
                                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (!application.engineer || !application.engineer._id) {
                                                                    console.error('Engineer ID missing in application:', application);
                                                                    return;
                                                                }
                                                                handleRejectApplication(project._id, application.engineer._id);
                                                                handlerejectnotification(application.engineer._id);
                                                            }}
                                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No applications yet.</p>
                                )}
                            </div>
                        ))}
                </div>
            </section>

            {/* Explorer Projects Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Vacancy</h2>
                    <Link 
                        to="/client/explore" 
                        className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                        View All
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exploreProjects.map((project) => (
                        <div key={project._id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                                    {project.userId?.profileImage?.url ? (
                                        <img 
                                            src={project.userId.profileImage.url} 
                                            alt="User" 
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

            {/* Contracts Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Your Contracts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contracts.map((contract, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow">
                            <img
                                src={contract.image}
                                alt="Contract"
                                className="w-full h-32 object-cover mb-4 rounded"
                            />
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                                <span className="text-sm">{contract.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ClientDashboard;
