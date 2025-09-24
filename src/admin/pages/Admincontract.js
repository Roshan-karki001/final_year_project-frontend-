import React, { useState, useEffect, useCallback } from 'react';
import { Table, message, Button, Modal, Space } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminContracts = () => {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClientContracts, setSelectedClientContracts] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchContracts = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/contracts', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setContracts(response.data.contracts);
        } catch (error) {
            message.error('Failed to fetch contracts');
        } finally {
            setLoading(false);
        }
    }, []);
    
    const handeldelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this contract?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const response = await axios.delete(`http://localhost:5000/api/contracts/${id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (response.data.success) {
                        message.success('Contract deleted successfully');
                        fetchContracts();
                    } else {
                        message.error('Failed to delete contract');
                    }
                } catch (error) {
                    message.error('Failed to delete contract');
                }
            }
        });
    };

    useEffect(() => {
        fetchContracts();
    }, [fetchContracts]);

    const columns = [
        {
            title: 'Client',
            dataIndex: ['userId'],
            key: 'client',
            render: (userId) => userId ? `${userId.F_name} ${userId.L_name}` : 'N/A',
            filterSearch: true,
            filters: [...new Set(contracts.map(contract => contract.userId))].map(user => ({
                text: user ? `${user.F_name} ${user.L_name}` : 'N/A',
                value: user?._id
            })),
            onFilter: (value, record) => record.userId?._id === value
        },
        {
            title: 'Total Contracts',
            key: 'totalContracts',
            render: (_, record) => contracts.filter(c => c.userId?._id === record.userId?._id).length,
            sorter: (a, b) => {
                const aCount = contracts.filter(c => c.userId?._id === a.userId?._id).length;
                const bCount = contracts.filter(c => c.userId?._id === b.userId?._id).length;
                return aCount - bCount;
            }
        },
        {
            title: 'Email',
            dataIndex: ['userId', 'G_mail'],
            key: 'email'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    type="primary"
                    onClick={() => {
                        const clientContracts = contracts.filter(c => 
                            c.userId?._id === record.userId?._id
                        );
                        setSelectedClientContracts({
                            client: record.userId,
                            contracts: clientContracts
                        });
                        setIsModalVisible(true);
                    }}
                >
                    View All Contracts
                </Button>
            )
        }
    ];

    const detailColumns = [
        {
            title: 'Project Title',
            dataIndex: ['projectId', 'title'],
            key: 'title'
        },
        {
            title: 'Engineer',
            dataIndex: ['engineerId'],
            key: 'engineer',
            render: (engineerId) => engineerId ? `${engineerId.F_name} ${engineerId.L_name}` : 'Not Assigned'
        },
        {
            title: 'Building Type',
            dataIndex: 'buildingType',
            key: 'buildingType'
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
            key: 'budget',
            render: (budget) => `NPR ${budget.toLocaleString()}`
        },
        {
            title: 'Timeline',
            dataIndex: 'timeline',
            key: 'timeline'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span style={{
                    color: status === 'done' ? 'green' : status === 'pending' ? 'orange' : 'black'
                }}>
                    {status.toUpperCase()}
                </span>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary"
                        size="small"
                        onClick={() => navigate(`/admin/contracts/view/${record._id}`)}
                    >
                        View Details
                    </Button>
                    <Button 
                        type="primary"
                        danger
                        size="small"
                        onClick={() => handeldelete(record._id)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    // Group contracts by client
    const groupedContracts = contracts.reduce((acc, contract) => {
        const clientId = contract.userId?._id;
        if (!acc[clientId]) {
            acc[clientId] = {
                userId: contract.userId,
                contracts: []
            };
        }
        acc[clientId].contracts.push(contract);
        return acc;
    }, {});

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Client Contracts Summary</h2>
            <Table
                loading={loading}
                columns={columns}
                dataSource={Object.values(groupedContracts)}
                rowKey={(record) => record.userId?._id}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={`Contracts for ${selectedClientContracts?.client?.F_name} ${selectedClientContracts?.client?.L_name}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                width={1200}
                footer={null}
            >
                <Table
                    columns={detailColumns}
                    dataSource={selectedClientContracts?.contracts}
                    rowKey="_id"
                />
            </Modal>
        </div>
    );
};

export default AdminContracts;
