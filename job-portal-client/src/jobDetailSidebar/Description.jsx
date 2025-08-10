import React from 'react';

const Description = ({ detail }) => {
  const desc = detail?.description;
  const isLoading = detail && Object.keys(detail).length === 0; // crude check

  // Split description into paragraphs if there are line breaks
  const paragraphs = typeof desc === 'string' ? desc.split(/\n+/).filter(Boolean) : [];

  return (
        <div className='w-full bg-[#fafafa] shadow p-6 space-y-4 rounded-lg h-full'>{" "}
      <h2 className='text-lg font-semibold'>Job Description</h2>
      {isLoading && (
        <p className='text-sm text-gray-500 animate-pulse'>Loading description...</p>
      )}
      {!isLoading && !desc && (
        <p className='text-sm text-gray-500'>No description provided.</p>
      )}
      {!isLoading && desc && (
        <div className='prose max-w-none text-sm leading-relaxed'>
          {paragraphs.length > 1 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>{desc}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Description;
