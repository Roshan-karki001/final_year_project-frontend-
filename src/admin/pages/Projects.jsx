import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input } from 'antd';
import axios from 'axios';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [form] = Form.useForm();
    const [selectedClientProjects, setSelectedClientProjects] = useState(null);
    const [isClientModalVisible, setIsClientModalVisible] = useState(false);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/projects', {
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

    const handleProjectAction = async (projectId, action) => {
        try {
            if (action === 'view') {
                const response = await axios.get(`http://localhost:5000/api/admin/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSelectedProject(response.data.project);
                setViewModalVisible(true);
            } else if (action === 'edit') {
                const response = await axios.get(`http://localhost:5000/api/admin/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSelectedProject(response.data.project);
                form.setFieldsValue(response.data.project);
                setEditModalVisible(true);
            } else if (action === 'delete') {
                Modal.confirm({
                    title: 'Are you sure you want to delete this project?',
                    content: 'This action cannot be undone.',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: async () => {
                        await axios.delete(`http://localhost:5000/api/admin/projects/delete/${projectId}`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        });
                        message.success('Project deleted successfully');
                        fetchProjects();
                    }
                });
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to perform action');
        }
    };

    const handleUpdate = async (values) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/projects/${selectedProject._id}`, values, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            message.success('Project updated successfully');
            setEditModalVisible(false);
            fetchProjects();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update project');
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Client',
            dataIndex: ['userId', 'F_name'],  // Changed from client to userId
            key: 'client',
            render: (_, record) => record.userId ? `${record.userId.F_name} ${record.userId.L_name}` : 'No Client'
        },
        {
            title: 'Engineer',
            dataIndex: ['assignedTo', 'F_name'],  // Changed from engineer to assignedTo
            key: 'engineer',
            render: (_, record) => record.assignedTo ? `${record.assignedTo.F_name} ${record.assignedTo.L_name}` : 'Not Assigned'
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
                    <Button type="primary" onClick={() => handleProjectAction(record._id, 'edit')}>
                        Edit
                    </Button>
                    <Button type="danger" onClick={() => handleProjectAction(record._id, 'delete')}>
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    // Group projects by client
    const groupedProjects = projects.reduce((acc, project) => {
        const clientId = project.userId?._id;
        if (!acc[clientId]) {
            acc[clientId] = {
                client: project.userId,
                projects: []
            };
        }
        acc[clientId].projects.push(project);
        return acc;
    }, {});

    const summaryColumns = [
        {
            title: 'Client',
            key: 'client',
            render: (_, record) => record.client ? `${record.client.F_name} ${record.client.L_name}` : 'N/A',
            filterSearch: true,
            filters: [...new Set(projects.map(project => project.userId))].map(user => ({
                text: user ? `${user.F_name} ${user.L_name}` : 'N/A',
                value: user?._id
            })),
            onFilter: (value, record) => record.client?._id === value
        },
        {
            title: 'Email',
            key: 'email',
            render: (_, record) => record.client?.G_mail || 'N/A'
        },
        {
            title: 'Total Projects',
            key: 'totalProjects',
            render: (_, record) => record.projects.length,
            sorter: (a, b) => a.projects.length - b.projects.length
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    type="primary"
                    onClick={() => {
                        setSelectedClientProjects({
                            client: record.client,
                            projects: record.projects
                        });
                        setIsClientModalVisible(true);
                    }}
                >
                    View All Projects
                </Button>
            )
        }
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Client Projects Summary</h2>
            <Table
                loading={loading}
                columns={summaryColumns}
                dataSource={Object.values(groupedProjects)}
                rowKey={(record) => record.client?._id}
                pagination={{ pageSize: 10 }}
            />

            {/* Client Projects Modal */}
            <Modal
                title={`Projects for ${selectedClientProjects?.client?.F_name} ${selectedClientProjects?.client?.L_name}`}
                open={isClientModalVisible}
                onCancel={() => setIsClientModalVisible(false)}
                width={1200}
                footer={null}
            >
                <Table
                    columns={columns} // Using existing detailed columns
                    dataSource={selectedClientProjects?.projects}
                    rowKey="_id"
                />
            </Modal>

            {/* Existing modals */}
            <Modal
                title="Project Details"
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={null}
            >
                {selectedProject && (
                    <div>
                        <p><strong>Title:</strong> {selectedProject.title}</p>
                        <p><strong>Land Area:</strong> {selectedProject.landArea}</p>
                        <p><strong>Building Type:</strong> {selectedProject.buildingType}</p>
                        <p><strong>Budget:</strong> {selectedProject.budget}</p>
                        <p><strong>Timeline:</strong> {selectedProject.timeline}</p>
                    </div>
                )}
            </Modal>

            <Modal
                title="Edit Project"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleUpdate}
                    layout="vertical"
                >
                    <Form.Item name="title" label="Title">
                        <Input />
                    </Form.Item>
                    <Form.Item name="landArea" label="Land Area">
                        <Input />
                    </Form.Item>
                    <Form.Item name="buildingType" label="Building Type">
                        <Input />
                    </Form.Item>
                    <Form.Item name="budget" label="Budget">
                        <Input />
                    </Form.Item>
                    <Form.Item name="timeline" label="Timeline">
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Project
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Projects;