import { Link } from "@tanstack/react-router";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  subtitle?: string;
  noLink?: boolean;
}

export function Logo({ 
  className = "", 
  showText = true, 
  size = "md", 
  subtitle,
  noLink = false 
}: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "h-6 w-6 rounded-lg text-xs",
      text: "text-lg",
      subtitle: "text-[10px]",
      gap: "gap-1.5"
    },
    md: {
      container: "h-8 w-8 rounded-xl text-sm",
      text: "text-xl",
      subtitle: "text-xs",
      gap: "gap-2"
    },
    lg: {
      container: "h-12 w-12 rounded-2xl text-lg",
      text: "text-3xl",
      subtitle: "text-sm",
      gap: "gap-3"
    },
    xl: {
      container: "h-16 w-16 rounded-[2rem] text-2xl",
      text: "text-4xl",
      subtitle: "text-base",
      gap: "gap-4"
    }
  };

  const currentSize = sizeClasses[size];

  const content = (
    <div className={`flex items-center ${currentSize.gap} group transition-all ${className}`}>
      <span className={`flex ${currentSize.container} shrink-0 items-center justify-center bg-indigo-600 text-white font-bold text-shadow-sm shadow-md shadow-indigo-600/20 rounded-lg overflow-hidden`}>
        EA
      </span>
      {showText && (
        <div className="flex flex-col">
          <p className={`${currentSize.text} font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-indigo-600 dark:from-white dark:via-indigo-300 dark:to-indigo-500 leading-none`}>
            Eazy<span className="text-indigo-600 dark:text-indigo-400 font-black">AI</span>
          </p>
          {subtitle && (
            <span className={`${currentSize.subtitle} text-muted-foreground font-medium mt-0.5 leading-none`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (noLink) {
    return content;
  }

  return (
    <Link to="/" className="group cursor-pointer hover:opacity-90 transition-opacity">
      {content}
    </Link>
  );
}
