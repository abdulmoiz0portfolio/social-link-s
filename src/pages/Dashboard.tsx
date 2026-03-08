import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PLATFORMS } from '@/lib/platforms';
import { LogOut, ExternalLink, Copy, Link2 } from 'lucide-react';
import AvatarUpload from '@/components/AvatarUpload';
import Footer from '@/components/Footer';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [links, setLinks] = useState<Record<string, string>>({});
  const [profileId, setProfileId] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data: profile } = await supabase
      .from('profiles').select('*').eq('user_id', user!.id).maybeSingle();

    if (profile) {
      setProfileId(profile.id);
      setName(profile.display_name);
      setAvatarUrl(profile.avatar_url || '');
      setSlug(profile.slug);

      const { data: socialLinks } = await supabase
        .from('social_links').select('*').eq('profile_id', profile.id).order('display_order');

      if (socialLinks) {
        const linksMap: Record<string, string> = {};
        socialLinks.forEach(l => { linksMap[l.platform] = l.url; });
        setLinks(linksMap);
      }
    }
    setInitialLoading(false);
  };

  const handleLinkChange = (key: string, value: string) => {
    setLinks(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Display Name is required'); return; }
    setLoading(true);

    const newSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    if (profileId) {
      await supabase.from('profiles').update({ display_name: name.trim(), avatar_url: avatarUrl || null }).eq('id', profileId);
      await supabase.from('social_links').delete().eq('profile_id', profileId);
    } else {
      const { data: profile, error } = await supabase.from('profiles').insert({
        user_id: user!.id, display_name: name.trim(), email: user!.email, avatar_url: avatarUrl || null, slug: newSlug, is_guest: false,
      }).select().single();

      if (error || !profile) { toast.error('Failed to create profile'); setLoading(false); return; }
      setProfileId(profile.id);
      setSlug(profile.slug);
    }

    const currentProfileId = profileId || (await supabase.from('profiles').select('id').eq('user_id', user!.id).single()).data?.id;
    const activeLinks = Object.entries(links).filter(([_, url]) => url.trim());
    if (activeLinks.length > 0 && currentProfileId) {
      await supabase.from('social_links').insert(
        activeLinks.map(([platform, url], i) => ({ profile_id: currentProfileId, platform, url: url.trim(), display_order: i }))
      );
    }

    toast.success('Profile saved!');
    if (!slug) setSlug(newSlug);
    setLoading(false);
  };

  const handleLogout = async () => { await signOut(); navigate('/'); };

  if (initialLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground font-body">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-6 py-8">
        <div className="max-w-lg mx-auto relative z-10">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
            </div>
            <div className="flex gap-2">
              {slug && (
                <>
                  <Button variant="outline" size="sm" onClick={() => {
                    const url = `${window.location.origin}${window.location.pathname}#/p/${slug}`;
                    navigator.clipboard.writeText(url);
                    toast.success('Link copied!');
                  }}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/p/${slug}`)}>
                    <ExternalLink className="w-4 h-4 mr-1" /> View
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 shadow-lg space-y-6">
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold">Profile Information</h3>
              
              <AvatarUpload currentUrl={avatarUrl} onUploaded={setAvatarUrl} displayName={name} />

              <div>
                <Label htmlFor="name">Display Name *</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your display name" required autoComplete="name" />
              </div>
              <div>
                <Label htmlFor="avatar-url" className="text-xs text-muted-foreground">Or paste an image URL</Label>
                <Input id="avatar-url" type="url" inputMode="url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://example.com/photo.jpg" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold">Social Links</h3>
              <p className="text-sm text-muted-foreground">Fill only the links you want to display.</p>
              {PLATFORMS.map(p => (
                <div key={p.key}>
                  <Label htmlFor={p.key}>{p.label}</Label>
                  <Input id={p.key} type="url" inputMode="url" value={links[p.key] || ''} onChange={e => handleLinkChange(p.key, e.target.value)} placeholder={p.placeholder} />
                </div>
              ))}
            </div>

            <Button type="submit" variant="gold" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
