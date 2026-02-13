interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const AccessibleButton = ({ text, onClick, variant = 'primary' }: ButtonProps) => {
  const styles = variant === 'primary' 
    ? "bg-blue-700 text-white shadow-lg" 
    : "border-4 border-blue-700 text-blue-700 bg-white";

  return (
    <button 
      onClick={onClick}
      className={`${styles} w-full sm:w-auto px-8 py-4 rounded-2xl text-xl font-bold transition-transform active:scale-95 hover:brightness-110`}
    >
      {text}
    </button>
  );
};