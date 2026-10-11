import React from "react";
import { PartnerType } from "@/lib/types";

interface IconProps {
  className?: string;
}

export function SukoonLogoIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="28" height="28" rx="8" fill="#0F766E" />
      <path
        d="M14 5.5C14 5.5 8 12.1 8 16.5C8 19.8137 10.6863 22.5 14 22.5C17.3137 22.5 20 19.8137 20 16.5C20 12.1 14 5.5 14 5.5Z"
        stroke="#FAF8F5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 16.5L13.2 18.2L16.8 14.5"
        stroke="#99F6E4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerifiedSealIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L14.8 4.5L18.5 4.2L19.5 7.8L22.5 9.8L21.2 13.3L22.5 16.8L19.5 18.8L18.5 22.4L14.8 22.1L12 24.6L9.2 22.1L5.5 22.4L4.5 18.8L1.5 16.8L2.8 13.3L1.5 9.8L4.5 7.8L5.5 4.2L9.2 4.5L12 2Z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M9 12.5L11 14.5L15.5 10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ShieldIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3L4 6.5V12C4 16.8 7.4 20.8 12 22C16.6 20.8 20 16.8 20 12V6.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.2L11.2 13.9L14.8 10.3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WaterDropIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3C12 3 5.5 10.2 5.5 15C5.5 18.6 8.4 21.5 12 21.5C15.6 21.5 18.5 18.6 18.5 15C18.5 10.2 12 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M8 11V7.5C8 5.29086 9.79086 3.5 12 3.5C14.2091 3.5 16 5.29086 16 7.5V11"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function SparkleCleanIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3L13.8 8.7L19.5 10.5L13.8 12.3L12 18L10.2 12.3L4.5 10.5L10.2 8.7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 16L19.7 18.3L22 19L19.7 19.7L19 22L18.3 19.7L16 19L18.3 18.3L19 16Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BabyChangeIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7 15.5C7 12.8 9.2 11 12 11C14.8 11 17 12.8 17 15.5V17H7V15.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4 20H20"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ClockIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.5V12L15 13.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PartnerTypeIcon({
  type,
  className = "w-4 h-4",
}: {
  type: PartnerType;
  className?: string;
}) {
  if (type === "cafe") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M5 8H16V14C16 17.0376 13.5376 19.5 10.5 19.5C7.46243 19.5 5 17.0376 5 14V8Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M16 9.5H18C19.3807 9.5 20.5 10.6193 20.5 12C20.5 13.3807 19.3807 14.5 18 14.5H16"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M4 21H17"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "petrol_pump") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect
          x="5"
          y="4"
          width="10"
          height="16"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M5 10H15" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M15 8L18.5 11V17C18.5 17.8 19.2 18.5 20 18.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M3.5 20H16.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "mall") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M4 20V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V20"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M2.5 20H21.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9.5 20V14.5H14.5V20"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 8.5H10M14 8.5H16M8 11.5H10M14 11.5H16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 9L5.5 4.5H18.5L20 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4 9C4 10.6569 5.34315 12 7 12C8.65685 12 10 10.6569 10 9C10 10.6569 11.3431 12 13 12C14.6569 12 16 10.6569 16 9C16 10.6569 17.3431 12 19 12C19.3506 12 19.6872 11.9398 20 11.8293V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function StarIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function QrCodeIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3.5"
        y="3.5"
        width="6.5"
        height="6.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="14"
        y="3.5"
        width="6.5"
        height="6.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="3.5"
        y="14"
        width="6.5"
        height="6.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M14 14H17V17H14V14ZM17 17H20.5V20.5H17V17ZM14 20.5H15.5M20.5 14V15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DirectionsIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12.7 3.3C12.3 2.9 11.7 2.9 11.3 3.3L3.3 11.3C2.9 11.7 2.9 12.3 3.3 12.7L11.3 20.7C11.7 21.1 12.3 21.1 12.7 20.7L20.7 12.7C21.1 12.3 21.1 11.7 20.7 11.3L12.7 3.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9.5 14V11.5C9.5 10.9477 9.94772 10.5 10.5 10.5H14.5M14.5 10.5L12.5 8.5M14.5 10.5L12.5 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlayIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M6.3 3.8C5.5 3.3 4.5 3.9 4.5 4.8V15.2C4.5 16.1 5.5 16.7 6.3 16.2L15.1 11C15.9 10.5 15.9 9.5 15.1 9L6.3 3.8Z" />
    </svg>
  );
}

export function CheckCircleIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.18" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 12.3L10.8 14.6L15.5 9.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MapPinIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21C12 21 18.5 15.2 18.5 10C18.5 6.41015 15.5899 3.5 12 3.5C8.41015 3.5 5.5 6.41015 5.5 10C5.5 15.2 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
