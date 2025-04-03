import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Rate, message } from 'antd';
import axios from 'axios';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('/api/admin/reviews', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReviews(response.data.reviews);
        } catch (error) {
            message.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const columns = [
        {
            title: 'Project',
            dataIndex: ['project', 'title'],
            key: 'project'
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => <Rate disabled defaultValue={rating} />
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        type={record.status === 'pending' ? 'primary' : 'default'}
                        onClick={() => handleReviewAction(record._id, 'approve')}
                        disabled={record.status === 'approved'}
                    >
                        Approve
                    </Button>
                    <Button 
                        type="danger" 
                        onClick={() => handleReviewAction(record._id, 'reject')}
                        disabled={record.status === 'rejected'}
                    >
                        Reject
                    </Button>
                </Space>
            )
        }
    ];

    const handleReviewAction = async (reviewId, action) => {
        try {
            await axios.post(`/api/admin/reviews/${reviewId}/${action}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            message.success('Review updated successfully');
            fetchReviews();
        } catch (error) {
            message.error('Failed to update review');
        }
    };

    return (
        <div>
            <h2>Review Management</h2>
            <Table
                loading={loading}
                columns={columns}
                dataSource={reviews}
                rowKey="_id"
            />
        </div>
    );
};

export default Reviews;