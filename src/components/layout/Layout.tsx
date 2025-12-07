import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ParticleBackground } from '@/components/effects/ParticleBackground';
import { ChatBot } from '@/components/chat/ChatBot';
import { BackToTop } from '@/components/ui/back-to-top';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 relative z-10 pt-20">
        {children}
      </main>
      <Footer />
      <ChatBot />
      <BackToTop />
    </div>
  );
};
