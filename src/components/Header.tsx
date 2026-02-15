import React from 'react';
import Link from 'next/link';
import { Container } from './Container';

interface HeaderProps {
  currentLang: 'en' | 'es' | 'it';
  setLang: (lang: 'en' | 'es' | 'it') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLang, setLang }) => {
  const navLabels = {
    it: { home: 'Home', chat: 'Chatbot', voice: 'Voce', contact: 'Contatti' },
    en: { home: 'Home', chat: 'Chatbot', voice: 'Voice', contact: 'Contact' },
    es: { home: 'Inicio', chat: 'Chatbot', voice: 'Voz', contact: 'Contacto' },
  };

  const labels = navLabels[currentLang];

  return (
    <header className="py-6 border-b border-gray-100 bg-white sticky top-0 z-50">
      <Container>
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
            SHERPA
          </Link>
          
          <nav className="hidden md:flex gap-8 items-center font-bold text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition">{labels.home}</Link>
            <Link href="/chatbot" className="hover:text-blue-600 transition">{labels.chat}</Link>
            {/* New Voice Link */}
            <Link href="/voice" className="hover:text-blue-600 transition bg-blue-50 px-3 py-1 rounded-lg text-blue-700">
              {labels.voice} 🎙️
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition">{labels.contact}</Link>
          </nav>

          <div className="flex gap-2">
            {(['en', 'it', 'es'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-md text-sm font-bold transition ${
                  currentLang === l ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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