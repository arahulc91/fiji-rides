interface HeroBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroBackground({ children, className = '' }: Readonly<HeroBackgroundProps>) {
  return (
    <div className={`relative isolate min-h-screen max-h-[120vh] pt-16 flex items-center justify-center ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-secondary">
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(circle at top right, #0EB981 0%, transparent 50%)'
          }}
        />
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(circle at bottom left, #0A8B61 0%, transparent 50%)'
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* Content with overflow handling */}
      <div className="relative z-10 w-full max-h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 