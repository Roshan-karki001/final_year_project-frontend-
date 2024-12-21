import React from "react";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-50">
        <div>
          <h1 className="text-4xl font-bold mb-4">Signup</h1>
          <p className="text-gray-600 mb-8">
            Lorem ipsum dolor sit amet consectetur. Integer sed diam eget erat orci nulla ultrices.
          </p>
          {/* Google Signup Button */}
          <button className="flex items-center justify-center w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 rounded-md mb-6">
            <img
              src="https://th.bing.com/th/id/OIP.2CowSQvmXAXWvkejZOvOTAHaEK?rs=1&pid=ImgDetMain"
              alt="Google Icon"
              className="w-5 h-5 mr-3"
            />
            Signup with Google
          </button>
          <div className="text-center text-gray-400 mb-6">or continue with email</div>
          {/* Signup Form */}
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters.</p>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
            >
              Create account
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <img
          src="https://th.bing.com/th/id/OIP.2CowSQvmXAXWvkejZOvOTAHaEK?rs=1&pid=ImgDetMain" // Replace with your image URL
          alt="Signup Illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute text-white text-center px-8">
          <h2 className="text-2xl font-bold">foundingpals</h2>
          <p className="mt-4 text-lg">
            Find the startup partner you’ve been searching for
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
