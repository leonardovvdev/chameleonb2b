type IconProps = {
  className?: string;
};

export const iconCatalog = ({ className }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      {/* Book */}
      <path
        d="M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H19A1 1 0 0 1 20 3V21A1 1 0 0 1 19 22H6.5A1 1 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Shopping cart */}
      <path
        d="M8 5.5H9.3L10.4 11H15.6L16.6 7.2H9.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cart wheels */}
      <circle cx="11.2" cy="13.4" r="0.7" fill="currentColor" />
      <circle cx="14.9" cy="13.4" r="0.7" fill="currentColor" />

      {/* Bookmark */}
      <path
        d="M15.5 17V20.8L17 19.8L18.5 20.8V17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};