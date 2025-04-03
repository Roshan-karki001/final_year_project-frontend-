import { Calendar, DollarSign, Home, Maximize } from "lucide-react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleViewDetails = (projectId) => {
    navigate(`/client/project/${projectId}`);
  };

  return (
    <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-xl">{project.title}</h3>
          <p className="text-sm text-gray-500">
            By {project.userId.F_name} {project.userId.L_name}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          project.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
          project.status === "completed" ? "bg-green-100 text-green-800" : 
          "bg-blue-100 text-blue-800"
        }`}>
          {project.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Maximize className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">{project.landArea} sq.ft</span>
        </div>
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700 capitalize">{project.buildingType}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">${project.budget.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">{project.timeline}</span>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => handleViewDetails(project._id)}
        >
          View Details
        </button>
        <button
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          onClick={() => {/* Add contact owner handler */}}
        >
          Contact Owner
        </button>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userId: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      F_name: PropTypes.string.isRequired,
      L_name: PropTypes.string.isRequired,
      G_mail: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    landArea: PropTypes.number.isRequired,
    buildingType: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    timeline: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

// Make sure the export is correct
export default ProjectCard;