import React from 'react';
import Link from 'next/link'; 
import { Container } from './Container';

interface HeaderProps {
  currentLang: string;
  setLang: (lang: 'it' | 'en') => void;
}

export const Header = ({ currentLang, setLang }: HeaderProps) => {
  return (
    <header className="w-full bg-white border-b-2 border-gray-100 py-4">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo in the Home section  */}
          <Link href="/" className="text-2xl font-black text-blue-700 hover:opacity-80 transition">
            Sherpa<span className="text-gray-900">Alzheimer</span>
          </Link>

          {/* NavBar */}
          <nav className="flex items-center gap-6">
            <ul className="flex gap-6 font-bold text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="hover:text-blue-600 transition-colors">
                  {currentLang === 'it' ? 'Contatti' : 'Contact'}
                </Link>
              </li>
            </ul>
            
            {/* Language section */}
            <div className="flex border-2 border-blue-100 rounded-xl overflow-hidden">
              <button 
                onClick={() => setLang('it')}
                className={`px-3 py-1 text-sm font-bold ${currentLang === 'it' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700'}`}
              >
                IT
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-sm font-bold ${currentLang === 'en' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700'}`}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
};
