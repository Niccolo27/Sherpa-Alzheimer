import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { Heading } from '../components/Heading';

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
    it: { title: "Sherpa Alzheimer", placeholder: "Scrivi un messaggio...", reset: "Reset Sessione", welcome: "Benvenuto! Come ti chiami?" },
    en: { title: "Sherpa Alzheimer", placeholder: "Type a message...", reset: "Reset Session", welcome: "Welcome! What is your name?" },
    es: { title: "Sherpa Alzheimer", placeholder: "Escribe un mensaje...", reset: "Reiniciar sesión", welcome: "¡Bienvenido! ¿Cómo te llamas?" }
  };

  // Run ONCE on mount to check session
  useEffect(() => {
    const savedName = localStorage.getItem('chat_user_name');
    if (savedName) {
      setUserName(savedName);
      setMessages([{ id: 1, text: `Bentornato, ${savedName}!`, sender: 'bot' }]);
    } else {
      setMessages([{ id: 1, text: chatLabels[currentLang].welcome, sender: 'bot' }]);
    }
  }, []); // Empty array ensures this doesn't loop

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
    setInputValue('');

    // PHASE 1: Capture Name
    if (!userName) {
      setUserName(userText);
      localStorage.setItem('chat_user_name', userText);
      setIsTyping(true);
      setTimeout(() => {
        const reply = currentLang === 'es' ? `¡Mucho gusto, ${userText}!` : currentLang === 'it' ? `Piacere di conoscerti, ${userText}!` : `Nice to meet you, ${userText}!`;
        setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
        setIsTyping(false);
      }, 800);
      return; // Stop here to avoid calling API without a name
    }

    // PHASE 2: API Chat
    setIsTyping(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, user_name: userName }),
      });

      const data = await response.json();
      
      if (data.detected_language && ['en', 'es', 'it'].includes(data.detected_language)) {
        setCurrentLang(data.detected_language as SupportedLang);
      }
      
      setMessages(prev => [...prev, { id: Date.now() + 2, text: data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 3, text: "Connection error.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header lang={currentLang} />
      <main className="flex-grow py-10">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-6">
              <Heading title={chatLabels[currentLang].title} level={1} />
              {userName && (
                <button onClick={() => { localStorage.removeItem('chat_user_name'); window.location.reload(); }} 
                        className="text-red-500 font-bold hover:underline">
                  {chatLabels[currentLang].reset}
                </button>
              )}
            </div>
            <div className="bg-white border-4 border-brand-secondary rounded-3xl shadow-xl flex flex-col h-[550px] overflow-hidden">
              <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl font-medium shadow-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-white border-2 border-brand-secondary rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-gray-400 italic animate-pulse">Sherpa is thinking...</div>}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-3">
                <input 
                  type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                  placeholder={chatLabels[currentLang].placeholder}
                  className="flex-grow p-3 border-2 rounded-xl focus:border-brand-primary outline-none"
                />
                <button type="submit" className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold">SEND</button>
              </form>
            </div>
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