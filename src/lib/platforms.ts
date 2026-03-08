export const PLATFORMS = [
  { key: 'facebook', label: 'Facebook', icon: 'Facebook', placeholder: 'https://facebook.com/yourprofile' },
  { key: 'instagram', label: 'Instagram', icon: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'Linkedin', placeholder: 'https://linkedin.com/in/yourprofile' },
  { key: 'youtube', label: 'YouTube', icon: 'Youtube', placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'twitter', label: 'X / Twitter', icon: 'Twitter', placeholder: 'https://x.com/yourhandle' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle', placeholder: 'https://wa.me/yourphonenumber' },
  { key: 'website', label: 'Website', icon: 'Globe', placeholder: 'https://yourwebsite.com' },
] as const;

export type PlatformKey = typeof PLATFORMS[number]['key'];
