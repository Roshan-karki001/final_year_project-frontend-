import { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard';

const ExplorePage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchProjects = async (status = 'all') => {
    try {
      const endpoint = status === 'all' 
        ? 'all'
        : status === 'done' 
        ? 'completed'
        : status === 'progress' 
        ? 'progress'
        : status === 'pending'
        ? 'active'
        : 'all';
      
      console.log('Fetching from endpoint:', `http://localhost:5000/api/projects/${endpoint}`);
      
      const response = await fetch(`http://localhost:5000/api/projects/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'same-origin'
      });
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setProjects(data.projects);
      } else {
        setError(data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(activeFilter);
  }, [activeFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-6 py-2 rounded-full ${
            activeFilter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Projects
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-6 py-2 rounded-full ${
            activeFilter === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveFilter('progress')}
          className={`px-6 py-2 rounded-full ${
            activeFilter === 'progress'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setActiveFilter('done')}
          className={`px-6 py-2 rounded-full ${
            activeFilter === 'done'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 mt-8">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project._id} 
                project={{
                  ...project,
                  userName: `${project.userId.F_name} ${project.userId.L_name}`,
                  userEmail: project.userId.G_mail
                }} 
              />
            ))}
          </div>
          {projects.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No projects found for this filter.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExplorePage;