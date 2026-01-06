import React, { useState } from 'react';

export default function PaniaWisdomLeftEdge() {
  const [selectedPassage, setSelectedPassage] = useState(null);
  
  const traditions = {
    stoicism: { 
      color: '#5B7C8D', 
      light: '#EEF3F5',
      name: 'Stoicism'
    },
    christianity: { 
      color: '#8B5A5A', 
      light: '#F5EFEF',
      name: 'Christianity'
    },
    buddhism: { 
      color: '#B8860B', 
      light: '#F9F5EB',
      name: 'Buddhism'
    },
    sufism: { 
      color: '#8B6B8B', 
      light: '#F5EFF5',
      name: 'Sufism'
    },
  };

  const passages = [
    {
      id: 1,
      tradition: 'stoicism',
      thinker: 'Marcus Aurelius',
      role: 'Stoic philosopher',
      text: '"It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own."',
    },
    {
      id: 2,
      tradition: 'christianity',
      thinker: 'Paul the Apostle',
      role: 'Christian scripture',
      text: '"Am I now trying to win the approval of human beings, or of God?"',
      source: '— Galatians 1:10'
    },
    {
      id: 3,
      tradition: 'sufism',
      thinker: 'Rumi',
      role: 'Sufi poet',
      text: '"Why do you stay in prison when the door is so wide open?"',
    },
    {
      id: 4,
      tradition: 'buddhism',
      thinker: 'Thich Nhat Hanh',
      role: 'Buddhist teacher',
      text: '"Letting go gives us freedom, and freedom is the only condition for happiness."',
    },
  ];

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
        <div className="px-6 pt-8 pb-6">
          
          {/* Header */}
          <p 
            className="text-lg mb-6"
            style={{ fontFamily: 'Georgia, serif', color: '#5C554C' }}
          >
            Some voices on this:
          </p>
          
          {/* Passage cards */}
          <div className="space-y-4">
            {passages.map((passage) => {
              const tradition = traditions[passage.tradition];
              const isSelected = selectedPassage === passage.id;
              
              return (
                <button
                  key={passage.id}
                  onClick={() => setSelectedPassage(isSelected ? null : passage.id)}
                  className="w-full text-left rounded-2xl transition-all overflow-hidden flex"
                  style={{
                    backgroundColor: isSelected ? tradition.light : '#FFFDFA',
                    border: `1.5px solid ${isSelected ? tradition.color : '#E6DFD7'}`,
                  }}
                >
                  {/* Left edge color bar */}
                  <div 
                    className="w-1.5 flex-shrink-0"
                    style={{ backgroundColor: tradition.color }}
                  />
                  
                  <div className="p-4">
                    {/* Thinker name and role */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span 
                        className="font-semibold text-sm tracking-wide"
                        style={{ 
                          fontFamily: 'system-ui, sans-serif',
                          color: tradition.color
                        }}
                      >
                        {passage.thinker.toUpperCase()}
                      </span>
                      <span 
                        className="text-xs"
                        style={{ fontFamily: 'system-ui, sans-serif', color: '#A9A299' }}
                      >
                        {passage.role}
                      </span>
                    </div>
                    
                    {/* Quote */}
                    <p 
                      className="leading-relaxed"
                      style={{ 
                        fontFamily: 'Georgia, serif',
                        fontSize: '15px',
                        color: '#3D3730'
                      }}
                    >
                      {passage.text}
                    </p>
                    
                    {passage.source && (
                      <p 
                        className="text-xs mt-2"
                        style={{ fontFamily: 'system-ui, sans-serif', color: '#A9A299' }}
                      >
                        {passage.source}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Prompt */}
          <p 
            className="text-center mt-6 text-sm"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#9A948C' }}
          >
            Which of these lands for you today?
          </p>
          
        </div>
        
        {/* Continue button - appears when selected */}
        {selectedPassage && (
          <div className="px-6 pb-6">
            <button 
              className="w-full py-4 rounded-full text-white font-medium transition-colors"
              style={{ 
                fontFamily: 'system-ui, sans-serif',
                backgroundColor: traditions[passages.find(p => p.id === selectedPassage).tradition].color
              }}
            >
              Explore this wisdom
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}
