import React, { useState, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { SupportedLang } from './chatbot';

export default function VoiceAssistant() {
  const [lang, setLang] = useState<SupportedLang>('it');
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'playing'>('idle');
  const [transcript, setTranscript] = useState('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const t = {
    it: { title: "Assistente Vocale", hint: "Tocca il microfono e parla con Sherpa", processing: "Ascoltando e pensando...", play: "Ascolta risposta" },
    en: { title: "Voice Assistant", hint: "Tap the mic and speak to Sherpa", processing: "Listening and thinking...", play: "Listen to reply" },
    es: { title: "Asistente de Voz", hint: "Toca el micro y habla con Sherpa", processing: "Escuchando y pensando...", play: "Escuchar respuesta" }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
    mediaRecorder.current.onstop = sendAudioToBackend;
    
    mediaRecorder.current.start();
    setIsRecording(true);
    setStatus('idle');
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
    setStatus('processing');
  };

  const sendAudioToBackend = async () => {
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('lang', lang);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/voice/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setTranscript(data.user_text);
      
      // If backend returns audio URL, play it
      if (data.audio_url) {
        const audio = new Audio(data.audio_url);
        setStatus('playing');
        audio.play();
        audio.onended = () => setStatus('idle');
      }
    } catch (error) {
      console.error("Voice Error:", error);
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header currentLang={lang} setLang={setLang} />
      <main className="flex-grow flex items-center justify-center py-12">
        <Container>
          <div className="max-w-xl mx-auto text-center space-y-12 bg-white p-16 rounded-[50px] shadow-2xl border border-indigo-50">
            <h1 className="text-4xl font-black text-gray-900">{t[lang].title}</h1>
            
            <div className="relative flex justify-center">
              {isRecording && (
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
              )}
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isRecording ? 'bg-red-500 scale-95' : 'bg-gradient-to-tr from-blue-600 to-emerald-500'
                }`}
              >
                <span className="text-4xl">🎙️</span>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xl font-medium text-gray-500">
                {status === 'processing' ? t[lang].processing : t[lang].hint}
              </p>
              {transcript && (
                <div className="p-4 bg-gray-50 rounded-2xl italic text-gray-600">
                  "{transcript}"
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