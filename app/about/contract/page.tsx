"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // Assuming you have an auth context

interface Contract {
    _id: string;
    title: string;
    landArea: number;
    buildingType: string;
    budget: number;
    timeline: string;
    termsConditions: string;
    status: string;
    clientSignature?: string;
    engineerSignature?: string;
    projectId: string;
    engineerId: string;
    userId: string;
}

export default function ContractsPage() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [newContract, setNewContract] = useState({
        projectId: "",
        engineerId: "",
        title: "",
        landArea: "",
        buildingType: "",
        budget: "",
        timeline: "",
        termsConditions: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { user } = useAuth(); // Get user from auth context

    useEffect(() => {
        if (user) {
            fetchContracts();
        }
    }, [user]);

    const fetchContracts = async () => {
        try {
            const res = await axios.get("/api/contracts", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setContracts(res.data);
        } catch (error) {
            console.error("Error fetching contracts", error);
        }
    };

    const handleSearch = async () => {
        try {
            const res = await axios.get(`/api/contracts/search?query=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setContracts(res.data);
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    const handleCreateContract = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/contracts", newContract, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setContracts([...contracts, res.data]);
            // Reset form
            setNewContract({
                projectId: "",
                engineerId: "",
                title: "",
                landArea: "",
                buildingType: "",
                budget: "",
                timeline: "",
                termsConditions: ""
            });
        } catch (error) {
            console.error("Contract creation failed", error);
        }
    };

    const handleDeleteContract = async (id: string) => {
        try {
            await axios.delete(`/api/contracts/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setContracts(contracts.filter((c) => c._id !== id));
        } catch (error) {
            console.error("Error deleting contract", error);
        }
    };

    const handleSignContract = async (id: string) => {
        if (!selectedFile) {
            alert("Please select a signature file");
            return;
        }

        const formData = new FormData();
        formData.append("signature", selectedFile);
        
        try {
            await axios.post(`/api/contracts/${id}/sign`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "multipart/form-data",
                }
            });
            fetchContracts();
            setSelectedFile(null);
        } catch (error) {
            console.error("Error signing contract", error);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Contracts Management</h1>
            
            {/* Search Section */}
            <div className="flex gap-2 my-4">
                <input 
                    type="text" 
                    placeholder="Search by title, status, or building type..." 
                    className="border p-2 rounded w-full"
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
            
            {/* Create Contract Form */}
            <form onSubmit={handleCreateContract} className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Create New Contract</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Project ID"
                        className="border p-2 rounded"
                        value={newContract.projectId}
                        onChange={(e) => setNewContract({ ...newContract, projectId: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Engineer ID"
                        className="border p-2 rounded"
                        value={newContract.engineerId}
                        onChange={(e) => setNewContract({ ...newContract, engineerId: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Title"
                        className="border p-2 rounded"
                        value={newContract.title}
                        onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Land Area (sq ft)"
                        className="border p-2 rounded"
                        value={newContract.landArea}
                        onChange={(e) => setNewContract({ ...newContract, landArea: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Building Type"
                        className="border p-2 rounded"
                        value={newContract.buildingType}
                        onChange={(e) => setNewContract({ ...newContract, buildingType: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Budget"
                        className="border p-2 rounded"
                        value={newContract.budget}
                        onChange={(e) => setNewContract({ ...newContract, budget: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Timeline"
                        className="border p-2 rounded"
                        value={newContract.timeline}
                        onChange={(e) => setNewContract({ ...newContract, timeline: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Terms & Conditions"
                        className="border p-2 rounded col-span-2"
                        value={newContract.termsConditions}
                        onChange={(e) => setNewContract({ ...newContract, termsConditions: e.target.value })}
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                >
                    Create Contract
                </button>
            </form>
            
            {/* Contracts List */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">All Contracts</h2>
                <div className="space-y-4">
                    {contracts.map((contract) => (
                        <div key={contract._id} className="border p-4 rounded-lg bg-white shadow-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{contract.title}</h3>
                                    <p className="text-sm text-gray-600">Status: {contract.status}</p>
                                    <p className="text-sm text-gray-600">Building Type: {contract.buildingType}</p>
                                    <p className="text-sm text-gray-600">Land Area: {contract.landArea} sq ft</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Budget: ${contract.budget}</p>
                                    <p className="text-sm text-gray-600">Timeline: {contract.timeline}</p>
                                    <p className="text-sm text-gray-600">Project ID: {contract.projectId}</p>
                                </div>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                                {!contract.clientSignature || !contract.engineerSignature ? (
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            className="border p-2 rounded flex-1"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            accept="image/*,.pdf"
                                        />
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            onClick={() => handleSignContract(contract._id)}
                                        >
                                            Sign Contract
                                        </button>
                                    </div>
                                ) : null}
                                
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                                    onClick={() => handleDeleteContract(contract._id)}
                                >
                                    Delete Contract
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
