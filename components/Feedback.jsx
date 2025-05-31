'use client';

import { useState } from 'react';

export default function Feedback({ pageId }) {
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isHelpful, setIsHelpful] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId,
          isHelpful,
          feedback,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (submitted) {
    return (
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700">Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">Was this helpful?</h3>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setIsHelpful(true)}
          className={`px-4 py-2 rounded-md ${
            isHelpful === true
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => setIsHelpful(false)}
          className={`px-4 py-2 rounded-md ${
            isHelpful === false
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          No
        </button>
      </div>
      {isHelpful !== null && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
              {isHelpful ? 'What did you like?' : 'How can we improve?'}
            </label>
            <textarea
              id="feedback"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
}
