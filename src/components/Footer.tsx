import { Link2, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-4 px-6 mt-auto border-t border-border/20">
      <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground font-body">
        <div className="flex items-center gap-1.5">
          <Link2 className="w-3 h-3" />
          <span>Created with <span className="font-heading font-bold text-foreground">Social Link</span></span>
        </div>
        <div className="flex items-center gap-1">
          <span>© {year} Social Link. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
