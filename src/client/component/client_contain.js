import React from 'react';

const ClientContainer = () => {
  const ideas = [
    {
      title: 'AI-based video recruitment and assessment tool',
      description: 'Increasing recruitment efficiency with advanced tools to resolve hiring challenges',
      equity: '25%',
    },
    {
      title: 'AI-based video recruitment and assessment tool',
      description: 'Increasing recruitment efficiency with advanced tools to resolve hiring challenges',
      equity: '20%',
    },
  ];

  const contracts = [
    {
      title: 'Project AI designer contract',
      author: 'DaiBui',
      image: '/contract-placeholder.jpg',
    },
    {
      title: 'Project AI designer contract',
      author: 'DaiBui',
      image: '/contract-placeholder.jpg',
    },
  ];

  const pals = [
    {
      name: 'Marco Kelly',
      role: 'Social Media Manager - Driving engagement across social platforms',
      image: '/profile1.jpg',
      online: true,
    },
    {
      name: 'Olly Schroeder',
      role: 'DevOps Engineer - Streamlining software deployment and operations',
      image: '/profile2.jpg',
      online: true,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Ideas Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your ideas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ideas.map((idea, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-2">{idea.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{idea.description}</p>
              <div className="flex justify-between items-center">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {idea.equity} equity
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contracts Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your contract</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((contract, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <img
                src={contract.image}
                alt="Contract"
                className="w-full h-32 object-cover mb-4 rounded"
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <span className="text-sm">{contract.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pals Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your pals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pals.map((pal, index) => (
            <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
              <div className="relative">
                <img
                  src={pal.image}
                  alt={pal.name}
                  className="w-12 h-12 rounded-full"
                />
                {pal.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{pal.name}</h3>
                <p className="text-sm text-gray-600">{pal.role}</p>
              </div>
              <button className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200">
                Message
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClientContainer;
