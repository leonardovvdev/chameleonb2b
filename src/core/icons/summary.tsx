type IconProps = {
  className?: string;
};

export const iconSummary = ({ className }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      {/* Document */}
      <path
        d="M8 15H6.5A1.5 1.5 0 0 1 5 13.5V4.5A1.5 1.5 0 0 1 6.5 3H17.5A1.5 1.5 0 0 1 19 4.5V13.5A1.5 1.5 0 0 1 17.5 15H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pie chart (main slice) */}
      <path
        d="M9.5 6.2A2.8 2.8 0 1 0 12.3 9H9.5V6.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pie chart (separated slice) */}
      <path
        d="M11.2 5.4A2.8 2.8 0 0 1 13.4 7.6H11.2V5.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Text lines */}
      <path
        d="M14.5 6H16.5M14.5 9H16.5M8 12H16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Left hand */}
      <path
        d="M8 15V19.5H6.8L4.5 19L3.5 15.5L5 12.5L6 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right hand */}
      <path
        d="M16 15V19.5H17.2L19.5 19L20.5 15.5L19 12.5L18 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};