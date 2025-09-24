import { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard';

const MyProject = () => {  // Changed from myproject to MyProject
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchProjects = async (status = 'all') => {
    try {
      let endpoint;
      switch (status) {
        case 'done':
          endpoint = 'projects/completed';  // Matches backend route
          break;
        case 'progress':
          endpoint = 'projects/pending';    // Matches backend route
          break;
        case 'pending':
          endpoint = 'projects/active';     // Matches backend route
          break;
        default:
          endpoint = 'projects/';
      }
      
      console.log('Fetching from endpoint:', `http://localhost:5000/api/${endpoint}`);
      
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
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
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
            activeFilter === 'all'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Projects
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
            activeFilter === 'pending'
              ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveFilter('progress')}
          className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
            activeFilter === 'progress'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveFilter('done')}
          className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
            activeFilter === 'done'
              ? 'bg-green-500 text-white shadow-lg shadow-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 mt-8 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              console.log('Project data:', project); // Add this to debug
              return (
                <ProjectCard 
                  key={project._id} 
                  project={{
                    ...project,
                    userName: project.userId ? `${project.userId.F_name} ${project.userId.L_name}` : 'Unknown User',
                    userEmail: project.userId?.G_mail || '',
                    userImage: project.userId?.profileImage?.url || null
                  }} 
                />
              );
            })}
          </div>
          {projects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No projects found</div>
              <div className="text-gray-500">Try adjusting your filter selection</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyProject;  // Changed from myproject to MyProject