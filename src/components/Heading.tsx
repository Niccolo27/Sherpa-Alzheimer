import React from 'react';

export const Heading = ({ title, level = 1 }: { title: string, level?: 1 | 2 | 3 }) => {
  const baseStyle = "font-black text-gray-900 leading-tight mb-4 block";
  
  if (level === 1) return <h1 className={`text-4xl md:text-6xl ${baseStyle}`}>{title}</h1>;
  if (level === 2) return <h2 className={`text-3xl md:text-4xl ${baseStyle}`}>{title}</h2>;
  return <h3 className="text-2xl font-bold mb-2">{title}</h3>;
};