import { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard';
import { Search } from 'lucide-react';

const ExplorePage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal visibility
  const [showModal, setShowModal] = useState(false);

  // Filter temp state for modal input
  const [tempFilters, setTempFilters] = useState({
    searchTerm: '',
    buildingType: 'all',
    budgetStart: '',
    budgetEnd: '',
    landAreaStart: '',
    landAreaEnd: '',
    timelineStart: '',
    timelineEnd: '',
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/projects/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
          setFilteredProjects(data.projects);
        } else {
          setError(data.message || 'Failed to fetch projects');
        }
      } catch (err) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const applyFilters = () => {
    const {
      searchTerm,
      buildingType,
      budgetStart,
      budgetEnd,
      landAreaStart,
      landAreaEnd,
      timelineStart,
      timelineEnd,
    } = tempFilters;

    let result = [...projects];

    if (searchTerm) {
      result = result.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (buildingType !== 'all') {
      result = result.filter(
        (project) =>
          project.buildingType?.toLowerCase() === buildingType.toLowerCase()
      );
    }

    if (budgetStart || budgetEnd) {
      result = result.filter((project) => {
        const budget = Number(project.budget);
        return (
          (!budgetStart || budget >= Number(budgetStart)) &&
          (!budgetEnd || budget <= Number(budgetEnd))
        );
      });
    }

    if (landAreaStart || landAreaEnd) {
      result = result.filter((project) => {
        const area = Number(project.landArea);
        return (
          (!landAreaStart || area >= Number(landAreaStart)) &&
          (!landAreaEnd || area <= Number(landAreaEnd))
        );
      });
    }

    if (timelineStart || timelineEnd) {
      result = result.filter((project) => {
        const timeline = Number(project.timeline);
        return (
          (!timelineStart || timeline >= Number(timelineStart)) &&
          (!timelineEnd || timeline <= Number(timelineEnd))
        );
      });
    }

    setFilteredProjects(result);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Filter Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
        >
          Filter Projects
        </button>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Apply Filters</h2>

            {/* Filter Fields */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search by title..."
                value={tempFilters.searchTerm}
                onChange={(e) => setTempFilters({ ...tempFilters, searchTerm: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <select
                value={tempFilters.buildingType}
                onChange={(e) => setTempFilters({ ...tempFilters, buildingType: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="all">All Building Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Budget Start"
                  value={tempFilters.budgetStart}
                  onChange={(e) => setTempFilters({ ...tempFilters, budgetStart: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Budget End"
                  value={tempFilters.budgetEnd}
                  onChange={(e) => setTempFilters({ ...tempFilters, budgetEnd: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Land Area Start"
                  value={tempFilters.landAreaStart}
                  onChange={(e) => setTempFilters({ ...tempFilters, landAreaStart: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Land Area End"
                  value={tempFilters.landAreaEnd}
                  onChange={(e) => setTempFilters({ ...tempFilters, landAreaEnd: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Timeline Start (months)"
                  value={tempFilters.timelineStart}
                  onChange={(e) => setTempFilters({ ...tempFilters, timelineStart: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Timeline End (months)"
                  value={tempFilters.timelineEnd}
                  onChange={(e) => setTempFilters({ ...tempFilters, timelineEnd: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-red-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : filteredProjects.length === 0 ? (
        <p className="text-center text-gray-500">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={{
                ...project,
                userName: `${project.userId.F_name} ${project.userId.L_name}`,
                userEmail: project.userId.G_mail,
                userImage: project.userId?.profileImage?.url || null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
