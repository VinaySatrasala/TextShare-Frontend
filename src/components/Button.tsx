// Button.tsx
interface ButtonProps {
    type: "button" | "submit" | "reset";
    className?: string;
    onClick?: () => void;
    children:React.ReactNode
  }
  
  const Button: React.FC<ButtonProps> = ({
    type,
    className = "",
    onClick,
    children,
  }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`py-2 px-4 rounded-full text-center transition duration-200 ease-in-out ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  