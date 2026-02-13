import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { Heading } from '../components/Heading';

export default function TelegramPage() {
  const [lang, setLang] = useState<'it' | 'en'>('it');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header currentLang={lang} setLang={setLang} />
      <main className="flex-grow py-20 text-center">
        <Container>
          <div className="max-w-2xl mx-auto p-10 border-4 border-[#24A1DE] rounded-3xl shadow-lg">
            <div className="text-6xl mb-6">🔹</div>
            <Heading title="Chat on Telegram" level={1} />
            <p className="text-xl text-gray-600 mb-10 mt-4">
              {lang === 'it' 
                ? "Preferisci usare Telegram? Clicca sul pulsante qui sotto per parlare con il nostro assistente direttamente nell'app." 
                : "Do you prefer using Telegram? Click the button below to talk with our assistant directly in the app."}
            </p>
            
            <a 
              href="#" //TODO: Connect the telegram bot 
              className="inline-block bg-[#24A1DE] text-white text-2xl font-black px-12 py-5 rounded-2xl hover:scale-105 transition-transform shadow-md"
            >
              Open Telegram
            </a>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}