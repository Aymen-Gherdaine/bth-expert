interface CardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export function Card({ children, className = "", bordered = false }: CardProps) {
  const border = bordered
    ? "border border-line rounded-md"
    : "border-b border-line";

  return (
    <div className={`${border} ${className}`}>
      {children}
    </div>
  );
}
