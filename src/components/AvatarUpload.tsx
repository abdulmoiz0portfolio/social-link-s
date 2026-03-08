import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentUrl: string;
  onUploaded: (url: string) => void;
  displayName?: string;
}

export default function AvatarUpload({ currentUrl, onUploaded, displayName }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabase.storage.from('avatars').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      toast.error('Upload failed. Please try again.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
    onUploaded(publicUrl);
    toast.success('Photo uploaded!');
    setUploading(false);
  };

  const handleRemove = () => {
    onUploaded('');
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent/30 shadow-lg bg-card flex items-center justify-center">
          {currentUrl ? (
            <img src={currentUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-heading font-bold text-foreground">
              {displayName ? getInitials(displayName) : <Camera className="w-8 h-8 text-muted-foreground" />}
            </span>
          )}
        </div>

        {uploading && (
          <div className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-foreground" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Camera className="w-4 h-4 mr-1" />
          {currentUrl ? 'Change Photo' : 'Upload Photo'}
        </Button>
        {currentUrl && (
          <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
            <X className="w-4 h-4 mr-1" /> Remove
          </Button>
        )}
      </div>
    </div>
  );
}
