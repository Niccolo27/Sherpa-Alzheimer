import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container } from '../components/Container';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        // Save auth data
        localStorage.setItem('token', data.token);
        localStorage.setItem('chat_user_name', data.user.first_name || data.user.username);
        router.push('/chatbot');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server connection error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Container>
        <div className="max-w-md mx-auto bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100">
          <h1 className="text-3xl font-black text-slate-800 mb-2">Bentornato!</h1>
          <p className="text-slate-500 mb-8 font-medium">Accedi per parlare con Sherpa.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 transition-all"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>
            {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-blue-700 transition active:scale-95">
              ACCEDI
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}