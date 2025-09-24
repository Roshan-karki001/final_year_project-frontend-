import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    // Remove unused state
    // const [selectedRole, setSelectedRole] = useState('all');

    const fetchUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Ensure blockuser is properly initialized
            const usersData = (response.data.users || []).map(user => ({
                ...user,
                blockuser: Boolean(user.blockuser) // Force boolean conversion
            }));
            
            setUsers([...usersData]);
        } catch (error) {
            message.error('Failed to fetch users: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleBlockStatusChange = async (userId, currentStatus) => {
        try {
            await axios.post(`${API_BASE_URL}/api/admin/block_unblock_user/${userId}`, 
                null,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
            );
            
            // Force immediate UI update
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user._id === userId 
                        ? { ...user, blockuser: !Boolean(currentStatus) } 
                        : user
                )
            );
            
            // Then fetch fresh data
            const updatedResponse = await axios.get(`${API_BASE_URL}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setUsers(updatedResponse.data.users || []);
            
        } catch (error) {
            message.error('Failed to update user status: ' + (error.response?.data?.message || error.message));
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: ['F_name', 'L_name'],
            key: 'name',
            render: (_, record) => `${record.F_name} ${record.L_name}`,
            filterSearch: true,
            filters: [...new Set(users.map(user => `${user.F_name} ${user.L_name}`))].map(name => ({
                text: name,
                value: name
            })),
            onFilter: (value, record) => `${record.F_name} ${record.L_name}` === value
        },
        {
            title: 'Email',
            dataIndex: 'G_mail',
            key: 'email',
            filterSearch: true,
            filters: [...new Set(users.map(user => user.G_mail))].map(email => ({
                text: email,
                value: email
            })),
            onFilter: (value, record) => record.G_mail === value
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
                { text: 'Client', value: 'client' },
                { text: 'Engineer', value: 'engineer' }
            ],
            onFilter: (value, record) => record.role.toLowerCase() === value
        },
        {
            title: 'Status',
            dataIndex: 'blockuser',
            key: 'status',
            render: (blockuser) => blockuser === undefined ? 'Active' : (blockuser ? 'Inactive' : 'Active')
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space key={`actions-${record._id}`}>
                    <Button
                        type="primary"
                        onClick={() => {
                            const userId = record._id || record.id;
                            if (userId) {
                                navigate(`/admin/view-profile/${userId}`);
                            } else {
                                message.error('User ID not found in record');
                                console.log('Full record structure:', record);
                            }
                        }}
                    >
                        View Profile
                    </Button>
                    <Button
                        type={record.blockuser ? "danger" : "primary"}
                        style={record.blockuser
                            ? { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }
                            : { backgroundColor: '#52c41a', borderColor: '#52c41a' }
                        }
                        onClick={() => {
                            console.log('Current blockuser status:', record.blockuser);
                            
                            const confirmMessage = record.blockuser
                                ? 'Are you sure you want to unblock this user?'
                                : 'Are you sure you want to block this user?';

                            if (window.confirm(confirmMessage)) {
                                handleBlockStatusChange(record._id || record.id, record.blockuser);
                            }
                        }}
                    >
                        {record.blockuser ? 'Unblock' : 'Block'}
                    </Button>
                </Space>
            )
        }
    ];

    // Remove unused filteredUsers constant
    // const filteredUsers = users.filter(user => {
    //     if (selectedRole === 'all') return true;
    //     return user.role.toLowerCase() === selectedRole.toLowerCase();
    // });

    return (
        <div>
            <h2>User Management</h2>
            <Table
                loading={loading}
                columns={columns}
                dataSource={users}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default Users;
