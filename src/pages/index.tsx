import Link from 'next/link';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { Heading } from '../components/Heading';
import { ServiceCard } from '../components/ServiceCard';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../utils/translations';

export default function Home() {
  const { lang, changeLanguage } = useLanguage();
  const t = translations[lang].home; 

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLang={lang} setLang={changeLanguage} />
      
      <main className="flex-grow">
        <section className="bg-brand-secondary py-20 border-b-4 border-white">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <Heading title={t.heroTitle} level={1} />
              <p className="text-xl text-brand-text mb-10 mt-4 opacity-90">
                {t.heroDesc}
              </p>
              <Link href="/chatbot" className="inline-block bg-brand-primary text-white text-2xl font-black px-12 py-6 rounded-2xl shadow-lg hover:scale-105 transition-all">
                {t.ctaMain}
              </Link>
            </div>
          </Container>
        </section>

        <section className="py-20 bg-white">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-brand-text mb-4 italic">{t.gridTitle}</h2>
              <p className="text-xl text-gray-600">{t.gridDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/chatbot"><ServiceCard icon="🤖" title={t.chatTitle} description={t.chatDesc} /></Link>
              <Link href="/telegram"><ServiceCard icon="🔹" title={t.teleTitle} description={t.teleDesc} /></Link>
              <Link href="/whatsapp"><ServiceCard icon="🟢" title={t.waTitle} description={t.waDesc} /></Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}