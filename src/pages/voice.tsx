import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { SupportedLang } from './chatbot';

export default function VoiceAssistant() {
  const [lang, setLang] = useState<SupportedLang>('it');
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  
  // Reference for the Web Speech API Recognition object
  const recognitionRef = useRef<any>(null);

  const t = {
    it: { 
      title: "Assistente Vocale", 
      hint: "Tocca il microfono e parla con Sherpa", 
      processing: "Sto pensando...", 
      speaking: "Sherpa sta parlando...",
      error: "Spiacente, non ho capito. Riprova."
    },
    en: { 
      title: "Voice Assistant", 
      hint: "Tap the mic and speak to Sherpa", 
      processing: "Thinking...", 
      speaking: "Sherpa is speaking...",
      error: "Sorry, I didn't catch that. Try again."
    },
    es: { 
      title: "Asistente de Voz", 
      hint: "Toca el micro y habla con Sherpa", 
      processing: "Pensando...", 
      speaking: "Sherpa está hablando...",
      error: "Lo siento, no entendí. Inténtalo de nuevo."
    }
  };

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        sendToTextApi(text); // Send transcribed text to your existing backend 
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setStatus('idle');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [lang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setAiReply('');
      recognitionRef.current.lang = lang === 'it' ? 'it-IT' : lang === 'es' ? 'es-ES' : 'en-US';
      recognitionRef.current?.start();
      setIsListening(true);
      setStatus('idle');
    }
  };

  const sendToTextApi = async (text: string) => {
    setStatus('processing');
    const userName = localStorage.getItem('chat_user_name') || 'User'; // Get saved name [cite: 10, 15]

    try {
      // Calling your existing text-based API endpoint 
      const response = await fetch('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, user_name: userName }),
      });
      
      const data = await response.json();
      setAiReply(data.reply);
      speak(data.reply); // Use browser TTS to read the reply
    } catch (error) {
      console.error("API Error:", error);
      setStatus('idle');
    }
  };

  const speak = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'it' ? 'it-IT' : lang === 'es' ? 'es-ES' : 'en-US';
    
    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header currentLang={lang} setLang={setLang} />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <Container>
          <div className="max-w-xl mx-auto text-center space-y-12 bg-white p-12 md:p-16 rounded-[50px] shadow-2xl border border-indigo-50">
            <h1 className="text-4xl font-black text-gray-900">{t[lang].title}</h1>
            
            <div className="relative flex justify-center">
              {isListening && (
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
              )}
              <button
                onClick={toggleListening}
                className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isListening ? 'bg-red-500 scale-95' : 'bg-gradient-to-tr from-blue-600 to-emerald-500'
                }`}
              >
                <span className="text-4xl">{isListening ? '⏹️' : '🎙️'}</span>
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-xl font-medium text-gray-500 italic">
                {status === 'processing' ? t[lang].processing : 
                 status === 'speaking' ? t[lang].speaking : t[lang].hint}
              </p>
              
              {transcript && (
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-800 font-medium">
                   " {transcript} "
                </div>
              )}

              {aiReply && (
                <div className="p-6 bg-emerald-50 rounded-3xl text-emerald-900 text-lg leading-relaxed shadow-sm border border-emerald-100">
                  {aiReply}
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      
      <Footer lang={lang} />
    </div>
  );
}