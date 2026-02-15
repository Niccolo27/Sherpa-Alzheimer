import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { SupportedLang } from '../pages/chatbot';

interface HeaderProps {
  currentLang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
}

export const Header = ({ currentLang, setLang }: HeaderProps) => {
  const navLabels = {
    it: { home: 'Home', chat: 'Chatbot', contact: 'Contatti', telegram: 'Telegram' },
    en: { home: 'Home', chat: 'Chatbot', contact: 'Contact', telegram: 'Telegram' },
    es: { home: 'Inicio', chat: 'Chatbot', contact: 'Contacto', telegram: 'Telegram' },
  };

  const t = navLabels[currentLang] || navLabels['en'];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-50">
      <Container>
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Sherpa
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-medium text-gray-600 hover:text-blue-600 transition">{t.home}</Link>
            <Link href="/chatbot" className="font-medium text-gray-600 hover:text-blue-600 transition">{t.chat}</Link>
            <Link href="/telegram" className="font-medium text-gray-600 hover:text-blue-600 transition">{t.telegram}</Link>
            <Link href="/contatti" className="font-medium text-gray-600 hover:text-blue-600 transition">{t.contact}</Link>
          </nav>

          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            {(['it', 'en', 'es'] as SupportedLang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  currentLang === l ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </header>
  );
};