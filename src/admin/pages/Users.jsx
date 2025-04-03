import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users/list', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUsers(response.data.users);
        } catch (error) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserAction = async (userId, action) => {
        try {
            await axios.post('/api/admin/users/manage', 
                { userId, action },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
            );
            message.success('User updated successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to update user');
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'F_name',
            key: 'name',
            render: (text, record) => `${record.F_name} ${record.L_name}`
        },
        {
            title: 'Email',
            dataIndex: 'G_mail',
            key: 'email'
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role'
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'status',
            render: (isActive) => isActive ? 'Active' : 'Inactive'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type={record.isActive ? 'danger' : 'primary'}
                        onClick={() => handleUserAction(record._id, record.isActive ? 'deactivate' : 'activate')}
                    >
                        {record.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                        onClick={() => handleUserAction(record._id, 'changeRole')}
                    >
                        Change Role
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <h2>User Management</h2>
            <Table
                loading={loading}
                columns={columns}
                dataSource={users}
                rowKey="_id"
            />
        </div>
    );
};

export default Users;