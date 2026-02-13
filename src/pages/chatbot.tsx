import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { Heading } from '../components/Heading';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../utils/translations';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotPage() {
  
  const { lang, changeLanguage } = useLanguage();
  const t = translations[lang].chatbot;
  const [userName, setUserName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const savedName = localStorage.getItem('chat_user_name');
    if (savedName) {
      setUserName(savedName);
      setMessages([{ 
        id: 1, 
        text: `${t.returning}${savedName}!`, 
        sender: 'bot' 
      }]);
    } else {
      setMessages([{ 
        id: 1, 
        text: t.welcome, 
        sender: 'bot' 
      }]);
    }
  }, [lang]); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newUserMsg: Message = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

   
    if (!userName) {
      setUserName(userText);
      localStorage.setItem('chat_user_name', userText);
      
      setTimeout(() => {
        const botReply: Message = {
          id: Date.now() + 1,
          text: `${t.pleasure}${userText}!`,
          sender: 'bot'
        };
        setMessages(prev => [...prev, botReply]);
      }, 800);
      return;
    }

    
    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        text: lang === 'it' 
          ? `Capito ${userName}, sto elaborando la richiesta...` 
          : `Got it ${userName}, I'm processing your request...`,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botReply]);
    }, 1000);
  };

  const handleReset = () => {
    localStorage.removeItem('chat_user_name');
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header currentLang={lang} setLang={changeLanguage} />

      <main className="flex-grow py-10">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <Heading title={lang === 'it' ? "Assistente" : "Assistant"} level={1} />
              </div>
              {userName && (
                <button 
                  onClick={handleReset}
                  className="text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-bold transition-colors border-2 border-red-100"
                >
                  {t.reset}
                </button>
              )}
            </div>

            <div className="bg-white border-4 border-brand-secondary rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
              {/* Area Messaggi */}
              <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-white/50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-lg font-medium shadow-sm
                      ${msg.sender === 'user' 
                        ? 'bg-brand-primary text-white rounded-br-none' 
                        : 'bg-brand-secondary text-brand-text rounded-bl-none border-2 border-blue-100'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Form Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t-4 border-gray-100 flex gap-4">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={!userName ? t.placeholderName : t.placeholderMsg}
                  className="flex-grow p-4 text-lg border-4 border-gray-200 rounded-2xl focus:border-brand-primary focus:ring-4 focus:ring-brand-accent/20 outline-none transition-all"
                  aria-label="Chat input"
                />
                <button 
                  type="submit" 
                  className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  {translations[lang].common.send}
                </button>
              </form>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}