type IconProps = {
  className?: string
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 4h2l1 2.6M6.6 6.6h13.4l-1.7 8H8.3z" />
      <circle cx="9.5" cy="19.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="19.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}
