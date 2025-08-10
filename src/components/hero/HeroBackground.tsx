import React from 'react';
import { motion } from 'framer-motion';

const shapes = [
  {
    style: {
      width: '30rem',
      height: '30rem',
      top: '-10%',
      left: '5%',
      background: 'radial-gradient(circle, hsl(var(--primary) / 0.1), transparent 60%)',
    },
    animate: {
      x: [0, 20, -20, 0],
      y: [0, -30, 30, 0],
    },
    transition: {
      duration: 25,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
    },
  },
  {
    style: {
      width: '25rem',
      height: '25rem',
      bottom: '-15%',
      right: '10%',
      background: 'radial-gradient(circle, hsl(var(--secondary) / 0.2), transparent 70%)',
    },
    animate: {
      x: [0, -25, 25, 0],
      y: [0, 35, -35, 0],
    },
    transition: {
      duration: 30,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
      delay: 5,
    },
  },
  ...Array.from({ length: 6 }).map((_, i) => {
    const size = Math.random() * 40 + 10;
    return {
      style: {
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        background: `hsl(var(--primary) / ${Math.random() * 0.3 + 0.1})`,
        borderRadius: '50%',
      },
      animate: {
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.7, 0.4],
      },
      transition: {
        duration: Math.random() * 12 + 8,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        delay: i * 1.2,
      },
    };
  }),
];

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden blur-2xl">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={shape.style}
          animate={shape.animate}
          transition={shape.transition}
        />
      ))}
    </div>
  );
};

export default HeroBackground;