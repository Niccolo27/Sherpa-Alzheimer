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
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const recognitionRef = useRef<any>(null);

  const chatLabels = {
    it: {
      title: 'Sherpa Alzheimer',
      subtitle: 'Risposte semplici, tono calmo, posso ripetere se serve.',
      placeholder: 'Scrivi un messaggio…',
      reset: 'Reset sessione',
      welcome: 'Benvenuto! Come ti chiami?',
      typing: 'Sherpa sta pensando…',
      send: 'Invia',
    },
    en: {
      title: 'Sherpa Alzheimer',
      subtitle: 'Simple answers, calm tone, I can repeat if needed.',
      placeholder: 'Type a message…',
      reset: 'Reset session',
      welcome: 'Welcome! What is your name?',
      typing: 'Sherpa is thinking…',
      send: 'Send',
    },
    es: {
      title: 'Sherpa Alzheimer',
      subtitle: 'Respuestas simples, tono calmado, puedo repetir si hace falta.',
      placeholder: 'Escribe un mensaje…',
      reset: 'Reiniciar sesión',
      welcome: '¡Bienvenido! ¿Cómo te llamas?',
      typing: 'Sherpa está pensando…',
      send: 'Enviar',
    },
  };

  // --- VOICE LOGIC: SPEECH TO TEXT ---
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        handleSendMessage(null, text); 
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [currentLang]);

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      window.speechSynthesis.cancel(); // Stop AI talking to listen to user
      recognitionRef.current.lang = currentLang === 'it' ? 'it-IT' : currentLang === 'es' ? 'es-ES' : 'en-US';
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // --- VOICE LOGIC: CALM TEXT TO SPEECH ---
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = currentLang === 'it' ? 'it-IT' : currentLang === 'es' ? 'es-ES' : 'en-US';
    
    // Calmness Settings
    utterance.rate = 0.85;  // Slow and patient
    utterance.pitch = 0.95; // Slightly deeper, more soothing
    utterance.volume = 1.0;

    // Try to pick a natural-sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      (v.name.includes('Google') || v.name.includes('Natural')) && 
      v.lang.startsWith(currentLang)
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  // --- INITIALIZATION ---
  useEffect(() => {
    const savedName = localStorage.getItem('chat_user_name');
    if (savedName) {
      setUserName(savedName);
      const welcomeBack = currentLang === 'it' ? `Bentornato, ${savedName}!` : `Welcome back, ${savedName}!`;
      setMessages([{ id: 1, text: welcomeBack, sender: 'bot' }]);
    } else {
      setMessages([{ id: 1, text: chatLabels[currentLang].welcome, sender: 'bot' }]);
    }
    // Load voices for the first time
    window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleReset = () => {
    localStorage.removeItem('chat_user_name');
    window.location.reload();
  };

  // --- MESSAGE HANDLING ---
  const handleSendMessage = async (e: React.FormEvent | null, voiceText?: string) => {
    if (e) e.preventDefault();
    const textToSend = voiceText || inputValue.trim();
    if (!textToSend) return;

    setMessages((prev) => [...prev, { id: Date.now(), text: textToSend, sender: 'user' }]);
    setInputValue('');

    if (!userName) {
      setUserName(textToSend);
      localStorage.setItem('chat_user_name', textToSend);
      setIsTyping(true);
      setTimeout(() => {
        const reply = currentLang === 'it' ? `Piacere di conoscerti, ${textToSend}!` : `Nice to meet you, ${textToSend}!`;
        setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
        setIsTyping(false);
        speak(reply);
      }, 700);
      return;
    }

    setIsTyping(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, user_name: userName }),
      });
      const data = await response.json();

      setMessages((prev) => [...prev, { id: Date.now() + 2, text: data.reply, sender: 'bot' }]);
      speak(data.reply); 
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now() + 3, text: 'Errore di connessione.', sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header currentLang={currentLang} setLang={setCurrentLang} />

      <main className="flex-1 px-4 py-6">
        <Container>
          <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-[40px] border border-indigo-100 bg-white shadow-2xl overflow-hidden">
              
              {/* Header Info */}
              <div className="px-6 py-5 border-b border-indigo-50 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-inner">🤖</div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 leading-none">{chatLabels[currentLang].title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{chatLabels[currentLang].subtitle}</p>
                  </div>
                </div>
                {userName && (
                  <button onClick={handleReset} className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition">
                    {chatLabels[currentLang].reset}
                  </button>
                )}
              </div>

              {/* Chat View */}
              <div className="h-[60vh] overflow-y-auto px-6 py-8 space-y-6 bg-slate-50/50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] px-6 py-4 rounded-[30px] shadow-sm text-lg leading-relaxed ${
                        msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white border border-indigo-50 text-gray-800 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      {msg.sender === 'bot' && (
                        <button 
                          onClick={() => speak(msg.text)} 
                          className="mt-2 text-blue-400 hover:text-blue-600 flex items-center gap-1 text-sm font-bold"
                        >
                          🔊 Ripeti
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-blue-400 font-bold animate-pulse">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    {chatLabels[currentLang].typing}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Controls */}
              <form onSubmit={(e) => handleSendMessage(e)} className="p-6 bg-white border-t border-indigo-50">
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={chatLabels[currentLang].placeholder}
                    className="flex-1 rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 py-4 text-lg outline-none focus:border-blue-400 transition-all"
                  />
                  
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                      isListening ? 'bg-red-500 text-white animate-pulse shadow-red-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-3xl">{isListening ? '🛑' : '🎙️'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="h-16 px-8 rounded-2xl font-black text-white bg-blue-600 shadow-blue-200 shadow-lg hover:bg-blue-700 disabled:opacity-30 transition-all active:scale-95"
                  >
                    {chatLabels[currentLang].send.toUpperCase()}
                  </button>
                </div>
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