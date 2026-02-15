import React from 'react';
import Link from 'next/link';

interface CardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export const FeatureCard = ({ title, description, icon, href, color }: CardProps) => {
  return (
    <Link href={href}>
      <div className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col items-start">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-500 font-medium leading-relaxed mb-6 flex-1">
          {description}
        </p>
        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-4 transition-all">
          SCOPRI DI PIÙ <span>→</span>
        </div>
      </div>
    </Link>
  );
};