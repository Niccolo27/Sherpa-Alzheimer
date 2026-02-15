import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';

export type SupportedLang = 'en' | 'es' | 'it';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotPage() {
  const [currentLang, setCurrentLang] = useState<SupportedLang>('it');
  const [userName, setUserName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatLabels = {
    it: { title: 'Sherpa Alzheimer', subtitle: 'Risposte semplici, tono calmo.', placeholder: 'Scrivi un messaggio...', reset: 'Reset sessione', welcome: 'Benvenuto! Come ti chiami?', typing: 'Sto pensando...', send: 'Invia' },
    en: { title: 'Sherpa Alzheimer', subtitle: 'Simple answers, calm tone.', placeholder: 'Type a message...', reset: 'Reset session', welcome: 'Welcome! What is your name?', typing: 'Thinking...', send: 'Send' },
    es: { title: 'Sherpa Alzheimer', subtitle: 'Respuestas simples, tono calmado.', placeholder: 'Escribe un mensaje...', reset: 'Reiniciar sesión', welcome: '¡Bienvenido! ¿Cómo te llamas?', typing: 'Pensando...', send: 'Enviar' },
  };

  // 1. Logic to auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 2. Logic to handle the API call to Django
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
    setInputValue('');

    if (!userName) {
      setUserName(userText);
      localStorage.setItem('chat_user_name', userText);
      setMessages(prev => [...prev, { id: Date.now()+1, text: `Piacere, ${userText}! Come posso aiutarti oggi?`, sender: 'bot' }]);
      return;
    }

    setIsTyping(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, user_name: userName }),
      });
      const data = await response.json();

      // IMPORTANT: Update UI language if backend detected a change
      if (data.lang && ['en', 'es', 'it'].includes(data.lang)) {
        setCurrentLang(data.lang as SupportedLang);
      }
      
      setMessages(prev => [...prev, { id: Date.now()+2, text: data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now()+3, text: "Connection error with Sherpa Brain.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLang={currentLang} setLang={setCurrentLang} />
      <main className="flex-grow py-8">
        <Container>
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-indigo-100 overflow-hidden h-[650px] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border-b">
              <h1 className="text-2xl font-bold text-gray-800">{chatLabels[currentLang].title}</h1>
              <p className="text-sm text-gray-500">{chatLabels[currentLang].subtitle}</p>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border-2 border-emerald-100 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-sm text-gray-400 italic animate-pulse">{chatLabels[currentLang].typing}</div>}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t flex gap-2">
              <input 
                type="text" value={inputValue} onChange={e => setInputValue(e.target.value)}
                placeholder={chatLabels[currentLang].placeholder}
                className="flex-grow p-4 rounded-xl border-2 border-gray-200 outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold">
                {chatLabels[currentLang].send}
              </button>
            </form>
          </div>
        </Container>
      </main>
      <Footer lang={currentLang} />
    </div>
  );
}

/**
 * FUTURE IMPLEMENTATION NOTE (Scalability Upgrade):
 * ------------------------------------------------
 * To synchronize language across all pages (Home, About, etc.) without manual prop drilling:
 * 1. Create a `LanguageContext` using React Context API in /context/LanguageContext.tsx.
 * 2. Wrap `_app.tsx` with the `LanguageProvider`.
 * 3. Use `const { lang, setLang } = useLanguage()` here instead of local useState.
 */