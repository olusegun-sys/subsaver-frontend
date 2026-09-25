import { CreditCard } from 'lucide-react';

/**
 * SubSaver Logo — distinctive mark representing "cancel hidden subscriptions".
 *
 * Concept: circular badge with a diagonal cut (like a "remove" symbol) + coins.
 * Renders in pure SVG so it scales cleanly from 16px to 200px.
 *
 * Props:
 *   size      — number (px), default 36
 *   showText  — boolean, default true (renders "SubSaver" next to mark)
 *   textSize  — 'sm' | 'md' | 'lg' | 'xl', default 'md'
 */
export default function Logo({ size = 36, showText = true, textSize = 'md' }) {
  // WHY: Map text size prop to Tailwind classes so the same logo works in nav,
  // hero, footer, login card — all without duplicating markup.
  const textClass = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl sm:text-4xl',
  }[textSize] || 'text-lg sm:text-xl';

  return (
    <div className="flex items-center gap-2.5">
      {/* WHY: SVG badge — rounded square with gradient, diagonal cut, two coin dots. */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SubSaver logo"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/* WHY: Same blue gradient used in buttons and hero cards for consistency */}
          <linearGradient id="subsaverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Rounded square background */}
        <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#subsaverGrad)" />

        {/* Diagonal cut — signals cancellation */}
        <path
          d="M 12 12 L 28 28"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Bigger coin (subscription we found) */}
        <circle cx="14" cy="14" r="3.5" fill="#ffffff" />

        {/* Smaller coin (subscription we cut) */}
        <circle cx="26" cy="26" r="2.5" fill="#ffffff" opacity="0.6" />
      </svg>

      {/* Brand text — blue to match the mark */}
      {showText && (
        <span className={`font-bold tracking-tight text-blue-600 ${textClass}`}>
          SubSaver
        </span>
      )}
    </div>
  );
}

/** Alternative smaller mark — just the SVG, no text. */
export function LogoMark({ size = 32 }) {
  return <Logo size={size} showText={false} />;
}