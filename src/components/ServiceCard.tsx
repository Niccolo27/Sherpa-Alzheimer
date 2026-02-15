import React from 'react';

interface CardProps {
  title: string;
  description: string;
  icon: string;
}

export const ServiceCard = ({ title, description, icon }: CardProps) => {
  return (
    <div
      className="
        group relative
        flex flex-col items-center justify-start
        rounded-3xl
        bg-white/90 backdrop-blur-md
        px-8 py-10 md:px-10 md:py-12
        border border-indigo-100
        shadow-lg
        overflow-hidden
        transition-all duration-500
        hover:-translate-y-3 hover:shadow-2xl hover:border-emerald-300
      "
    >
      {/* Spotlight morbido in background che si muove */}
      <div
        className="
          pointer-events-none
          absolute -bottom-16 group-hover:-bottom-8
          left-1/2 -translate-x-1/2
          w-40 h-40
          rounded-full
          bg-emerald-200/40
          blur-3xl
          opacity-0 group-hover:opacity-100
          transition-all duration-700
        "
      />

      {/* Icona grande con movimento */}
      <div
        className="
          relative z-10
          flex items-center justify-center
          w-20 h-20 md:w-24 md:h-24
          rounded-3xl
          bg-gradient-to-br from-blue-500 to-emerald-400
          text-4xl md:text-5xl
          shadow-xl
          mb-6
          transition-transform duration-500
          group-hover:scale-110 group-hover:rotate-3
        "
      >
        {icon}
      </div>

      {/* Titolo */}
      <h3
        className="
          relative z-10
          text-2xl md:text-3xl font-bold
          text-gray-900 text-center
          mb-4
          transition-colors duration-300
          group-hover:text-emerald-800
        "
      >
        {title}
      </h3>

      {/* Descrizione */}
      <p
        className="
          relative z-10
          text-base md:text-lg
          text-gray-700 leading-relaxed text-center
          transition-all duration-300
          group-hover:text-gray-900 group-hover:translate-y-1
        "
      >
        {description}
      </p>
    </div>
  );
};
