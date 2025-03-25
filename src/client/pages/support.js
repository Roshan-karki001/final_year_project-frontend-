import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, HelpCircle } from 'lucide-react';

const Support = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle support message submission
    console.log('Support message:', message);
    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Support Center</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-purple-600 mr-3" />
                <span>support@engibridge.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-purple-600 mr-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-purple-600 mr-3" />
                <span>Live Chat (9 AM - 6 PM)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">FAQ</h3>
            <div className="space-y-4">
              <div className="cursor-pointer">
                <div className="flex items-center">
                  <HelpCircle className="w-5 h-5 text-purple-600 mr-3" />
                  <span>How do I update my profile?</span>
                </div>
              </div>
              <div className="cursor-pointer">
                <div className="flex items-center">
                  <HelpCircle className="w-5 h-5 text-purple-600 mr-3" />
                  <span>How to apply for projects?</span>
                </div>
              </div>
              <div className="cursor-pointer">
                <div className="flex items-center">
                  <HelpCircle className="w-5 h-5 text-purple-600 mr-3" />
                  <span>Payment and withdrawal process</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="6"
                className="w-full p-2 border rounded-md"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;