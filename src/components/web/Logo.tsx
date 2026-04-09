import { Link } from "@tanstack/react-router";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "h-6 w-6 rounded-lg text-sm",
      text: "text-lg",
      gap: "gap-1.5"
    },
    md: {
      container: "h-8 w-8 rounded-xl text-base",
      text: "text-xl",
      gap: "gap-2"
    },
    lg: {
      container: "h-12 w-12 rounded-2xl text-xl",
      text: "text-3xl",
      gap: "gap-3"
    },
    xl: {
      container: "h-16 w-16 rounded-[2rem] text-2xl",
      text: "text-4xl",
      gap: "gap-4"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <Link to="/" className={`flex items-center ${currentSize.gap} group cursor-pointer hover:opacity-90 transition-opacity ${className}`}>
      <span className={`flex ${currentSize.container} items-center justify-center bg-indigo-600 text-white font-bold text-shadow-sm shadow-md shadow-indigo-600/20`}>
        EI
      </span>
      {showText && (
        <p className={`${currentSize.text} font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-indigo-600 dark:from-white dark:via-indigo-300 dark:to-indigo-500`}>
          Eazy<span className="text-indigo-600 dark:text-indigo-400 font-black">AI</span>
        </p>
      )}
    </Link>
  );
}
