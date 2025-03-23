import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data.reviews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={20}
        className={`${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">My Reviews</h2>
      
      <div className="grid gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-semibold">
                  {review.fromUserId.F_name[0]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">
                  {review.fromUserId.F_name} {review.fromUserId.L_name}
                </h3>
                <div className="flex items-center mt-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <span className="ml-auto text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600">{review.reviewText}</p>
          </div>
        ))}
        
        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;