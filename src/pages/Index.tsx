import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import islamicPattern from '@/assets/islamic-pattern.png';
import { ArrowRight, Link2, Sparkles } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (!loading && user) {
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <img src={islamicPattern} alt="" className="fixed inset-0 w-full h-full object-cover opacity-[0.04] pointer-events-none" />
      
      <div className="text-center relative z-10 max-w-lg animate-fade-in">
        {/* Logo area */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 mb-4">
            <Link2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-heading font-bold mb-3">LinkNoor</h1>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            Your elegant, all-in-one link page.<br />Share your world beautifully.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {['Beautiful Design', 'All Your Links', 'Easy to Share'].map(f => (
            <span key={f} className="inline-flex items-center gap-1.5 text-sm bg-secondary px-4 py-2 rounded-full text-secondary-foreground font-body">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button variant="gold" size="lg" className="w-full max-w-xs text-base" onClick={() => navigate('/auth')}>
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" size="lg" className="w-full max-w-xs text-base" onClick={() => navigate('/guest')}>
            Continue as Guest
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-muted-foreground font-body">
        ✦ Crafted with elegance ✦
      </div>
    </div>
  );
}
