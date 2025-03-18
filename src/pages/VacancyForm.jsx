import React, { useState } from 'react';

const VacancyForm = () => {
  // State to store the form data
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    projectType: '',
    engineeringType: '',
    projectScope: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // You can add your form submission logic here (e.g., API call)
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Post a Vacancy for Engineer</h1>

      <form onSubmit={handleSubmit}>

        {/* Vacancy Details Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Vacancy Details</h2>

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

          <label className="block text-sm font-medium text-gray-700" htmlFor="projectScope">
            Project Scope
          </label>
          <textarea
            id="projectScope"
            name="projectScope"
            value={formData.projectScope}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Describe the scope of the project"
          ></textarea>

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

        {/* Legal Information Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Legal Information</h2>

          <p className="text-sm text-gray-600 mb-4">
            The engineer must assist in ensuring all necessary building permits are obtained and in compliance with local zoning laws. The contractor should also have professional liability insurance.
          </p>
        </section>

        {/* Building Terms Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Building Terms</h2>

          <label className="block text-sm font-medium text-gray-700" htmlFor="startDate">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />

          <label className="block text-sm font-medium text-gray-700" htmlFor="completionDate">
            Completion Date
          </label>
          <input
            type="date"
            id="completionDate"
            name="completionDate"
            value={formData.completionDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />

          <label className="block text-sm font-medium text-gray-700" htmlFor="budget">
            Budget
          </label>
          <input
            type="text"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter estimated budget range"
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

        {/* Client Contact Information */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contact Information</h2>

          <label className="block text-sm font-medium text-gray-700" htmlFor="clientName">
            Your Full Name
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />

          <label className="block text-sm font-medium text-gray-700" htmlFor="clientPhone">
            Your Phone Number
          </label>
          <input
            type="tel"
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />

          <label className="block text-sm font-medium text-gray-700" htmlFor="clientEmail">
            Your Email Address
          </label>
          <input
            type="email"
            id="clientEmail"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />

          <label className="block text-sm font-medium text-gray-700" htmlFor="preferredContact">
            Preferred Method of Contact
          </label>
          <select
            id="preferredContact"
            name="preferredContact"
            value={formData.preferredContact}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="">Select Preferred Contact</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </section>

        {/* Terms and Conditions */}
        <section className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label className="text-sm text-gray-600" htmlFor="termsAccepted">
              I have read and agree to the website’s terms and conditions.
            </label>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            disabled={!formData.termsAccepted}
          >
            Submit Vacancy
          </button>
        </div>
      </form>
    </div>
  );
};

export default VacancyForm;
