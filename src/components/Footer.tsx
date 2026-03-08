import logo from '@/assets/logo.png';

export default function Footer() {
  const year = new Date().getFullYear();
  const homeUrl = `${window.location.origin}${window.location.pathname}#/`;

  return (
    <footer className="w-full py-4 px-6 mt-auto border-t border-border/20">
      <a href={homeUrl} className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground font-body hover:text-foreground transition-colors">
        <div className="flex items-center gap-1.5">
          <img src={logo} alt="Social Link" className="w-4 h-4 rounded-sm" />
          <span>Created with <span className="font-heading font-bold">Social Link</span></span>
        </div>
        <span>© {year} Social Link. All rights reserved.</span>
      </a>
    </footer>
  );
}
