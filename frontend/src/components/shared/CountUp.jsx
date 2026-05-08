// ============================================
// CashierNova — Shared CountUp Component
// Animate numbers from a start value to an end value
// Dependencies: react
// ============================================

import { useState, useEffect } from 'react';

/**
 * CountUp Component
 * @param {number} end - Target value
 * @param {number} start - Initial value (default: 1)
 * @param {number} duration - Animation duration in ms (default: 2000)
 * @param {number} decimals - Number of decimal places (default: 0)
 * @param {string} suffix - String to append after the number (e.g., %, k+)
 * @param {string} prefix - String to prepend before the number (e.g., $)
 */
const CountUp = ({ 
  end, 
  start = 0, 
  duration = 2000, 
  decimals = 0, 
  suffix = "", 
  prefix = "" 
}) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Linear easing (can be improved to easeOut if needed)
      const currentVal = start + progress * (end - start);
      setCount(currentVal);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, start, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

export default CountUp;
