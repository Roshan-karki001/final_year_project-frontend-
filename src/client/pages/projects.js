const handleAcceptApplication = async (projectId, applicationId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `http://localhost:5000/api/projects/${projectId}/accept-application/${applicationId}`,
            {},
            {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            // Handle success (e.g., update UI, show message)
            alert('Application accepted successfully');
            // Refresh project list
            fetchProjects();
        }
    } catch (error) {
        console.error('Error accepting application:', error);
        alert('Failed to accept application. Please try again.');
    }
};