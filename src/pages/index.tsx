import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { Heading } from '../components/Heading';
import { ServiceCard } from '../components/ServiceCard';

export default function Home() {
  const [lang, setLang] = useState<'it' | 'en'>('it');

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLang={lang} setLang={setLang} />
      
      <main className="flex-grow py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <Heading title={lang === 'it' ? "I nostri servizi" : "Our services"} level={1} />
          </div>

          {/* Adaptable grid for different device */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon="🎨" 
              title={lang === 'it' ? "Design Chiaro" : "Clear Design"} 
              description={lang === 'it' ? "Usiamo colori e font facili da leggere." : "We use colors and fonts that are easy to read."} 
            />
            <ServiceCard 
              icon="🌍" 
              title={lang === 'it' ? "Multi-lingua" : "Multi-language"} 
              description={lang === 'it' ? "Scegli la lingua che preferisci." : "Choose the language you prefer."} 
            />
            <ServiceCard 
              icon="📱" 
              title={lang === 'it' ? "Per tutti i dispositivi" : "For all devices"} 
              description={lang === 'it' ? "Funziona bene su telefoni e computer." : "Works great on phones and computers."} 
            />
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}