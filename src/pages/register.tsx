import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container } from '../components/Container';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    first_name: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok) {
        // After registration, redirect to login
        router.push('/login');
      } else {
        setError(data.error || 'Errore durante la registrazione');
      }
    } catch (err) {
      setError('Impossibile connettersi al server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Container>
        <div className="max-w-md mx-auto bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">🏔️</div>
            <h1 className="text-3xl font-black text-slate-800">Crea Account</h1>
            <p className="text-slate-500 font-medium mt-2">Inizia il tuo percorso con Sherpa.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Come ti chiami?</label>
              <input 
                type="text" 
                placeholder="Es. Mario"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 transition-all"
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username</label>
              <input 
                type="text" 
                placeholder="Scegli un nome utente"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 transition-all"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-blue-700 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'CREAZIONE IN CORSO...' : 'REGISTRATI'}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 font-bold text-sm">
            Hai già un account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Accedi qui
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}