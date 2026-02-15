import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { useRouter } from 'next/router';

export function Header({ currentLang, setLang }: any) {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('chat_user_name');
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    router.push('/');
  };

  const labels = {
    it: { home: 'Home', chat: 'Chatbot', login: 'Accedi', signup: 'Registrati', logout: 'Esci' },
    en: { home: 'Home', chat: 'Chatbot', login: 'Login', signup: 'Sign Up', logout: 'Logout' },
    es: { home: 'Inicio', chat: 'Chatbot', login: 'Acceder', signup: 'Registrarse', logout: 'Salir' }
  };

  const t = labels[currentLang as keyof typeof labels] || labels['en'];

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100]">
      <Container>
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: BRANDING */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-blue-200 transition-all">
              <span className="text-xl font-bold">🏔️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 leading-none tracking-tighter">SHERPA</span>
              <span className="text-[9px] font-bold text-blue-600 tracking-[0.2em] uppercase">Alzheimer AI</span>
            </div>
          </Link>

          {/* MIDDLE: MAIN NAV + FAST LINKS */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6 font-bold text-slate-500 text-sm">
              <Link href="/" className="hover:text-blue-600 transition-colors">{t.home}</Link>
              <Link href="/chatbot" className="hover:text-blue-600 transition-colors">{t.chat}</Link>
            </div>

            <div className="h-4 w-[1px] bg-slate-200"></div>

            {/* FAST LINKS TO TELEGRAM/WHATSAPP */}
            <div className="flex items-center gap-3">
              <Link href="/telegram" title="Telegram Fast Link">
                <div className="w-9 h-9 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all cursor-pointer shadow-sm">
                  <span className="text-sm">✈️</span>
                </div>
              </Link>
              <Link href="/whatsapp" title="WhatsApp Fast Link">
                <div className="w-9 h-9 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shadow-sm">
                  <span className="text-sm">💬</span>
                </div>
              </Link>
            </div>
          </div>

          {/* RIGHT: AUTH & LANG */}
          <div className="flex items-center gap-4">
            <select 
              value={currentLang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-50 border-none rounded-xl px-2 py-1.5 text-[10px] font-black text-slate-500 hover:bg-slate-100 transition-colors outline-none cursor-pointer uppercase"
            >
              <option value="it">IT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>

            {userName ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Paziente</p>
                   <p className="text-sm font-black text-slate-800 leading-none mt-1">{userName}</p>
                </div>
                <button onClick={handleLogout} className="bg-slate-100 text-slate-600 font-bold px-4 py-2 rounded-xl text-xs hover:bg-red-50 hover:text-red-600 transition-all">
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-slate-500 font-bold hover:text-blue-600 transition px-3 py-2 text-xs">
                  {t.login}
                </Link>
                <Link href="/register" className="bg-blue-600 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                  {t.signup}
                </Link>
              </div>
            )}
          </div>

        </div>
      </Container>
    </nav>
  );
}