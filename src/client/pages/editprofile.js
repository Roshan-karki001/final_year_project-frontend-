import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    F_name: "",
    L_name: "",
    Phonenumber: "",
    location: "",
    bio: "",
    skills: [],
    experience: [],
    portfolio: [],
    socialLinks: {},
  });

  useEffect(() => {
    if (location.state && location.state.profile) {
      setFormData(location.state.profile);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/auth/edit-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        navigate("/engineer/profile");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-2xl mt-14 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="F_name" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="F_name"
              name="F_name"
              value={formData.F_name}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="L_name" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="L_name"
              name="L_name"
              value={formData.L_name}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="Phonenumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-500" />
              <input
                type="text"
                id="Phonenumber"
                name="Phonenumber"
                value={formData.Phonenumber}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-500" />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        {/* Skills, Experience, Portfolio (simplified for text input, can later use dynamic list) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills.join(", ")}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value.split(",").map(s => s.trim()) })
              }
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (comma-separated)</label>
            <input
              type="text"
              name="experience"
              value={formData.experience.join(", ")}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value.split(",").map(s => s.trim()) })
              }
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Portfolio Links</label>
            <input
              type="text"
              name="portfolio"
              value={formData.portfolio.join(", ")}
              onChange={(e) =>
                setFormData({ ...formData, portfolio: e.target.value.split(",").map(s => s.trim()) })
              }
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* Social Links (GitHub, LinkedIn, etc.) */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Social Links</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={formData.socialLinks.linkedin || ""}
              onChange={(e) =>
                setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })
              }
              className="p-3 border border-gray-300 rounded-lg shadow-sm"
            />
            <input
              type="text"
              placeholder="GitHub URL"
              value={formData.socialLinks.github || ""}
              onChange={(e) =>
                setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })
              }
              className="p-3 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
        </div> */}

        {/* Submit */}
        <div className="text-center pt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
