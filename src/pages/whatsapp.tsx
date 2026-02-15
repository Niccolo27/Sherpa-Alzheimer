import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { Heading } from '../components/Heading';

export default function WhatsappPage() {
  const [lang, setLang] = useState<'it' | 'en'>('it');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header currentLang={lang} setLang={setLang} />
      <main className="flex-grow py-20 text-center">
        <Container>
          <div className="max-w-2xl mx-auto p-10 border-4 border-[#25D366] rounded-3xl shadow-lg">
            <div className="text-6xl mb-6">🟢</div>
            <Heading title="Chatta su WhatsApp" level={1} />
            <p className="text-xl text-gray-600 mb-10 mt-4">
              {lang === 'it' 
                ? "Il nostro assistente è disponibile anche su WhatsApp per darti supporto immediato." 
                : "Our assistant is also available on WhatsApp to give you immediate support."}
            </p>
            
            <a 
              href="#" //TODO: Chatbot on whatsapp
              className="inline-block bg-[#25D366] text-white text-2xl font-black px-12 py-5 rounded-2xl hover:scale-105 transition-transform shadow-md"
            >
              Open WhatsApp
            </a>
          </div>
        </Container>
      </main>
      <Footer lang={lang}/>
    </div>
  );
}