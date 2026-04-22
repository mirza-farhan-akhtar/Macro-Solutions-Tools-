export default function MacroLogo({ className = "w-10 h-10" }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagonal pattern background */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" stroke="white" strokeWidth="2"/>
      
      {/* Hexagonal pattern */}
      {Array.from({ length: 7 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const offsetX = row % 2 === 1 ? 8 : 0;
        const x = 30 + col * 16 + offsetX;
        const y = 25 + row * 14;
        const opacity = Math.random() > 0.3 ? 0.8 : 0.4;
        
        return (
          <polygon
            key={i}
            points={`${x},${y-4} ${x+4},${y-2} ${x+4},${y+2} ${x},${y+4} ${x-4},${y+2} ${x-4},${y-2}`}
            fill="white"
            opacity={opacity}
          />
        );
      })}
      
      {/* Gear/cog symbol */}
      <g transform="translate(70, 70)">
        <circle cx="0" cy="0" r="8" fill="white" opacity="0.9"/>
        <circle cx="0" cy="0" r="4" fill="url(#logoGradient)"/>
        {/* Gear teeth */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const x1 = Math.cos(angle) * 6;
          const y1 = Math.sin(angle) * 6;
          const x2 = Math.cos(angle) * 10;
          const y2 = Math.sin(angle) * 10;
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
          );
        })}
      </g>
    </svg>
  );
}