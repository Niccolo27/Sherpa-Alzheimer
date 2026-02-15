import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { ServiceCard } from '../components/ServiceCard';
import { SupportedLang } from './chatbot';

export default function Home() {
  const [lang, setLang] = useState<SupportedLang>('it');

  const content = {
    it: {
      heroTitle: "Il tuo compagno calmo per l'Alzheimer",
      heroDesc: "Sherpa è un assistente intelligente progettato per parlare con calma, ripetere quando serve e offrire supporto quotidiano.",
      cta: "Inizia a parlare",
      ctaVoice: "Usa la voce 🎙️", // New label
      servicesTitle: "I nostri servizi",
      s1: { title: "Compagno AI", desc: "Un chatbot sempre disponibile per conversazioni semplici e rassicuranti." },
      s2: { title: "Canali di Messaggistica", desc: "Parla con Sherpa su WhatsApp o Telegram, app che già conosci." },
      s3: { title: "Accessibilità Reale", desc: "Interfaccia pulita, testi grandi e colori studiati per ridurre lo stress." },
      finalTitle: "Una conversazione serena, in ogni momento.",
      finalDesc: "Sherpa parla lentamente e mantiene le risposte brevi e chiare, proprio come farebbe un caregiver esperto.",
      imgAlt: "Persona anziana e caregiver interagiscono con serenità"
    },
    en: {
      heroTitle: "Your calm companion for Alzheimer's",
      heroDesc: "Sherpa is an intelligent assistant designed to speak calmly, repeat when needed, and offer daily support.",
      cta: "Start talking",
      ctaVoice: "Use voice 🎙️", // New label
      servicesTitle: "Our Services",
      s1: { title: "AI Companion", desc: "An always-available chatbot for simple and reassuring conversations." },
      s2: { title: "Messaging Channels", desc: "Talk to Sherpa on WhatsApp or Telegram, apps you already know." },
      s3: { title: "Truly Accessible", desc: "Clean interface, large text, and colors designed to reduce stress." },
      finalTitle: "A serene conversation, at any time.",
      finalDesc: "Sherpa speaks slowly and keeps answers short and clear, just like an expert caregiver would.",
      imgAlt: "Elderly person and caregiver interacting calmly"
    },
    es: {
      heroTitle: "Tu compañero tranquilo para el Alzheimer",
      heroDesc: "Sherpa es un asistente inteligente diseñado para hablar con calma, repetir cuando sea necesario y ofrecer apoyo diario.",
      cta: "Empezar a hablar",
      ctaVoice: "Usar voz 🎙️", // New label
      servicesTitle: "Nuestros Servicios",
      s1: { title: "Compañero AI", desc: "Un chatbot siempre disponible para conversaciones sencillas y tranquilizadoras." },
      s2: { title: "Canales de Mensajería", desc: "Habla con Sherpa en WhatsApp o Telegram, aplicaciones que ya conoces." },
      s3: { title: "Realmente Accesible", desc: "Interfaz limpia, textos grandes y colores diseñados para reducir el estrés." },
      finalTitle: "Una convesación serena, en cualquier momento.",
      finalDesc: "Sherpa habla despacio y mantiene las respuestas cortas y claras, tal como lo haría un cuidador experto.",
      imgAlt: "Persona mayor y cuidador interactuando con calma"
    }
  };

  const t = content[lang] || content['en'];

  const services = [
    { title: t.s1.title, desc: t.s1.desc, icon: '🧠' },
    { title: t.s2.title, desc: t.s2.desc, icon: '💬' },
    { title: t.s3.title, desc: t.s3.desc, icon: '♿' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header currentLang={lang} setLang={setLang} />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Side */}
            <div className="space-y-8 relative z-10 animate-fade-in-slow">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
                {t.heroDesc}
              </p>
              
              {/* BUTTON GROUP */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/chatbot">
                  <button className="w-full sm:w-auto px-10 py-5 text-xl font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition transform duration-300">
                    {t.cta}
                  </button>
                </Link>
                
                {/* NEW VOICE BUTTON */}
                <Link href="/voice">
                  <button className="w-full sm:w-auto px-10 py-5 text-xl font-bold rounded-2xl bg-white text-blue-600 border-2 border-blue-600 shadow-md hover:bg-blue-50 hover:-translate-y-1 transition transform duration-300">
                    {t.ctaVoice}
                  </button>
                </Link>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative">
              <div className="relative z-10 w-full aspect-square rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                <Image 
                  src="/hero-image.jpeg" 
                  alt={t.imgAlt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-100/50 blur-3xl rounded-full -z-0" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100/50 blur-3xl rounded-full -z-0" />
            </div>

          </div>
        </Container>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-24 bg-gradient-to-b from-transparent to-slate-50">
        <Container>
          <h2 className="text-4xl font-black mb-16 text-center text-gray-900">{t.servicesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard 
                key={index} 
                title={service.title} 
                description={service.desc} 
                icon={service.icon} 
              />
            ))}
          </div>
        </Container>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 via-sky-50 to-blue-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h3 className="text-3xl md:text-5xl font-extrabold text-emerald-900">
              {t.finalTitle}
            </h3>
            <p className="text-xl text-gray-700 leading-relaxed">
              {t.finalDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chatbot">
                <button className="px-12 py-5 text-xl font-bold rounded-2xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition">
                    {t.cta}
                </button>
                </Link>
                <Link href="/voice">
                <button className="px-12 py-5 text-xl font-bold rounded-2xl bg-white text-emerald-600 border-2 border-emerald-600 shadow-lg hover:bg-emerald-50 transition">
                    {t.ctaVoice}
                </button>
                </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer lang={lang} />
    </div>
  );
}