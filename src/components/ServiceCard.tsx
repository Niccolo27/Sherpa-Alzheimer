import React from 'react';

interface CardProps {
  title: string;
  description: string;
  icon: string; 
}


export const ServiceCard = ({ title, description, icon }: CardProps) => {
  return (
    <div className="bg-white border-4 border-brand-secondary p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-primary transition-all group">
      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-brand-text mb-4">
        {title}
      </h3>
      <p className="text-lg text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};