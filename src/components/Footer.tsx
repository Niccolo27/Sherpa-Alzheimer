import React from 'react';
import { SupportedLang } from '../pages/chatbot';

interface FooterProps {
  lang: SupportedLang;
}

export const Footer = ({ lang }: FooterProps) => {
  const footerLabels = {
    it: { 
      rights: "Tutti i diritti riservati", 
      mission: "Rendiamo il supporto per l'Alzheimer accessibile a tutti." 
    },
    en: { 
      rights: "All rights reserved", 
      mission: "Making Alzheimer's support accessible for everyone." 
    },
    es: { 
      rights: "Todos los derechos reservados", 
      mission: "Haciendo que el apoyo para el Alzheimer sea accesible para todos." 
    }
  };

  // BULLETPROOF FALLBACK:
  // If 'lang' is undefined or not in the object, it defaults to 'en'
  const currentLabels = footerLabels[lang] || footerLabels['en'];

  return (
    <footer className="bg-brand-text text-white py-12 mt-10">
      <div className="container mx-auto px-4 text-center">
        <div className="text-xl font-bold mb-2">Sherpa Alzheimer Project</div>
        <p className="text-gray-400 mb-6">{currentLabels.mission}</p>
        <div className="text-sm text-gray-500 pt-6 border-t border-gray-800">
          © 2026 {currentLabels.rights}
        </div>
      </div>
    </footer>
  );
};