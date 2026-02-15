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
    // Headings like "Definition:" "Key facts:" etc
    if (/^[A-Za-zÀ-ÿ0-9\s'’()-]+:$/.test(line)) {
      blocks.push({ type: 'heading', text: line.replace(/:$/, '') });
      continue;
    }

    // Bullets like "- something"
    if (line.startsWith('- ')) {
      const item = line.slice(2).trim();

      // If it's a URL, treat it as a link
      if (/^https?:\/\/\S+$/i.test(item)) {
        blocks.push({ type: 'link', href: item });
      } else {
        blocks.push({ type: 'bullet', text: item });
      }
      continue;
    }

    // Plain text
    blocks.push({ type: 'text', text: line });
  }

  return blocks;
}

export default function ChatbotPage() {
  const [currentLang, setCurrentLang] = useState<SupportedLang>('it');
  const [userName, setUserName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    },
  };

  // Quick prompts (buttons)
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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Reusable backend call
  const sendMessageToBackend = async (userText: string) => {
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:8001/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, user_name: userName }),
      });

      const data = await response.json();
      console.log('Data >>', data);

      // Update UI language if backend detected a change
      if (data.lang && ['en', 'es', 'it'].includes(data.lang)) {
        setCurrentLang(data.lang as SupportedLang);
      }

      setMessages(prev => [...prev, { id: Date.now() + 2, text: data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 3, text: 'Connection error with Sherpa Brain.', sender: 'bot' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = async (promptMessage: string) => {
    // Require name first (same flow as typing)
    if (!userName) {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: chatLabels[currentLang].quickNameFirst, sender: 'bot' },
      ]);
      return;
    }

    // Add the "user" message in the chat
    setMessages(prev => [...prev, { id: Date.now(), text: promptMessage, sender: 'user' }]);

    // Call backend and display bot reply
    await sendMessageToBackend(promptMessage);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
    setInputValue('');

    // First message = user's name
    if (!userName) {
      setUserName(userText);
      localStorage.setItem('chat_user_name', userText);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: `Piacere, ${userText}! Come posso aiutarti oggi?`, sender: 'bot' },
      ]);
      return;
    }

    await sendMessageToBackend(userText);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLang={currentLang} setLang={setCurrentLang} />
      <main className="flex-grow py-8">
        <Container>
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-indigo-100 overflow-hidden h-[850px] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border-b">
              <h1 className="text-2xl font-bold text-gray-800">{chatLabels[currentLang].title}</h1>
              <p className="text-sm text-gray-500">{chatLabels[currentLang].subtitle}</p>
            </div>

            {/* Quick Support Buttons */}
            <div className="px-6 py-4 border-b bg-white">
              <p className="text-sm font-medium text-gray-600 mb-3">{chatLabels[currentLang].quickTitle}</p>

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

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white border-2 border-emerald-100 rounded-tl-none'
                    }`}
                  >
                    {m.sender === 'bot' ? (
                      <div className="space-y-2">
                        {parseSherpaReply(m.text).map((b, idx) => {
                          if (b.type === 'heading') {
                            return (
                              <div key={idx} className="font-semibold text-gray-800 pt-2">
                                {b.text}
                              </div>
                            );
                          }

                          if (b.type === 'bullet') {
                            return (
                              <div key={idx} className="flex gap-2 text-gray-700">
                                <span className="mt-[2px]">•</span>
                                <span>{b.text}</span>
                              </div>
                            );
                          }

                          if (b.type === 'link') {
                            return (
                              <a
                                key={idx}
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
                            <div key={idx} className="text-gray-700">
                              {b.text}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="text-sm text-gray-400 italic animate-pulse">{chatLabels[currentLang].typing}</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={chatLabels[currentLang].placeholder}
                className="flex-grow p-4 rounded-xl border-2 border-gray-200 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold"
              >
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