import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { Heading } from '../components/Heading';
import { AccessibleButton } from '../components/AccessibleButton';
import { SupportedLang } from './chatbot';

export default function Contatti() {
  const [lang, setLang] = useState<SupportedLang>('it');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const t = {
    it: {
      title: "Contattaci",
      desc: "Scrivici un messaggio. Ti risponderemo presto.",
      name: "Il tuo nome",
      email: "La tua email",
      message: "Cosa vuoi dirci?",
      send: "Invia messaggio",
      success: "Messaggio inviato con successo!",
      error: "Errore durante l'invio. Riprova più tardi."
    },
    en: {
      title: "Contact Us",
      desc: "Send us a message. We will reply soon.",
      name: "Your name",
      email: "Your email",
      message: "What do you want to tell us?",
      send: "Send message",
      success: "Message sent successfully!",
      error: "Error sending message. Try again later."
    },
    es: {
      title: "Contáctanos",
      desc: "Envíanos un mensaje. Te responderemos pronto.",
      name: "Tu nombre",
      email: "Tu correo electrónico",
      message: "¿Qué quieres decirnos?",
      send: "Enviar mensaje",
      success: "¡Mensaje enviado con éxito!",
      error: "Error al enviar. Inténtalo de nuevo más tarde."
    }
  };

  const content = t[lang] || t['en'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLang={lang} setLang={setLang} />

      <main className="flex-grow py-12 md:py-20">
        <Container>
          <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-indigo-50">
            <div className="text-center mb-10">
              <Heading title={content.title} level={1} />
              <p className="text-xl text-gray-600 mt-4">{content.desc}</p>
            </div>

            {status === 'success' ? (
              <div className="p-6 bg-emerald-100 text-emerald-800 rounded-2xl text-center font-bold">
                {content.success}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xl font-bold mb-2 text-gray-800">{content.name}</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 text-lg border-4 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition"
                    placeholder="Esempio: Mario Rossi"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xl font-bold mb-2 text-gray-800">{content.email}</label>
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 text-lg border-4 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition"
                    placeholder="mario@esempio.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xl font-bold mb-2 text-gray-800">{content.message}</label>
                  <textarea 
                    required rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-4 text-lg border-4 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition"
                  ></textarea>
                </div>

                <AccessibleButton 
                  text={status === 'loading' ? '...' : content.send} 
                />
                
                {status === 'error' && (
                  <p className="text-red-600 font-bold text-center mt-4">{content.error}</p>
                )}
              </form>
            )}
          </div>
        </Container>
      </main>

      <Footer lang={lang} />
    </div>
  );
}