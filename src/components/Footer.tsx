import React from 'react';
import { Container } from './Container';
import { SupportedLang } from '../pages/chatbot';

interface FooterProps {
  lang: SupportedLang;
}

export const Footer = ({ lang }: FooterProps) => {
  const labels = {
    it: {
      mission: "Supporto calmo e accessibile per l'Alzheimer.",
      rights: "Tutti i diritti riservati.",
      legal: "Informazioni Legali"
    },
    en: {
      mission: "Calm and accessible support for Alzheimer's.",
      rights: "All rights reserved.",
      legal: "Legal Info"
    },
    es: {
      mission: "Soporte tranquilo y accesible para el Alzheimer.",
      rights: "Todos los derechos reservados.",
      legal: "Información Legal"
    }
  };

  const t = labels[lang] || labels['en'];

  return (
    <footer className="bg-white border-t border-indigo-50 py-12 mt-auto">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="max-w-xs">
            <div className="text-2xl font-black text-gray-900 mb-2">Sherpa</div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t.mission}
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-gray-400">
            <p>© 2026 Sherpa Alzheimer. {t.rights}</p>
            <p className="hover:text-blue-600 cursor-pointer transition">{t.legal}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};