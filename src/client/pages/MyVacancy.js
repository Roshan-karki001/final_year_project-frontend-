import React, { useState } from 'react';
import axios from 'axios';

const MyVacancy = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    projectType: '',
    engineeringType: '',
    landArea: '',
    additionalRequirements: '',
    startDate: '',
    completionDate: '',
    budget: '',
    paymentSchedule: '',
    responsibilities: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    preferredContact: '',
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = () => {
    setFormData({ ...formData, termsAccepted: !formData.termsAccepted });
  };

  const handleNext = () => {
    // Validate required fields for each step
    if (currentStep === 1) {
      if (!formData.projectName || !formData.location || !formData.projectType || !formData.landArea) {
        alert('Please fill in all required fields in Step 1');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.timeline || !formData.budget || !formData.responsibilities) {
        alert('Please fill in all required fields in Step 2');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions to proceed');
      return;
    }

    try {
      // Map the form data to match the database schema
      const projectData = {
        title: formData.projectName,
        landArea: parseFloat(formData.landArea), // Convert to number as per schema
        buildingType: formData.projectType,
        budget: parseFloat(formData.budget), // Convert to number as per schema
        timeline: formData.timeline,
      };

      // Validate all required fields match schema requirements
      if (!projectData.title || !projectData.landArea || !projectData.buildingType || 
          !projectData.budget || !projectData.timeline) {
        alert('Please fill in all required project fields');
        return;
      }

      // Validate numeric fields
      if (isNaN(projectData.landArea) || isNaN(projectData.budget)) {
        alert('Land area and budget must be valid numbers');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to create a project');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/projects/create', projectData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Project created successfully!');
        setFormData({
          projectName: '',
          location: '',
          projectType: '',
          engineeringType: '',
          landArea: '',
          additionalRequirements: '',
          timeline: '',
          budget: '',
          paymentSchedule: '',
          responsibilities: '',
          clientName: '',
          clientPhone: '',
          clientEmail: '',
          preferredContact: '',
          termsAccepted: false,
        });
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error.response?.data?.error || 'Error creating project. Please try again.');
    }
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Create new idea</h1>
  
      <div className="flex gap-12">
        {/* Side Step Indicator */}
        <div className="w-64 shrink-0 pt-8 relative" style={{ zIndex: 1 }}>
          <div className="flex flex-col gap-12 sticky top-24">
            {/* Vertical line connecting steps */}
            <div className="absolute left-4 top-4 w-[2px] h-[calc(100%-32px)] bg-gray-200"></div>
            
            <div className={`flex items-center relative ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 border-2 rounded-full flex items-center justify-center mr-3 font-medium bg-white
                ${currentStep >= 1 ? 'border-purple-600' : 'border-gray-400'}`}>
                1
              </div>
              <span className="text-sm font-medium">Details</span>
            </div>
            <div className={`flex items-center relative ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 border-2 rounded-full flex items-center justify-center mr-3 font-medium bg-white
                ${currentStep >= 2 ? 'border-purple-600' : 'border-gray-400'}`}>
                2
              </div>
              <span className="text-sm font-medium">Project Infos</span>
            </div>
            <div className={`flex items-center relative ${currentStep === 3 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 border-2 rounded-full flex items-center justify-center mr-3 font-medium bg-white
                ${currentStep === 3 ? 'border-purple-600' : 'border-gray-400'}`}>
                3
              </div>
              <span className="text-sm font-medium">Contact Infos</span>
            </div>
          </div>
        </div>
  
        {/* Main Form Content */}
        <div className="flex-1 bg-white shadow-md rounded-md p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Details */}
            {currentStep === 1 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Step 1: Project Details</h2>
                {/* Project Details fields */}
                <label className="block text-sm font-medium text-gray-700" htmlFor="projectName">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
  
                <label className="block text-sm font-medium text-gray-700" htmlFor="location">
                  Project Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
  
                <label className="block text-sm font-medium text-gray-700" htmlFor="projectType">
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                >
                  <option value="">Select Project Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
  
                <label className="block text-sm font-medium text-gray-700" htmlFor="engineeringType">
                  Type of Engineer Required
                </label>
                <select
                  id="engineeringType"
                  name="engineeringType"
                  value={formData.engineeringType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                >
                  <option value="">Select Engineering Type</option>
                  
                  <option value="civil">Civil Engineer</option>
                  
                </select>
  
                
                <label className="block text-sm font-medium text-gray-700" htmlFor="landArea">
                  landArea(In Sqft)
                </label>
                <input
                  type="number"
                  id="landArea"
                  name="landArea"
                  min="0"
                  step="0.01"
                  value={formData.landArea}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Accurate land area details"
                />
  
                <label className="block text-sm font-medium text-gray-700" htmlFor="additionalRequirements">
                  Additional Requirements
                </label>
                <textarea
                  id="additionalRequirements"
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Any specific requirements or certifications?"
                ></textarea>
              </section>
            )}
  
            {/* Step 2: Legal Information */}
            {currentStep === 2 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Step 2: Project Infos</h2>
                {/* Collaboration Terms fields */}
                <label className="block text-sm font-medium text-gray-700" htmlFor="timeline">
                  Timeline
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                >
                  <option value="">Select estimated timeline</option>
                  <option value="1-3months">1-3 months</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="6-12months">6-12 months</option>
                  <option value="above12months">More than 12 months</option>
                </select>

                <label className="block text-sm font-medium text-gray-700" htmlFor="budget">
                  Budget
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Enter estimated budget in $"
                />

                <label className="block text-sm font-medium text-gray-700" htmlFor="paymentSchedule">
                  Payment Schedule
                </label>
                <input
                  type="text"
                  id="paymentSchedule"
                  name="paymentSchedule"
                  value={formData.paymentSchedule}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Enter payment terms or milestones"
                />

                <label className="block text-sm font-medium text-gray-700" htmlFor="responsibilities">
                  Responsibilities
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="List the engineer's responsibilities"
                ></textarea>
              </section>
            )}
  
            {/* Step 3: Contract Info */}
            {currentStep === 3 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Step 3: Contact Info</h2>
                
                <label className="block text-sm font-medium text-gray-700" htmlFor="clientName">
                  Full Name
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Enter your full name"
                />

                <label className="block text-sm font-medium text-gray-700" htmlFor="clientEmail">
                  Email Address
                </label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Enter your email address"
                />

                <label className="block text-sm font-medium text-gray-700" htmlFor="clientPhone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Enter your phone number"
                />

                <label className="block text-sm font-medium text-gray-700" htmlFor="preferredContact">
                  Preferred Contact Method
                </label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                >
                  <option value="">Select preferred contact method</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-purple-600 rounded border-gray-300"
                  />
                  <label className="ml-2 text-sm text-gray-700" htmlFor="termsAccepted">
                    I agree to the terms and conditions
                  </label>
                </div>
              </section>
            )}
  
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  ← Back
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.termsAccepted || !formData.clientName || !formData.clientEmail || !formData.clientPhone}
                  className={`ml-auto px-6 py-2 rounded-md ${
                    formData.termsAccepted && formData.clientName && formData.clientEmail && formData.clientPhone
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                >
                  Submit Project
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyVacancy;
