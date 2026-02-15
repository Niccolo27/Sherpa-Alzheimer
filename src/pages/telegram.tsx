import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { Heading } from '../components/Heading';
import { SupportedLang } from './chatbot';

export default function TelegramPage() {
  const [lang, setLang] = useState<SupportedLang>('it');

  const t = {
    it: {
      title: "Chatta su Telegram",
      desc: "Preferisci usare Telegram? Parla con il nostro assistente direttamente nell'app per un supporto rapido e familiare.",
      btn: "APRI TELEGRAM",
      features: ["Sempre disponibile", "Interfaccia familiare", "Gratuito"]
    },
    en: {
      title: "Chat on Telegram",
      desc: "Prefer using Telegram? Talk to our assistant directly in the app for quick and familiar support.",
      btn: "OPEN TELEGRAM",
      features: ["Always available", "Familiar interface", "Free of charge"]
    },
    es: {
      title: "Chatea en Telegram",
      desc: "¿Prefieres usar Telegram? Habla con nuestro asistente directamente en la aplicación para obtener un apoyo rápido y familiar.",
      btn: "ABRIR TELEGRAM",
      features: ["Siempre disponible", "Interfaz familiar", "Gratuito"]
    }
  };

  const content = t[lang] || t['en'];

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLang={lang} setLang={setLang} />

      <main className="flex-grow py-20">
        <Container>
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-10 md:p-16 rounded-[40px] shadow-2xl border-4 border-[#24A1DE] text-center">
            {/* Telegram Icon Style */}
            <div className="w-24 h-24 bg-[#24A1DE] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg viewBox="0 0 24 24" className="w-14 h-14 fill-white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.53.26l.21-3.04 5.54-5.01c.24-.21-.053-.33-.37-.12l-6.85 4.31-2.94-.92c-.64-.2-.65-.64.13-.94l11.5-4.43c.53-.19 1 .13.81 1z"/>
              </svg>
            </div>

            <Heading title={content.title} level={1} />
            <p className="text-xl text-gray-600 mt-6 mb-10 leading-relaxed">
              {content.desc}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {content.features.map((f, i) => (
                <span key={i} className="bg-sky-50 text-[#24A1DE] px-4 py-2 rounded-full font-bold text-sm border border-sky-100">
                  ✓ {f}
                </span>
              ))}
            </div>

            <a 
              href="https://t.me/YourBotUsername" // <-- Replace with your real Telegram Bot username
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#24A1DE] text-white text-2xl font-black px-12 py-6 rounded-2xl shadow-xl hover:scale-105 hover:bg-[#208dbd] transition-all transform"
            >
              {content.btn}
            </a>
          </div>
        </Container>
      </main>

      <Footer lang={lang} />
    </div>
  );
}