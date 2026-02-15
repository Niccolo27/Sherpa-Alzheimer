import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { useRouter } from 'next/router';

export function Header({ currentLang, setLang }: any) {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Sync login state
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

  const t = labels[currentLang as keyof typeof labels];

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100]">
      <Container>
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: BRANDING */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-3 transition-transform">
              <span className="text-2xl font-bold">🏔️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 leading-none tracking-tighter">SHERPA</span>
              <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">Alzheimer AI</span>
            </div>
          </Link>

          {/* MIDDLE: MAIN NAV */}
          <div className="hidden md:flex items-center gap-8 font-bold text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">{t.home}</Link>
            <Link href="/chatbot" className="hover:text-blue-600 transition-colors">{t.chat}</Link>
          </div>

          {/* RIGHT: AUTH & LANG */}
          <div className="flex items-center gap-4">
            
            {/* Language Selector (Minimal) */}
            <select 
              value={currentLang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-50 border-none rounded-xl px-3 py-2 text-xs font-black text-slate-500 hover:bg-slate-100 transition-colors outline-none cursor-pointer appearance-none uppercase"
            >
              <option value="it">IT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>

            <div className="h-8 w-[1.5px] bg-slate-100 hidden sm:block"></div>

            {userName ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end leading-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utente</span>
                  <span className="text-sm font-black text-slate-800">{userName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 font-bold px-5 py-2.5 rounded-2xl text-sm hover:bg-red-100 transition-all active:scale-95"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-slate-500 font-bold hover:text-blue-600 transition px-4 py-2 text-sm">
                  {t.login}
                </Link>
                <Link href="/register" className="bg-blue-600 text-white font-black px-6 py-3 rounded-2xl text-sm shadow-md shadow-blue-100 hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95">
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