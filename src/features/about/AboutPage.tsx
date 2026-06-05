import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import {
  ClipboardList,
  Share2,
  DollarSign,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function AboutPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const privacyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      location.state &&
      (location.state as { scrollToPrivacy?: boolean }).scrollToPrivacy
    ) {
      privacyRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.state]);

  const steps = [
    { icon: ClipboardList, text: t('about.step1') },
    { icon: Share2, text: t('about.step2') },
    { icon: DollarSign, text: t('about.step3') },
    { icon: MessageCircle, text: t('about.step4') },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header title={t('about.title')} />

      <main className="max-w-lg mx-auto px-5 py-6 space-y-6">
        {/* App Info */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
            <ClipboardList className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">
            {t('app.name')}
          </h2>
          <p className="text-zinc-500 text-sm">{t('about.description')}</p>
        </div>

        <Separator />

        {/* How it Works */}
        <div>
          <h3 className="text-base font-semibold text-zinc-800 mb-4">
            {t('about.howItWorks')}
          </h3>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mt-0.5">
                  <step.icon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-green-600 block mb-0.5">
                    {index + 1}.
                  </span>
                  <p className="text-sm text-zinc-600">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Privacy Section */}
        <div ref={privacyRef}>
          <h3 className="text-base font-semibold text-zinc-800 mb-3">
            {t('privacy.title')}
          </h3>
          <p className="text-sm text-zinc-500 mb-3">{t('privacy.intro')}</p>
          <ul className="space-y-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n} className="flex items-start gap-2 text-sm text-zinc-600">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                {t(`privacy.point${n}`)}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Footer */}
        <div className="text-center space-y-1 pb-4">
          <p className="text-xs text-zinc-400">{t('about.version')}</p>
          <p className="text-sm text-zinc-500">{t('about.madeWith')}</p>
        </div>

        {/* Back Button */}
        <div className="pb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('invoice.back')}
          </Button>
        </div>
      </main>
    </div>
  );
}
