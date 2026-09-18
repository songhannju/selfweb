import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const orbs = [
  { className: 'left-[8%] top-[14%] h-72 w-72 bg-emerald-400/10', duration: 18, x: 32, y: 20 },
  { className: 'right-[10%] top-[18%] h-80 w-80 bg-amber-300/10', duration: 22, x: -28, y: 34 },
  { className: 'bottom-[2%] left-[34%] h-96 w-96 bg-teal-300/10', duration: 25, x: 24, y: -30 },
];

export default function SoftAurora() {
  const field = useRef(null);

  useGSAP(() => {
    const animations = orbs.map((orb, index) =>
      gsap.to(`.aurora-orb-${index}`, {
        x: orb.x,
        y: orb.y,
        scale: 1.08,
        duration: orb.duration,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: index * -3,
      }),
    );

    return () => animations.forEach((animation) => animation.kill());
  }, { scope: field });

  return (
    <div ref={field} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,174,153,0.1),transparent_58%)]" />
      {orbs.map((orb, index) => (
        <div
          className={`aurora-orb-${index} absolute rounded-full blur-3xl ${orb.className}`}
          key={orb.className}
        />
      ))}
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(210,230,219,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(210,230,219,0.025)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
    </div>
  );
}
