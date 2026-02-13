import React from 'react';
import Link from 'next/link';
import { LanguageTranslator } from './LanguageTranslator';

export const Header = () => {
  return (
    <header className="bg-white border-b-4 border-brand-secondary sticky top-0 z-50">
      <Container>
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="group">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🤖</span>
              <span className="text-2xl font-black text-brand-primary tracking-tighter group-hover:text-brand-text transition-colors">
                Sherpa<span className="text-brand-accent">Alzheimer</span>
              </span>
            </div>
          </Link>

 
          <div className="flex items-center gap-8">
            {/* Widget automatic translate */}
            <div className="hidden sm:block">
              <LanguageTranslator />
            </div>

            {/* Main Menu */}
            <nav>
              <ul className="flex items-center gap-6 font-bold text-lg text-brand-text">
                <li>
                  <Link href="/" className="hover:text-brand-primary transition-colors border-b-2 border-transparent hover:border-brand-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/chatbot" className="hover:text-brand-primary transition-colors border-b-2 border-transparent hover:border-brand-primary">
                    Chatbot
                  </Link>
                </li>
                <li>
                  <Link href="/contatti" className="bg-brand-primary text-white px-5 py-2 rounded-xl hover:scale-105 transition-all">
                    Contatti
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </Container>

      <style jsx global>{`
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0 !important; /* Nasconde il testo "Powered by" */
          display: flex;
          align-items: center;
        }
        .goog-te-gadget .goog-te-combo {
          margin: 0 !important;
          padding: 8px !important;
          border: 2px solid #1D4ED8 !important; /* brand-primary */
          border-radius: 12px !important;
          background: #DBEAFE !important; /* brand-secondary */
          color: #111827 !important;
          font-weight: bold !important;
          font-size: 14px !important;
          outline: none;
        }
        .goog-te-banner-frame.skiptranslate, .goog-te-gadget img {
          display: none !important; /* Nasconde loghi e banner */
        }
        body {
          top: 0 !important; /* Evita che Google sposti il sito verso il basso */
        }
      `}</style>
    </header>
  );
};

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);