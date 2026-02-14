import React from 'react';
import { SupportedLang } from '../pages/chatbot';

interface HeaderProps {
  lang: SupportedLang;
}

export const Header = ({ lang }: HeaderProps) => {
  const navLabels = {
    it: { home: "Home", about: "Chi Siamo", contact: "Contatti" },
    en: { home: "Home", about: "About Us", contact: "Contact" },
    es: { home: "Inicio", about: "Nosotros", contact: "Contacto" }
  };

  const currentLabels = navLabels[lang] || navLabels['it'];

  return (
    <header className="bg-white border-b-2 border-gray-100 py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-2xl font-black text-brand-primary">Sherpa Alzheimer</div>
        <nav className="flex gap-6 font-bold text-gray-600">
          <a href="/" className="hover:text-brand-primary transition-colors">{currentLabels.home}</a>
          <a href="#" className="hover:text-brand-primary transition-colors">{currentLabels.about}</a>
          <a href="#" className="hover:text-brand-primary transition-colors">{currentLabels.contact}</a>
        </nav>
      </div>
    </header>
  );
};