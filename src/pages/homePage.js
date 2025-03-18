import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MessageCircle,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="absolute w-full z-50">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-20">
          <a href="/" className="text-2xl font-semibold text-white flex items-center">
          <h1 className="text-purple-700 text-2xl font-bold mb-8">EngiBridge</h1>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'How it Works', 'Testimonials', 'Contact'].map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} 
                 className="text-white hover:text-white/80 transition-colors">
                {link}
              </a>
            ))}
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-black bg-white rounded-md hover:bg-white/90"
            >
              Get Started
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="absolute top-20 right-0 w-64 bg-white shadow-lg p-4">
                <div className="flex flex-col space-y-4">
                  {['Features', 'How it Works', 'Testimonials', 'Contact'].map((link) => (
                    <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} 
                       className="text-gray-800 hover:text-gray-600">
                      {link}
                    </a>
                  ))}
                  <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1470&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 container mx-auto px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
            Connecting Clients with Professional Civil Engineers
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            The one-stop platform that simplifies finding and hiring the right civil engineering professionals for your construction projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center">
              Post a Project 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="px-6 py-3 text-white border border-white rounded-md hover:bg-white/10">
              Join as Engineer
            </button>
          </div>
        </div>
      </div>
      
      {/* Feature Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EngiBridge</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique features designed to make the process of connecting clients and civil engineers seamless and efficient.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-12 h-12 text-blue-500 mb-4" />,
                title: "Smart Matching",
                description: "Search for your project with the most suitable civil engineers based on expertise and requirements."
              },
              {
                icon: <MessageCircle className="w-12 h-12 text-blue-500 mb-4" />,
                title: "Real-time Messaging",
                description: "Communicate directly with engineers through our secure messaging system to discuss project details and expectations."
              },
              {
                icon: <CheckCircle2 className="w-12 h-12 text-blue-500 mb-4" />,
                title: "Secure Contracts",
                description: "Create and manage secure contracts that protect both parties throughout the project lifecycle."
              },
              {
                icon: <FileText className="w-12 h-12 text-blue-500 mb-4" />,
                title: "Quality Verification",
                description: "All engineers undergo a verification process to ensure they meet our quality and professional standards."
              },
              {
                icon: <Clock className="w-12 h-12 text-blue-500 mb-4" />,
                title: "Time-saving",
                description: "Streamlined process helps you find the right professional faster than traditional hiring methods."
              },
              
              // ... add other feature items
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How EngiBridge Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our simple four-step process makes finding and hiring the right civil engineer straightforward and efficient.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Create Your Account",
                description: "Sign up as a client or civil engineer with your professional information and preferences.",
                color: "bg-blue-500",
              },
              {
                number: "02",
                title: "Post or Browse Projects",
                description: "Clients can post project requirements while engineers can browse and apply for suitable opportunities.",
                color: "bg-blue-500",
              },
              {
                number: "03",
                title: "Connect and Discuss",
                description: "Use our secure messaging system to discuss project details and establish expectations.",
                color: "bg-blue-500",
              },
              {
                number: "04",
                title: "Secure Agreement",
                description: "Create a secure contract through our platform that protects both parties during the project.",
                color: "bg-blue-500",
              },

            ].map((step, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div className={`${step.color} text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 text-xl font-bold`}>
                  {step.number}
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-1 bg-gray-200">
                    <ArrowRight className="absolute right-0 -top-2 text-gray-300" />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="container mx-auto text-center px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What People Say About Us</h2>
          <p className="text-lg text-gray-600 mb-8">Client and engineer testimonials.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {["Sarah Johnson", "Michael Chen", "Priya Patel"].map((person, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">"Testimonial from {person}"</p>
                <h4 className="text-gray-900 font-semibold mt-4">{person}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8">Join EngiBridge today and experience a new way of connecting for construction and engineering projects.</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-md">Post a Project</button>
        </div>
      </section>

      {/* Footer with detailed sections */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            {/* Logo Section */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center justify-center md:justify-start">
                <span className="text-blue-400 mr-1">Engi</span>Bridge
              </h3>
              <p className="text-gray-400">
                Connecting clients with civil engineering professionals for successful project collaborations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center justify-center md:justify-start">
                  <MapPin className="w-5 h-5 mr-2" /> 123 Engineer Avenue, NY 10001
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <Phone className="w-5 h-5 mr-2" /> +1 (555) 123-4567
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <Mail className="w-5 h-5 mr-2" /> info@engibridge.com
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a href="#" className="hover:text-blue-400 transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EngiBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;