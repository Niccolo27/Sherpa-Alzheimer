import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { Heading } from '../components/Heading';
import { AccessibleButton } from '../components/AccessibleButton';

export default function Contatti() {
  const [lang, setLang] = useState<'it' | 'en'>('it');

  //TODO: Change the text, made a placeholder
  
  const t = {
    it: {
      title: "Contattaci",
      desc: "Scrivici un messaggio. Ti risponderemo presto.",
      name: "Il tuo nome",
      email: "La tua email",
      message: "Cosa vuoi dirci?",
      send: "Invia messaggio"
    },
    en: {
      title: "Contact Us",
      desc: "Send us a message. We will reply soon.",
      name: "Your name",
      email: "Your email",
      message: "What do you want to tell us?",
      send: "Send message"
    }
  };

  const content = t[lang];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header currentLang={lang} setLang={setLang} />

      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Heading title={content.title} level={1} />
            <p className="text-xl text-gray-600 mb-10">{content.desc}</p>

            <form className="space-y-8">
              {/* Name Fields */}
              <div>
                <label htmlFor="name" className="block text-xl font-bold mb-2 text-gray-800">
                  {content.name}
                </label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full p-4 text-lg border-4 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition"
                  placeholder="Esempio: Mario Rossi"
                />
              </div>

              {/* Email fields */}
              <div>
                <label htmlFor="email" className="block text-xl font-bold mb-2 text-gray-800">
                  {content.email}
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full p-4 text-lg border-4 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition"
                  placeholder="mario@esempio.com"
                />
              </div>

              {/* Message fields */}
              <div>
                <label htmlFor="message" className="block text-xl font-bold mb-2 text-gray-800">
                  {content.message}
                </label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full p-4 text-lg border-4 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition"
                ></textarea>
              </div>

              <AccessibleButton text={content.send} />
            </form>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}