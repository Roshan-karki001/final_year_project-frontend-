import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Calendar, DollarSign, Home, Clock } from 'lucide-react';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';

const AdminProjectView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/admin/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success) {
                    setProject(response.data.project);
                    form.setFieldsValue({
                        title: response.data.project.title,
                        landArea: response.data.project.landArea,
                        buildingType: response.data.project.buildingType,
                        budget: response.data.project.budget,
                        timeline: response.data.project.timeline,
                        status: response.data.project.status
                    });
                }
            } catch (error) {
                message.error('Failed to fetch project details');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, form]);

    const handleUpdate = async (values) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/admin/projects/${id}`,
                values,
                { headers: { Authorization: `Bearer ${token}` }}
            );
            message.success('Project updated successfully');
            setIsEditing(false);
            // Refresh project data
            const response = await axios.get(`http://localhost:5000/api/admin/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProject(response.data.project);
        } catch (error) {
            message.error('Failed to update project');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {isEditing ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Edit Project</h2>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                        initialValues={project}
                    >
                        <Form.Item
                            name="title"
                            label="Project Title"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="buildingType"
                            label="Building Type"
                            rules={[{ required: true }]}
                        >
                            <Select>
                                <Select.Option value="residential">Residential</Select.Option>
                                <Select.Option value="commercial">Commercial</Select.Option>
                                <Select.Option value="industrial">Industrial</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="landArea"
                            label="Land Area (sq ft)"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="budget"
                            label="Budget ($)"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="timeline"
                            label="Timeline"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true }]}
                        >
                            <Select>
                                <Select.Option value="pending">Pending</Select.Option>
                                <Select.Option value="active">Active</Select.Option>
                                <Select.Option value="completed">Completed</Select.Option>
                            </Select>
                        </Form.Item>

                        <div className="flex gap-4">
                            <Button type="primary" htmlType="submit">
                                Save Changes
                            </Button>
                            <Button onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
                            <div className="flex gap-4">
                                <Button type="primary" onClick={() => setIsEditing(true)}>
                                    Edit Project
                                </Button>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold
                                    ${project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                                    'bg-blue-100 text-blue-800'}`}>
                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Home className="w-5 h-5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Building Type</p>
                                        <p className="font-medium">{project.buildingType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Land Area</p>
                                        <p className="font-medium">{project.landArea} sq ft</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="w-5 h-5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Budget</p>
                                        <p className="font-medium">${project.budget}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Timeline</p>
                                        <p className="font-medium">{project.timeline}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Created On</p>
                                        <p className="font-medium">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Client Information</h2>
                            <div className="space-y-4">
                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-800">
                                        {project.userId.F_name} {project.userId.L_name}
                                    </h3>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{project.userId.G_mail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminProjectView;