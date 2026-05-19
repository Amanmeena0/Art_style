import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 512 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="512" height="512" rx="128" fill="#3a5a40"/>
      <path d="M256 120C256 120 160 180 160 280C160 380 256 420 256 420C256 420 352 380 352 280C352 180 256 120 256 120Z" fill="#fff8f6" fill-opacity="0.2"/>
      <path d="M256 160V380M256 160C256 160 210 210 180 260C150 310 160 340 160 340M256 160C256 160 302 210 332 260C362 310 352 340 352 340" stroke="#fff8f6" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="256" cy="160" r="24" fill="#fff8f6"/>
    </svg>
  );
};
