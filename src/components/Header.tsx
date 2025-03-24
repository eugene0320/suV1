
import React from 'react';
import { Mic } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-4 mb-6 border-b bg-white shadow-sm">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 rounded-full p-1.5">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SpeakUp</h1>
            <p className="text-sm text-gray-600">AI-powered business communication practice</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 hidden md:block">
          Master negotiation skills through realistic roleplay
        </div>
      </div>
    </header>
  );
};

export default Header;
