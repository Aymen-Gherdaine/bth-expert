interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[var(--container-max)] px-6 lg:px-12 xl:px-20 ${className}`}>
      {children}
    </div>
  );
}