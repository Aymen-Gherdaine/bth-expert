import Link from "next/link";

const variants = {
  primary:
    "bg-brand text-cream hover:bg-brand-soft",
  secondary:
    "border border-line text-ink hover:border-brand hover:text-brand",
  ghost:
    "text-ink-soft hover:text-brand",
  "outline-cream":
    "border border-cream/25 text-cream hover:border-cream hover:bg-cream hover:text-brand",
  "ghost-cream":
    "text-cream/60 hover:text-cream",
} as const;

const sizes = {
  default: "px-6 py-3 text-[0.9375rem]",
  sm:      "px-4 py-2 text-[0.8125rem]",
} as const;

const base =
  "inline-flex items-center justify-center font-medium tracking-tight rounded-sm transition-[background-color,color,border-color] duration-300 ease-[var(--ease-out-expo)]";

type LinkProps = {
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
};

type NativeProps = {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

type ButtonProps = (LinkProps | NativeProps) & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: React.ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "default",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }

  const { href: _href, ...nativeProps } = props as NativeProps & { href?: never };
  return (
    <button className={cls} {...nativeProps}>
      {children}
    </button>
  );
}
