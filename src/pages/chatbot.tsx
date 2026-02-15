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

type ReplyBlock =
  | { type: 'heading'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'text'; text: string }
  | { type: 'link'; href: string };

function parseSherpaReply(reply: string): ReplyBlock[] {
  const lines = reply
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const blocks: ReplyBlock[] = [];

  for (const line of lines) {
    if (/^[A-Za-zÀ-ÿ0-9\s'’()-]+:$/.test(line)) {
      blocks.push({ type: 'heading', text: line.replace(/:$/, '') });
      continue;
    }

    if (line.startsWith('- ')) {
      const item = line.slice(2).trim();
      if (/^https?:\/\/\S+$/i.test(item)) {
        blocks.push({ type: 'link', href: item });
      } else {
        blocks.push({ type: 'bullet', text: item });
      }
      continue;
    }

    blocks.push({ type: 'text', text: line });
  }

  return blocks;
}

export default function ChatbotPage() {
  const [currentLang, setCurrentLang] = useState<SupportedLang>('it');

  // FIX: You introduced `user` but the rest of the code uses `userName`.
  // Keep a single source of truth: `userName`.
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
      subtitle: 'Risposte semplici, tono calmo.',
      placeholder: 'Scrivi un messaggio...',
      reset: 'Reset sessione',
      welcome: 'Benvenuto! Come ti chiami?',
      typing: 'Sto pensando...',
      send: 'Invia',
      quickTitle: 'Hai bisogno di aiuto su qualcosa di specifico?',
      quickNameFirst: 'Prima dimmi come ti chiami 🙂',
      repeat: 'Ripeti',
      connectionError: 'Errore di connessione.',
      niceToMeetYou: (name: string) => `Piacere di conoscerti, ${name}!`,
      welcomeBack: (name: string) => `Bentornato, ${name}!`,
    },
    en: {
      title: 'Sherpa Alzheimer',
      subtitle: 'Simple answers, calm tone.',
      placeholder: 'Type a message...',
      reset: 'Reset session',
      welcome: 'Welcome! What is your name?',
      typing: 'Thinking...',
      send: 'Send',
      quickTitle: 'Need help with something specific?',
      quickNameFirst: 'Tell me your name first 🙂',
      repeat: 'Repeat',
      connectionError: 'Connection error.',
      niceToMeetYou: (name: string) => `Nice to meet you, ${name}!`,
      welcomeBack: (name: string) => `Welcome back, ${name}!`,
    },
    es: {
      title: 'Sherpa Alzheimer',
      subtitle: 'Respuestas simples, tono calmado.',
      placeholder: 'Escribe un mensaje...',
      reset: 'Reiniciar sesión',
      welcome: '¡Bienvenido! ¿Cómo te llamas?',
      typing: 'Pensando...',
      send: 'Enviar',
      quickTitle: '¿Necesitas ayuda con algo específico?',
      quickNameFirst: 'Dime tu nombre primero 🙂',
      repeat: 'Repetir',
      connectionError: 'Error de conexión.',
      niceToMeetYou: (name: string) => `Encantado/a, ${name}!`,
      welcomeBack: (name: string) => `¡Bienvenido/a de nuevo, ${name}!`,
    },
  } as const;

  const t = chatLabels[currentLang];

  const quickPrompts: Array<{ label: string; message: string }> = [
    {
      label: '🌙 Nighttime (sundowning)',
      message: "How do I deal with difficult nighttime behavior (sundowning) in Alzheimer's patients?",
    },
    {
      label: '⚡ Aggressive behavior',
      message: "How do I handle an aggressive Alzheimer's patient safely?",
    },
    {
      label: '💛 Caregiver self-care',
      message: 'How can caregivers take care of themselves while caring for an Alzheimer’s patient?',
    },
    {
      label: '🗣 Communication tips',
      message: "How should I communicate when an Alzheimer's patient repeats questions?",
    },
    {
      label: '🏠 Home safety',
      message: "How can I make the home safer for someone with Alzheimer's?",
    },
  ];

  // --- CALM TEXT TO SPEECH ---
  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = currentLang === 'it' ? 'it-IT' : currentLang === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 0.95;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      v =>
        (v.name.includes('Google') || v.name.includes('Natural')) &&
        v.lang.startsWith(utterance.lang.split('-')[0])
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  // --- SPEECH TO TEXT ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript || '';
      if (text) handleSendMessage(null, text);
    };

    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;

    window.speechSynthesis.getVoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();

      recognitionRef.current.lang =
        currentLang === 'it' ? 'it-IT' : currentLang === 'es' ? 'es-ES' : 'en-US';

      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // --- INITIALIZATION (welcome + saved name) ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedName = localStorage.getItem('chat_user_name');
    if (savedName) {
      setUserName(savedName);
      setMessages([{ id: 1, text: t.welcomeBack(savedName), sender: 'bot' }]);
    } else {
      setMessages([{ id: 1, text: t.welcome, sender: 'bot' }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll (keep ONLY one, you had duplicates)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleReset = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('chat_user_name');
    window.location.reload();
  };

  // Reusable backend call (keep 8001)
  const sendMessageToBackend = async (userText: string) => {
    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/chat/`
       , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, user_name: userName }),
      });

      const data = await response.json();

      if (data.lang && ['en', 'es', 'it'].includes(data.lang)) {
        setCurrentLang(data.lang as SupportedLang);
      }

      setMessages(prev => [...prev, { id: Date.now() + 2, text: data.reply, sender: 'bot' }]);
      speak(data.reply);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 3, text: t.connectionError, sender: 'bot' }]);
      speak(t.connectionError);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = async (promptMessage: string) => {
    if (!userName) {
      setMessages(prev => [...prev, { id: Date.now(), text: t.quickNameFirst, sender: 'bot' }]);
      return;
    }

    setMessages(prev => [...prev, { id: Date.now(), text: promptMessage, sender: 'user' }]);
    await sendMessageToBackend(promptMessage);
  };

  // MESSAGE HANDLING (typed + voice)
  const handleSendMessage = async (e: React.FormEvent | null, voiceText?: string) => {
    if (e) e.preventDefault();

    const textToSend = (voiceText ?? inputValue).trim();
    if (!textToSend) return;

    setMessages(prev => [...prev, { id: Date.now(), text: textToSend, sender: 'user' }]);
    setInputValue('');

    // First message = user's name
    if (!userName) {
      setUserName(textToSend);
      if (typeof window !== 'undefined') localStorage.setItem('chat_user_name', textToSend);

      setIsTyping(true);
      setTimeout(() => {
        const reply = t.niceToMeetYou(textToSend);
        setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
        setIsTyping(false);
        speak(reply);
      }, 700);

      return;
    }

    await sendMessageToBackend(textToSend);
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
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-inner">
                    🤖
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 leading-none">{t.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
                  </div>
                </div>

                {userName && (
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition"
                    type="button"
                  >
                    {t.reset}
                  </button>
                )}
              </div>

              {/* Quick Support Buttons */}
              <div className="px-6 py-4 border-b bg-white">
                <p className="text-sm font-medium text-gray-600 mb-3">{t.quickTitle}</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickPrompt(prompt.message)}
                      className="text-sm px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat View */}
              <div className="h-[60vh] overflow-y-auto px-6 py-8 space-y-6 bg-slate-50/50">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[85%] px-6 py-4 rounded-[30px] shadow-sm text-lg leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white border border-indigo-50 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        {msg.sender === 'bot' ? (
                          <div className="space-y-2">
                            {parseSherpaReply(msg.text).map((b, idx2) => {
                              if (b.type === 'heading') {
                                return (
                                  <div key={idx2} className="font-semibold text-gray-900 pt-2">
                                    {b.text}
                                  </div>
                                );
                              }
                              if (b.type === 'bullet') {
                                return (
                                  <div key={idx2} className="flex gap-2 text-gray-800">
                                    <span className="mt-[2px]">•</span>
                                    <span>{b.text}</span>
                                  </div>
                                );
                              }
                              if (b.type === 'link') {
                                return (
                                  <a
                                    key={idx2}
                                    href={b.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline break-all"
                                  >
                                    {b.href}
                                  </a>
                                );
                              }
                              return (
                                <div key={idx2} className="text-gray-800">
                                  {b.text}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>

                      {msg.sender === 'bot' && (
                        <button
                          onClick={() => speak(msg.text)}
                          className="mt-2 text-blue-400 hover:text-blue-600 flex items-center gap-1 text-sm font-bold"
                          type="button"
                        >
                          🔊 {t.repeat}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-blue-400 font-bold animate-pulse">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    {t.typing}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Controls */}
              <form onSubmit={e => handleSendMessage(e)} className="p-6 bg-white border-t border-indigo-50">
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder={t.placeholder}
                    className="flex-1 rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 py-4 text-lg outline-none focus:border-blue-400 transition-all"
                  />

                  <button
                    type="button"
                    onClick={toggleVoice}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse shadow-red-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    aria-label="Voice input"
                  >
                    <span className="text-3xl">{isListening ? '🛑' : '🎙️'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="h-16 px-8 rounded-2xl font-black text-white bg-blue-600 shadow-blue-200 shadow-lg hover:bg-blue-700 disabled:opacity-30 transition-all active:scale-95"
                  >
                    {t.send.toUpperCase()}
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