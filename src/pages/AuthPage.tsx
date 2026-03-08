import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Link2 } from 'lucide-react';
import Footer from '@/components/Footer';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) toast.error(error.message);
      else {
        toast.success('Account created!');
        navigate('/dashboard');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
      else navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-accent text-accent-foreground text-center py-8 px-6 rounded-t-3xl">
            <Link2 className="w-8 h-8 mx-auto mb-2" />
            <h1 className="text-3xl font-heading font-bold">Social Link</h1>
            <p className="mt-1 text-sm opacity-80 font-body">Your link hub</p>
          </div>

          <div className="glass-card rounded-b-3xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-heading font-bold text-center mb-6">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete={isSignUp ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
              <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-2">
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/30"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card/60 px-3 text-muted-foreground">or</span></div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => navigate('/guest')}>
              Continue as Guest
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
