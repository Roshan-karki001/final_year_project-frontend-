import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../images/step1.png";
import image2 from "../images/step2.png";
import image3 from "../images/step3.png";

const HomePage = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleFAQ = (index) => {
    setActiveFAQ(index === activeFAQ ? null : index);
  };

  const faqs = [
    { question: "How does the platform work?", answer: "Users can post projects, browse engineers' profiles, and collaborate through project management tools." },
    { question: "Who can join?", answer: "Anyone looking for engineering services or engineers seeking projects can join the platform." },
    { question: "Is there a fee?", answer: "The platform charges a service fee for successful project completions, ensuring high-quality services." },
    { question: "How do I start?", answer: "Register, create a profile, and start collaborating by posting or applying for projects." },
  ];

  return (
    <div className="font-sans text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center py-6 px-10 bg-white shadow-md">
        <div className="text-3xl font-bold text-blue-700">EngiBridge</div>
        <nav className="space-x-6">
          <a href="#about" className="hover:text-blue-700">About</a>
          <a href="#projects" className="hover:text-blue-700">Projects</a>
          <a href="#contact" className="hover:text-blue-700">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-50 py-20 text-center">
        <h1 className="text-5xl font-bold">Connect. Collaborate. Create.</h1>
        <p className="mt-6 text-xl text-gray-600">Bridging the gap between users and engineers for seamless project collaboration.</p>
        <button 
          className="mt-8 px-8 py-4 bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-800"
          onClick={() => navigate('/signin')} // Navigate to SignIn page
        >
          Get Started
        </button>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-center text-4xl font-bold text-gray-800 mb-12">How It Works</h2>
          <p className="text-center text-gray-600 mb-16">Users post projects, engineers apply, and both collaborate seamlessly on terms of equity or compensation.</p>
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Step 1 */}
            <div className="text-center">
              <div className="p-4 bg-gray-100 rounded-lg shadow-lg mb-4">
                <img src={image1} alt="Step 1" className="w-55 h-55 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">01. Create Your Idea</h3>
              <p className="mt-4 text-gray-600">Describe your project idea, set terms, and define the type of engineer or collaborator you’re looking for.</p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="p-4 bg-gray-100 rounded-lg shadow-lg mb-4">
                <img src={image2} alt="Step 2" className="w-55 h-55 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">02. Connect with Engineers</h3>
              <p className="mt-4 text-gray-600">Browse profiles, review applications, and engage with engineers to find the best match for your project.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="p-4 bg-gray-100 rounded-lg shadow-lg mb-4">
                <img src={image3} alt="Step 3" className="w-55 h-55 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">03. Secure the Partnership</h3>
              <p className="mt-4 text-gray-600">Draft and sign agreements. Begin collaborating and bring your vision to life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="bg-gray-100 py-20 text-center">
        <h2 className="text-4xl font-bold">Featured Projects</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Mobile App Development</h3>
            <p className="mt-4 text-gray-600">A fintech app for secure money transfers with real-time currency updates.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Web Development</h3>
            <p className="mt-4 text-gray-600">An e-commerce platform with integrated payment gateways and analytics tools.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Machine Learning Model</h3>
            <p className="mt-4 text-gray-600">A predictive AI model for marketing campaigns and customer behavior analysis.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-10 text-center">
        <h2 className="text-4xl font-bold">What Our Clients Say</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="italic">“EngiBridge helped us connect with top engineers to complete our project ahead of schedule.”</p>
            <h4 className="mt-4 font-bold">- Sarah Anderson</h4>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="italic">“This platform is the reason we scaled so fast. Fantastic engineer pool!”</p>
            <h4 className="mt-4 font-bold">- James Carter</h4>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="italic">“Simple and effective. A true bridge between clients and engineers.”</p>
            <h4 className="mt-4 font-bold">- Nina Taylor</h4>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-10">
        <h2 className="text-4xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto mt-10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`p-6 border-b ${index === activeFAQ ? "bg-blue-50" : ""} cursor-pointer`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <span className="text-xl font-bold">{index === activeFAQ ? "-" : "+"}</span>
              </div>
              {index === activeFAQ && <p className="mt-2">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-8 grid grid-cols-2 md:grid-cols-3 gap-100">
          <div>
            <h4 className="font-bold text-lg">About EngiBridge</h4>
            <p className="mt-4 text-gray-200">Connecting users and engineers for seamless project collaboration.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#projects" className="hover:underline">Projects</a></li>
              <li><a href="#about" className="hover:underline">About Us</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg">Contact</h4>
            <p className="mt-4 text-gray-200">Email: info@engibridge.com</p>
            <p className="mt-2 text-gray-200">Phone: +123 456 789</p>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-300">&copy; 2024 EngiBridge. All Rights Reserved.</div>
      </footer>
    </div>
  );
};

export default HomePage;
