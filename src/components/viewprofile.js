import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Mail, Phone, Briefcase } from 'lucide-react';

const ViewProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [review, setReview] = useState({
    engineerId: id,
    reviewText: '',
    rating: 5
  });

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setProfile(null);
      return;
    }

    try {
      // Fetch user profile
      const profileResponse = await fetch(`http://localhost:5000/api/auth/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const profileData = await profileResponse.json();
      
      // Fetch user projects
      // Update the fetch URL to use the new endpoint
      const projectsResponse = await fetch(`http://localhost:5000/api/projects/user/${id}`, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      const projectsData = await projectsResponse.json();

      // Fetch user reviews
      const reviewsResponse = await fetch(`http://localhost:5000/api/reviews/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const reviewsData = await reviewsResponse.json();

      if (profileData.success) {
        // Calculate project statistics
        const projects = projectsData.projects || [];
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const activeProjects = projects.filter(p => p.status === 'active').length;
        
        // Calculate satisfaction rate from reviews
        const reviews = reviewsData.reviews || [];
        const averageRating = reviews.length > 0 
          ? (reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length) * 20 // Convert to percentage
          : 0;

        setProfile({
          ...profileData.user,
          reviews: reviews,
          totalProjects: projects.length,
          completedProjects: completedProjects,
          ongoingProjects: activeProjects,
          satisfactionRate: `${Math.round(averageRating)}%`
        });
      } else {
        throw new Error(profileData.message);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setProfile(null);
    }
}, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      // Log the request body for debugging
      const requestBody = {
        engineerId: id,
        reviewText: review.reviewText,
        rating: parseInt(review.rating) // Ensure rating is a number
      };
      console.log('Sending review:', requestBody);

      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Response:', data); // Debug response

      if (data.success) {
        await fetchProfile(); // Refresh profile data
        setReview({ engineerId: id, reviewText: '', rating: 5 });
        alert('Review submitted successfully!');
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      alert('Error submitting review');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Main Profile Content */}
        <div>
          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32">
              <img
                src={profile.profileImage?.url || "https://zultimate.com/wp-content/uploads/2019/12/default-profile.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-md"
              />
            </div>
            <h1 className="text-2xl font-bold mt-4 text-gray-800">{profile.F_name} {profile.L_name}</h1>
            <p className="text-gray-500">{profile.role}</p>
          </div>

          {/* Profile Details */}
          <div className="mt-6 space-y-4 text-gray-700">
            <div className="flex justify-center items-center border-b pb-3">
              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2 text-gray-600"><MapPin size={16} /> {profile.location || "Not Provided"}</p>
                <p className="flex items-center gap-2 text-gray-600"><Mail size={16} /> {profile.G_mail}</p>
                <p className="flex items-center gap-2 text-gray-600"><Phone size={16} /> {profile.Phonenumber}</p>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
            <p className="text-gray-600 mt-2">{profile.bio || "No bio available."}</p>
          </div>

          {/* Skills Section */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {profile.skills?.length > 0 ? profile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              )) : <p>No skills added.</p>}
            </ul>
          </div>

          {/* Experience Section */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800">Experience</h2>
            <ul className="text-gray-600 mt-2">
              {profile.experience?.length > 0 ? profile.experience.map((exp, index) => (
                <li key={index} className="flex gap-2 items-center">
                  <Briefcase size={16} /> {exp.title} at {exp.company} ({exp.years} years)
                </li>
              )) : <p>No experience added.</p>}
            </ul>
          </div>

          {/* Portfolio Section */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800">Portfolio</h2>
            <ul className="text-blue-600 mt-2">
              {profile.portfolio?.length > 0 ? profile.portfolio.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">{link}</a>
                </li>
              )) : <p>No portfolio added.</p>}
            </ul>
          </div>
        </div>

        {/* Right Column - Stats and Reviews */}
        <div className="space-y-6">
          {/* Projects Stats */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-blue-600">{profile.totalProjects || 0}</p>
                <p className="text-gray-600">Total Projects</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-green-600">{profile.completedProjects || 0}</p>
                <p className="text-gray-600">Completed</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-yellow-600">{profile.ongoingProjects || 0}</p>
                <p className="text-gray-600">In Progress</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-purple-600">{profile.satisfactionRate || "0%"}</p>
                <p className="text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </div>

          {/* Reviews Section remains unchanged */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Reviews</h2>
            
            {/* Display existing reviews first */}
            <div className="mb-6 border-b pb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Previous Reviews</h3>
              {profile.reviews?.length > 0 ? (
                profile.reviews.map((rev, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-black-800">{rev.clientName}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < rev.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{rev.reviewText}</p>
                    <p className="text-gray-400 text-xs mt-2">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No reviews yet</p>
              )}
            </div>

            {/* Write Review Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReview({ ...review, rating: star })}
                      className={`text-2xl ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={review.reviewText}
                  onChange={(e) => setReview({ ...review, reviewText: e.target.value })}
                  className="w-full p-3 border rounded-lg resize-none"
                  rows="4"
                  placeholder="Share your experience working with this engineer..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;

// The main changes:
// 1. Removed duplicate review state and handleReviewSubmit function
// 2. Updated review state structure to match API requirements
// 3. Combined the reviews section into a single container
// 4. Fixed the review form to use reviewText instead of comment
// 5. Added fetchProfile call after successful review submission
// 6. Removed duplicate sections and cleaned up the code structure

// Make sure your backend API endpoints match:
// - GET: `http://localhost:5000/api/auth/${id}` for profile data
// - POST: `http://localhost:5000/api/reviews` for submitting reviews
