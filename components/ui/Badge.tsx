interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block text-[length:var(--text-caption)] uppercase tracking-widest text-muted border border-line px-2 py-0.5 rounded-sm ${className}`}
    >
      {children}
    </span>
  );
}
