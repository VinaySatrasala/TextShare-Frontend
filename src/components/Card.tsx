// Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string; // Optional custom class for additional styling
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md ${className} transform transition-all duration-700 ease-in-out`}
    >
      {children}
    </div>
  );
};

export default Card;
