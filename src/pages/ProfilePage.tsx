import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PLATFORMS } from '@/lib/platforms';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, MessageCircle, Globe, User } from 'lucide-react';
import islamicPattern from '@/assets/islamic-pattern.png';

const ICON_MAP: Record<string, any> = {
  Facebook, Instagram, Linkedin, Youtube, Twitter, MessageCircle, Globe,
};

interface Profile {
  display_name: string;
  avatar_url: string | null;
}

interface SocialLink {
  platform: string;
  url: string;
  display_order: number | null;
}

export default function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    loadProfile();
  }, [slug]);

  const loadProfile = async () => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !profileData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setProfile({ display_name: profileData.display_name, avatar_url: profileData.avatar_url });

    const { data: linksData } = await supabase
      .from('social_links')
      .select('*')
      .eq('profile_id', profileData.id)
      .order('display_order');

    if (linksData) setLinks(linksData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-body animate-pulse">Loading...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">This link page doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getPlatformInfo = (platformKey: string) => {
    return PLATFORMS.find(p => p.key === platformKey);
  };

  return (
    <div className="min-h-screen px-4 py-8 relative">
      <img src={islamicPattern} alt="" className="fixed inset-0 w-full h-full object-cover opacity-[0.04] pointer-events-none" />
      <div className="max-w-md mx-auto relative z-10">
        {/* Profile header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg mb-4 bg-secondary flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-heading font-bold text-primary">
                {getInitials(profile?.display_name || '')}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-heading font-bold">{profile?.display_name}</h1>
          <div className="w-16 h-0.5 bg-primary/40 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link, i) => {
            const info = getPlatformInfo(link.platform);
            if (!info) return null;
            const IconComp = ICON_MAP[info.icon] || Globe;
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Button variant="social-link" className="w-full h-14 text-base justify-start px-6 animate-fade-in" asChild>
                  <span>
                    <IconComp className="w-5 h-5 mr-3 text-primary" />
                    {info.label}
                  </span>
                </Button>
              </a>
            );
          })}
        </div>

        {links.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No links added yet.</p>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-xs text-muted-foreground">
          <p>✦ Powered by <span className="font-heading font-bold">LinkNoor</span> ✦</p>
        </div>
      </div>
    </div>
  );
}
