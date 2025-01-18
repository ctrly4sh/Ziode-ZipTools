import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FeatureRequestProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeatureRequest({ isOpen, onClose }: FeatureRequestProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    email: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement feature request submission
    console.log('Feature request:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Request a Feature</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Feature Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-md hover:from-fuchsia-600 hover:to-pink-600 transition-colors"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}