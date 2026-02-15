import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { FeatureCard } from '../components/FeatureCard'; // Updated component
import { SupportedLang } from './chatbot';

export default function Home() {
  const [lang, setLang] = useState<SupportedLang>('it');

  const content = {
    it: {
      heroTitle: "Il tuo compagno calmo per l'Alzheimer",
      heroDesc: "Sherpa è un assistente intelligente progettato per parlare con calma, ripetere quando serve e offrire supporto quotidiano.",
      cta: "Inizia a parlare",
      ctaTelegram: "Usa Telegram ✈️",
      servicesTitle: "I nostri canali di supporto",
      s1: { title: "Sherpa Web AI", desc: "Parla direttamente con la nostra intelligenza artificiale avanzata con supporto vocale calmo." },
      s2: { title: "Sherpa Telegram", desc: "Accedi all'assistente tramite Telegram per risposte rapide e promemoria mentre sei in giro." },
      s3: { title: "Sherpa WhatsApp", desc: "Il modo più semplice per restare in contatto. Usa Sherpa direttamente su WhatsApp." },
      finalTitle: "Una conversazione serena, in ogni momento.",
      finalDesc: "Sherpa parla lentamente e mantiene le risposte brevi e chiare, proprio come farebbe un caregiver esperto.",
      imgAlt: "Persona anziana e caregiver interagiscono con serenità"
    },
    en: {
      heroTitle: "Your calm companion for Alzheimer's",
      heroDesc: "Sherpa is an intelligent assistant designed to speak calmly, repeat when needed, and offer daily support.",
      cta: "Start talking",
      ctaTelegram: "Use Telegram ✈️",
      servicesTitle: "Our Support Channels",
      s1: { title: "Sherpa Web AI", desc: "Speak directly with our advanced AI featuring calm voice support." },
      s2: { title: "Sherpa Telegram", desc: "Access the assistant via Telegram for quick answers and reminders on the go." },
      s3: { title: "Sherpa WhatsApp", desc: "The easiest way to stay in touch. Use Sherpa directly on WhatsApp." },
      finalTitle: "A serene conversation, at any time.",
      finalDesc: "Sherpa speaks slowly and keeps answers short and clear, just like an expert caregiver would.",
      imgAlt: "Elderly person and caregiver interacting calmly"
    },
    es: {
      heroTitle: "Tu compañero tranquilo para el Alzheimer",
      heroDesc: "Sherpa es un asistente inteligente diseñado para hablar con calma, repetir cuando sea necesario y ofrecer apoyo diario.",
      cta: "Empezar a hablar",
      ctaTelegram: "Usar Telegram ✈️",
      servicesTitle: "Nuestros canales de soporte",
      s1: { title: "Sherpa Web AI", desc: "Habla directamente con nuestra IA avanzada con soporte de voz calmado." },
      s2: { title: "Sherpa Telegram", desc: "Accede al asistente vía Telegram para respuestas rápidas y recordatorios." },
      s3: { title: "Sherpa WhatsApp", desc: "La forma más fácil de estar en contacto. Usa Sherpa directamente en WhatsApp." },
      finalTitle: "Una convesación serena, en cualquier momento.",
      finalDesc: "Sherpa habla despacio y mantiene las respuestas cortas y claras, tal como lo haría un cuidador experto.",
      imgAlt: "Persona mayor y cuidador interactuando con calma"
    }
  };

  const t = content[lang] || content['en'];

  // Data for the three main cards
  const platforms = [
    { title: t.s1.title, desc: t.s1.desc, icon: '🤖', href: '/chatbot', color: 'bg-blue-50 text-blue-600' },
    { title: t.s2.title, desc: t.s2.desc, icon: '✈️', href: '/telegram', color: 'bg-sky-50 text-sky-500' },
    { title: t.s3.title, desc: t.s3.desc, icon: '💬', href: '/whatsapp', color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header currentLang={lang} setLang={setLang} />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8 relative z-10 animate-fade-in-slow">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight tracking-tighter">
                {t.heroTitle}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed font-medium">
                {t.heroDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/chatbot">
                  <button className="w-full sm:w-auto px-10 py-5 text-xl font-bold rounded-2xl bg-blue-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition transform duration-300">
                    {t.cta}
                  </button>
                </Link>
                
                <Link href="/telegram">
                  <button className="w-full sm:w-auto px-10 py-5 text-xl font-bold rounded-2xl bg-white text-sky-600 border-2 border-sky-100 shadow-sm hover:bg-sky-50 hover:-translate-y-1 transition transform duration-300">
                    {t.ctaTelegram}
                  </button>
                </Link>
              </div>
            </div>

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

      {/* SERVICES GRID SECTION */}
      <section className="py-24 bg-slate-50/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">{t.servicesTitle}</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((p, index) => (
              <FeatureCard 
                key={index}
                title={p.title}
                description={p.desc}
                icon={p.icon}
                href={p.href}
                color={p.color}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 via-sky-50 to-blue-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h3 className="text-3xl md:text-5xl font-black text-slate-800">
              {t.finalTitle}
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              {t.finalDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/chatbot">
                  <button className="px-12 py-5 text-xl font-bold rounded-2xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition">
                      {t.cta}
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