import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Rate, message, Card, Modal } from 'antd';
import axios from 'axios';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserReviews, setSelectedUserReviews] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/reviews', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                setReviews(response.data.reviews);
            } else {
                message.error('Failed to fetch reviews: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            message.error('Failed to fetch reviews: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Group reviews by toUserId
    const groupedReviews = reviews.reduce((acc, review) => {
        const toUserId = review.toUserId?._id;
        if (!acc[toUserId]) {
            acc[toUserId] = {
                user: review.toUserId,
                reviews: [],
                averageRating: 0
            };
        }
        acc[toUserId].reviews.push(review);
        acc[toUserId].averageRating = acc[toUserId].reviews.reduce((sum, r) => sum + r.rating, 0) / acc[toUserId].reviews.length;
        return acc;
    }, {});

    const summaryColumns = [
        {
            title: 'Engineer',
            key: 'engineer',
            render: (_, record) => `${record.user?.F_name} ${record.user?.L_name}`,
            filterSearch: true,
            filters: [...new Set(reviews.map(review => review.toUserId))].map(user => ({
                text: `${user?.F_name} ${user?.L_name}`,
                value: user?._id
            })),
            onFilter: (value, record) => record.user?._id === value
        },
        {
            title: 'Email',
            key: 'email',
            render: (_, record) => record.user?.G_mail || 'N/A',
            filterSearch: true,
            filters: [...new Set(reviews.map(review => review.toUserId?.G_mail))].map(email => ({
                text: email,
                value: email
            })),
            onFilter: (value, record) => record.user?.G_mail === value
        },
        {
            title: 'Total Reviews',
            key: 'totalReviews',
            render: (_, record) => record.reviews.length,
            sorter: (a, b) => a.reviews.length - b.reviews.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Average Rating',
            key: 'averageRating',
            render: (_, record) => <Rate disabled allowHalf value={record.averageRating} />,
            sorter: (a, b) => a.averageRating - b.averageRating,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="primary" onClick={() => {
                    setSelectedUserReviews(record);
                    setIsModalVisible(true);
                }}>
                    View All Reviews
                </Button>
            )
        }
    ];

    const detailColumns = [
        {
            title: 'From',
            dataIndex: ['fromUserId'],
            key: 'from',
            render: (fromUser) => fromUser ? `${fromUser.F_name} ${fromUser.L_name}` : 'N/A'
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => <Rate disabled defaultValue={rating} />
        },
        {
            title: 'Review',
            dataIndex: 'reviewText',
            key: 'review'
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString()
        }
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Engineer Reviews Summary</h2>
            <Table
                loading={loading}
                columns={summaryColumns}
                dataSource={Object.values(groupedReviews)}
                rowKey={(record) => record.user?._id}
                pagination={{ pageSize: 10 }}
                defaultSortOrder="descend"
            />

            <Modal
                title={`Reviews for ${selectedUserReviews?.user?.F_name} ${selectedUserReviews?.user?.L_name}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                width={1000}
                footer={null}
            >
                <Table
                    columns={detailColumns}
                    dataSource={selectedUserReviews?.reviews}
                    rowKey="_id"
                />
            </Modal>
        </div>
    );
};

export default Reviews;
