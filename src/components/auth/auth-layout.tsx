import { Bot } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md animate-in bg-card/75 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-primary/20">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
            <Bot className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight bg-gradient-to-br from-primary via-primary/80 to-foreground/80 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
