import React, { useState } from 'react';

export default function PaniaOpeningBalanced() {
  const [text, setText] = useState('');
  
  const prompts = [
    "Something happened today...",
    "I'm struggling with...",
    "I'm grateful for...",
    "I need perspective on..."
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F3EDE7' }}>
      {/* Phone frame */}
      <div className="w-full max-w-sm rounded-3xl shadow-xl overflow-hidden border" style={{ backgroundColor: '#FAF7F3', borderColor: '#E6DFD7' }}>
        
        {/* Status bar */}
        <div className="px-6 pt-3 pb-2 flex justify-between items-center text-xs" style={{ color: '#9A948C' }}>
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-2 border rounded-sm" style={{ borderColor: '#9A948C' }}>
              <div className="w-3 h-1.5 rounded-sm m-px" style={{ backgroundColor: '#9A948C' }}></div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-8 pt-12 pb-8">
          
          {/* Greeting */}
          <h1 
            className="text-3xl mb-2"
            style={{ fontFamily: 'Georgia, serif', color: '#3D3730' }}
          >
            {getGreeting()}, David.
          </h1>
          
          <p 
            className="text-xl mb-8"
            style={{ fontFamily: 'Georgia, serif', color: '#5C554C' }}
          >
            What's on your mind?
          </p>
          
          {/* Text area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing..."
            className="w-full h-32 p-4 rounded-2xl resize-none focus:outline-none transition-colors"
            style={{ 
              fontFamily: 'system-ui, sans-serif', 
              fontSize: '16px',
              backgroundColor: '#FFFDFA',
              border: '1.5px solid #E6DFD7',
              color: '#3D3730',
            }}
          />
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E0D9D0' }}></div>
            <span className="text-sm" style={{ fontFamily: 'system-ui, sans-serif', color: '#A9A299' }}>
              or choose a prompt
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E0D9D0' }}></div>
          </div>
          
          {/* Prompt buttons */}
          <div className="space-y-3">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setText(prompt)}
                className="w-full text-left px-5 py-4 rounded-xl transition-all hover:scale-[1.01]"
                style={{ 
                  fontFamily: 'system-ui, sans-serif', 
                  fontSize: '15px',
                  backgroundColor: '#FFFDFA',
                  border: '1.5px solid #E6DFD7',
                  color: '#5C554C',
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
          
        </div>
        
        {/* Continue button - warm gray-brown */}
        <div className="px-8 pb-8">
          <button 
            className="w-full py-4 rounded-full font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ 
              fontFamily: 'system-ui, sans-serif',
              backgroundColor: '#6B635A',
              color: '#FAF7F3'
            }}
            disabled={!text.trim()}
          >
            Continue
          </button>
        </div>
        
      </div>
    </div>
  );
}
