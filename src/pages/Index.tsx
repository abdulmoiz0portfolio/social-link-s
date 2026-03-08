import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Zap, Share2, Smartphone } from 'lucide-react';
import logo from '@/assets/logo.png';
import Footer from '@/components/Footer';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (!loading && user) {
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="text-center relative z-10 max-w-xl w-full animate-fade-in">
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent text-accent-foreground mb-6 shadow-lg overflow-hidden">
              <img src={logo} alt="Social Link" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-none mb-4">
              Social Link
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed max-w-md mx-auto">
              All your links in one beautiful page.<br />Share it with the world.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: Zap, label: 'Lightning Fast' },
              { icon: Share2, label: 'Easy Sharing' },
              { icon: Smartphone, label: 'Mobile First' },
            ].map(f => (
              <span key={f.label} className="inline-flex items-center gap-2 text-sm bg-card/60 backdrop-blur-sm border border-foreground/10 px-5 py-2.5 rounded-full text-foreground font-body font-medium">
                <f.icon className="w-4 h-4" />
                {f.label}
              </span>
            ))}
          </div>

          <div className="space-y-3 max-w-xs mx-auto w-full">
            <Button variant="gold" size="lg" className="w-full" onClick={() => navigate('/auth')}>
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/guest')}>
              Continue as Guest
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
