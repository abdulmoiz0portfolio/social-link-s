import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PLATFORMS } from '@/lib/platforms';
import { Link2 } from 'lucide-react';

export default function GuestPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [links, setLinks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleLinkChange = (key: string, value: string) => {
    setLinks(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and Email are required');
      return;
    }

    setLoading(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({ display_name: name.trim(), email: email.trim(), avatar_url: avatarUrl || null, slug, is_guest: true })
      .select()
      .single();

    if (profileError) {
      toast.error('Failed to create profile');
      setLoading(false);
      return;
    }

    const activeLinks = Object.entries(links).filter(([_, url]) => url.trim());
    if (activeLinks.length > 0) {
      await supabase.from('social_links').insert(
        activeLinks.map(([platform, url], i) => ({
          profile_id: profile.id,
          platform,
          url: url.trim(),
          display_order: i,
        }))
      );
    }

    toast.success('Your link page is ready!');
    navigate(`/p/${profile.slug}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto relative z-10">
        <div className="bg-accent text-accent-foreground text-center py-6 px-6 rounded-t-3xl">
          <Link2 className="w-6 h-6 mx-auto mb-1" />
          <h1 className="text-2xl font-heading font-bold">Guest Profile</h1>
          <p className="mt-1 text-sm opacity-80 font-body">Create your link page</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-b-3xl p-6 shadow-lg space-y-6">
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold">Your Information</h3>
            <div>
              <Label htmlFor="name">Display Name *</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="rounded-xl" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="rounded-xl" />
            </div>
            <div>
              <Label htmlFor="avatar">Profile Picture URL (optional)</Label>
              <Input id="avatar" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://example.com/photo.jpg" className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold">Social Links</h3>
            <p className="text-sm text-muted-foreground">Fill only the links you want to display.</p>
            {PLATFORMS.map(p => (
              <div key={p.key}>
                <Label htmlFor={p.key}>{p.label}</Label>
                <Input id={p.key} value={links[p.key] || ''} onChange={e => handleLinkChange(p.key, e.target.value)} placeholder={p.placeholder} className="rounded-xl" />
              </div>
            ))}
          </div>

          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create My Link Page'}
          </Button>
        </form>
      </div>
    </div>
  );
}
