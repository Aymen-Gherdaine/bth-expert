interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 1 C 4 8, 4 22, 12 29 C 20 22, 20 8, 12 1 Z"
        fill="currentColor"
      />
      <g stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" opacity="0.32">
        <line x1="5.5" y1="11" x2="18.5" y2="11" />
        <line x1="4.5" y1="15.5" x2="19.5" y2="15.5" />
        <line x1="5.5" y1="20" x2="18.5" y2="20" />
      </g>
      <line
        x1="12"
        y1="29"
        x2="12"
        y2="31.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
