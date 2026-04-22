// Macro Logo Component
export default function MacroLogoWithFallback({ className = "w-10 h-10" }) {
  return (
    <img
      src="/logo.svg"
      alt="Macro Solutions Tools"
      className={`${className} object-contain`}
    />
  );
}