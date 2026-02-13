import { useEffect } from 'react';

export const LanguageTranslator = () => {
  useEffect(() => {
    const initTranslate = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'it',
          includedLanguages: 'it,en,fr,de,es,zh-CN,ar,ru,ja',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        }, 'google_translate_element');
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const addScript = document.createElement('script');
      addScript.id = 'google-translate-script';
      addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
      document.body.appendChild(addScript);
      (window as any).googleTranslateElementInit = initTranslate;
    } else {
      initTranslate();
    }
  }, []);

  return (
    <div className="flex items-center gap-2 bg-brand-secondary p-2 rounded-xl border-2 border-brand-primary min-w-[150px]">
      <span className="text-sm font-bold text-brand-primary">🌐</span>
      <div id="google_translate_element" className="translate-select-container"></div>
    </div>
  );
};