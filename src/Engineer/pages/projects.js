import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [filters, setFilters] = useState({
        minBudget: '',
        maxBudget: '',
        buildingType: '',
        timeline: ''
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/projects/engineer-search', {
                headers: { Authorization: `Bearer ${token}` },
                params: filters
            });
            setProjects(response.data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProjects();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Filter Section */}
            <form onSubmit={handleSearch} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Budget
                        </label>
                        <input
                            type="number"
                            name="minBudget"
                            value={filters.minBudget}
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-md"
                            placeholder="Minimum budget"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Budget
                        </label>
                        <input
                            type="number"
                            name="maxBudget"
                            value={filters.maxBudget}
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-md"
                            placeholder="Maximum budget"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Building Type
                        </label>
                        <select
                            name="buildingType"
                            value={filters.buildingType}
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">All Types</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="industrial">Industrial</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timeline
                        </label>
                        <input
                            type="date"
                            name="timeline"
                            value={filters.timeline}
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                    Search Projects
                </button>
            </form>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                            <div className="space-y-2">
                                <p className="text-gray-600">
                                    <span className="font-medium">Client:</span>{' '}
                                    {`${project.userId.F_name} ${project.userId.L_name}`}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Land Area:</span> {project.landArea} sq ft
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Building Type:</span> {project.buildingType}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Budget:</span> ${project.budget}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Timeline:</span>{' '}
                                    {new Date(project.timeline).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                                onClick={() => {/* Add your logic for applying to project */}}
                            >
                                Apply for Project
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;