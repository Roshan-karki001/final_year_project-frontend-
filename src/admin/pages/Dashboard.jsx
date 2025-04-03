import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, ProjectOutlined, FileOutlined, StarOutlined } from '@ant-design/icons';
import axios from 'axios';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('/api/admin/analytics/system', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setAnalytics(response.data.analytics);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={analytics?.users?.total || 0}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Projects"
                            value={analytics?.projects?.active || 0}
                            prefix={<ProjectOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Contracts"
                            value={analytics?.contracts?.total || 0}
                            prefix={<FileOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Average Rating"
                            value={analytics?.reviews?.averageRating?.[0]?.avg?.toFixed(1) || 0}
                            prefix={<StarOutlined />}
                            suffix="/5"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;