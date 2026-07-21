import React from 'react';
import peach from '../assets/CheapChompLogoPeach.png';

// Purely decorative, translucent peaches scattered behind all page content.
const PEACHES = [
  { top: '4%', left: '6%', width: '140px', opacity: 0.1, rotate: '-12deg' },
  { top: '10%', right: '8%', width: '200px', opacity: 0.08, rotate: '18deg' },
  { top: '38%', left: '2%', width: '100px', opacity: 0.12, rotate: '8deg' },
  { top: '55%', right: '4%', width: '260px', opacity: 0.07, rotate: '-20deg' },
  { top: '72%', left: '18%', width: '90px', opacity: 0.13, rotate: '25deg' },
  { bottom: '6%', right: '20%', width: '150px', opacity: 0.09, rotate: '-6deg' },
  { bottom: '14%', left: '45%', width: '110px', opacity: 0.1, rotate: '14deg' },
  { top: '25%', left: '35%', width: '80px', opacity: 0.06, rotate: '-30deg' },
];

const wrapperStyle = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: -1
};

function BackgroundPeaches() {
  return (
    <div style={wrapperStyle}>
      {PEACHES.map((peachStyle, index) => (
        <img
          key={index}
          src={peach}
          alt=""
          style={{
            position: 'absolute',
            top: peachStyle.top,
            left: peachStyle.left,
            right: peachStyle.right,
            bottom: peachStyle.bottom,
            width: peachStyle.width,
            opacity: peachStyle.opacity,
            transform: `rotate(${peachStyle.rotate})`
          }}
        />
      ))}
    </div>
  );
}

export default BackgroundPeaches;
