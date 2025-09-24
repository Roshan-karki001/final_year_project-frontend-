import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, message } from 'antd';
import {
    UserOutlined,
    ProjectOutlined,
    FileOutlined,
    StarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { Column, Pie, Line } from '@ant-design/plots';
import axios from 'axios';

// Add useNavigate import at the top
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // Add navigate hook near other hooks
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [usersRes, projectsRes, reviewsRes, contractsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/users', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                    axios.get('http://localhost:5000/api/admin/projects', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                    axios.get('http://localhost:5000/api/admin/reviews', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                    axios.get('http://localhost:5000/api/admin/contracts', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                ]);

                const users = usersRes.data.users || [];
                const projects = projectsRes.data.projects || [];
                const reviews = reviewsRes.data.reviews || [];
                const contracts = contractsRes.data.contracts || [];

                // In analyticsData, update the projects section
                const analyticsData = {
                    users: {
                        total: users.length,
                        clients: users.filter(u => u.role === 'client').length,
                        engineers: users.filter(u => u.role === 'engineer').length,
                        activeEngineers: users.filter(u => u.role === 'engineer' && !u.blockuser).length
                    },
                    projects: {
                        active: projects.filter(p => p.status === 'inProgress').length,
                        completed: projects.filter(p => p.status === 'completed').length,
                        active: projects.filter(p => p.status === 'active').length,
                        pending: projects.filter(p => p.status === 'pending').length,
                        total: projects.length
                    },
                    reviews: {
                        total: reviews.length,
                        pending: reviews.filter(r => r.status === 'pending').length,
                        averageRating: [{
                            avg: reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)
                        }]
                    },
                    contracts: {
                        total: contracts.length,
                        timeline: contracts.reduce((acc, contract) => {
                            const month = new Date(contract.createdAt).toLocaleString('default', { month: 'long' });
                            const existingMonth = acc.find(item => item.month === month);
                            if (existingMonth) {
                                existingMonth.count++;
                            } else {
                                acc.push({ month, count: 1 });
                            }
                            return acc;
                        }, [])
                    }
                };

                setAnalytics(analyticsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) return <Spin size="large" className="center-spinner" />;

    // User Role Distribution Chart
    const userRoleConfig = {
        data: [
            { type: 'Clients', value: analytics?.users?.clients || 0 },
            { type: 'Engineers', value: analytics?.users?.engineers || 0 }
        ],
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'spider',
            content: (data) => `${data.type}: ${data.value}`,
            style: {
                textAlign: 'center'
            }
        },
        legend: {
            position: 'bottom'
        }
    };

    // Project Status Chart
    // Update the Project Status Chart configuration
    const projectStatusConfig = {
        data: [
            { status: 'Completed', count: analytics?.projects?.completed || 0 },
            { status: 'Active', count: analytics?.projects?.active || 0 },
            { status: 'Pending', count: analytics?.projects?.pending || 0 }
        ],
        xField: 'status',
        yField: 'count',
        color: ['#52c41a', '#1890ff', '#faad14'],
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        }
    };

    // Contract Timeline Chart
    const contractTimelineConfig = {
        data: analytics?.contracts?.timeline || [],
        xField: 'month',
        yField: 'count',
        point: {
            size: 5,
            shape: 'diamond'
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col span={6}>
                    <Card hoverable onClick={() => navigate('/admin/users')}>
                        <Statistic
                            title="Total Users"
                            value={analytics?.users?.total || 0}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card hoverable onClick={() => navigate('/admin/projects')}>
                        <Statistic
                            title="Total Projects"
                            value={analytics?.projects?.total || 0}
                            prefix={<ProjectOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card hoverable onClick={() => navigate('/admin/contracts')}>
                        <Statistic
                            title="Total Contracts"
                            value={analytics?.contracts?.total || 0}
                            prefix={<FileOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card hoverable onClick={() => navigate('/admin/reviews')}>
                        <Statistic
                            title="Average Rating"
                            value={analytics?.reviews?.averageRating?.[0]?.avg?.toFixed(1) || 0}
                            prefix={<StarOutlined />}
                            suffix="/5"
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Row 1 */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col span={12}>
                    <Card title="User Distribution">
                        <Pie {...userRoleConfig} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Project Status">
                        <Column {...projectStatusConfig} />
                    </Card>
                </Col>
            </Row>

            {/* Charts Row 2 */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="Contract Timeline">
                        <Line {...contractTimelineConfig} />
                    </Card>
                </Col>
            </Row>

            {/* Additional Statistics */}
            <Row gutter={[16, 16]} className="mt-6">
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Completed Projects"
                            value={analytics?.projects?.completed || 0}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Pending Reviews"
                            value={analytics?.reviews?.pending || 0}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Active Engineers"
                            value={analytics?.users?.activeEngineers || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
