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
  const [user, setUser] = useState<{name: string} | null>({ name: "User" }); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // UI States for Voice Control
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const labels = {
    it: { title: 'Sherpa AI', pause: 'Pausa', resume: 'Riprendi', stop: 'Ferma', placeholder: 'Scrivi qui...', typing: 'Sherpa sta pensando...' },
    en: { title: 'Sherpa AI', pause: 'Pause', resume: 'Resume', stop: 'Stop', placeholder: 'Type here...', typing: 'Sherpa is thinking...' },
    es: { title: 'Sherpa AI', pause: 'Pausa', resume: 'Reanudar', stop: 'Detener', placeholder: 'Escribe aquí...', typing: 'Sherpa está pensando...' }
  };

  const t = labels[currentLang];

  // --- INITIALIZATION & VOICE WARMUP ---
  useEffect(() => {
    // 1. Force clear any stuck speech from previous sessions
    window.speechSynthesis.cancel();

    // 2. Warm up the engine for Chrome/Safari
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("System: Voices initialized. Count:", voices.length);
    };
    
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    // 3. Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (e: any) => handleSendMessage(null, e.results[0][0].transcript);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  // --- TTS LOGIC (Speaking) ---
  const speak = (text: string) => {
    if (!isVoiceMode) {
      console.log("TTS: Silent mode is active. Skipping audio.");
      return;
    }

    window.speechSynthesis.cancel();
    setIsPaused(false);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'it' ? 'it-IT' : currentLang === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 0.85; // Calm, patient speed
    utterance.pitch = 1.0;

    utterance.onstart = () => console.log("TTS: Started speaking...");
    utterance.onerror = (e) => console.error("TTS Error:", e);
    utterance.onend = () => {
      setIsPaused(false);
      console.log("TTS: Finished speaking.");
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePauseResume = () => {
    if (window.speechSynthesis.speaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPaused(false);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      stopSpeaking();
      recognitionRef.current.lang = currentLang === 'it' ? 'it-IT' : currentLang === 'es' ? 'es-ES' : 'en-US';
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent | null, voiceText?: string) => {
    if (e) e.preventDefault();
    const textToSend = voiceText || inputValue.trim();
    if (!textToSend) return;

    setMessages(prev => [...prev, { id: Date.now(), text: textToSend, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, user_name: user?.name || "User" }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, text: data.reply, sender: 'bot' }]);
      
      // Auto-trigger TTS for the bot reply
      speak(data.reply);

    } catch (err) {
      console.error("Fetch Error:", err);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Error connecting to server.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header currentLang={currentLang} setLang={setCurrentLang} />

      <main className="flex-1 px-4 py-6">
        <Container>
          <div className="mx-auto max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            
            {/* Control Bar */}
            <div className="px-8 py-6 border-b border-slate-100 flex flex-wrap justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">🤖</div>
                <h2 className="font-black text-xl text-slate-800">{t.title}</h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Voice Mode Toggle */}
                <div className="flex items-center gap-2 mr-2">
                  <button 
                    onClick={() => {
                        setIsVoiceMode(!isVoiceMode);
                        if(isVoiceMode) stopSpeaking();
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isVoiceMode ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full transition-transform duration-300 ${isVoiceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audio</span>
                </div>

                {isVoiceMode && (
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePauseResume}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-sm font-bold hover:bg-amber-100 transition shadow-sm"
                    >
                      {isPaused ? `▶️ ${t.resume}` : `⏸️ ${t.pause}`}
                    </button>
                    <button 
                      onClick={stopSpeaking}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition shadow-sm"
                    >
                      ⏹️
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
              {messages.length === 0 && (
                 <div className="text-center text-slate-400 mt-10 italic">
                    {currentLang === 'it' ? 'Inizia a parlare con Sherpa...' : 'Start talking to Sherpa...'}
                 </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-6 py-4 rounded-[25px] text-lg shadow-sm border ${
                    msg.sender === 'user' 
                    ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                    : 'bg-white border-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-blue-500 font-bold animate-pulse">
                   <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                   {t.typing}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-4 items-center">
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 bg-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
              />
              
              <button 
                type="button"
                onClick={toggleVoiceInput}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                  isListening 
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isListening ? '🛑' : '🎙️'}
              </button>

              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white h-14 px-8 rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {currentLang === 'it' ? 'INVIA' : 'SEND'}
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