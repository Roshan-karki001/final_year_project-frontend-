import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';
import axios from 'axios';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/admin/projects', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProjects(response.data.projects);
        } catch (error) {
            message.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Client',
            dataIndex: ['client', 'F_name'],
            key: 'client',
            render: (_, record) => `${record.client?.F_name} ${record.client?.L_name}`
        },
        {
            title: 'Engineer',
            dataIndex: ['engineer', 'F_name'],
            key: 'engineer',
            render: (_, record) => record.engineer ? `${record.engineer.F_name} ${record.engineer.L_name}` : 'Not Assigned'
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
                    <Button onClick={() => handleProjectAction(record._id, 'view')}>
                        View
                    </Button>
                    <Button type="danger" onClick={() => handleProjectAction(record._id, 'delete')}>
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    const handleProjectAction = async (projectId, action) => {
        try {
            if (action === 'delete') {
                await axios.delete(`/api/admin/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                message.success('Project deleted successfully');
                fetchProjects();
            }
        } catch (error) {
            message.error('Failed to perform action');
        }
    };

    return (
        <div>
            <h2>Project Management</h2>
            <Table
                loading={loading}
                columns={columns}
                dataSource={projects}
                rowKey="_id"
            />
        </div>
    );
};

export default Projects;