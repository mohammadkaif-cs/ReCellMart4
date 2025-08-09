import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background overflow-hidden">
      {/* Animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Floating gradient blobs */}
      <div className="absolute -left-20 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-primary/20 via-transparent to-purple-400/20 opacity-70 animate-blob-move blur-[50px]" />
      <div className="absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-secondary/20 via-transparent to-green-400/20 opacity-70 animate-blob-move-reverse blur-[50px] animation-delay-2000" />
      
      {/* Subtle animated stripes */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(100,100,100,0.12)_25%,transparent_25%,transparent_50%,rgba(100,100,100,0.12)_50%,rgba(100,100,100,0.12)_75%,transparent_75%,transparent)] bg-[length:50px_50px] opacity-30 animate-stripes" />
    </div>
  );
};

export default AnimatedBackground;